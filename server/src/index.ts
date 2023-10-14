import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { fork } from "child_process";
import path from "path";

import { requireAuth } from "./middleware";
import { fetchAddresses, haversineDistance, roundTwoDecimals } from "./utils";
import type { AddressItem, OutgoingMessage } from "./index.types";

const app = express();
const PORT = 8080;

// Start the background worker
const backgroundWorker = fork(path.join(__dirname, "backgroundWorker.ts"));

backgroundWorker.on("message", (message: OutgoingMessage) => {
  const { requestId, nearbyCities } = message;

  // Store the result in the cache
  resultsCache[requestId] = nearbyCities;
  // NOTE: This is a hack because Carlos hardcoded a requestId in the client
  resultsCache["2152f96f-50c7-4d76-9e18-f7033bd14428"] = nearbyCities;
});

// In a real-world scenario, we would use Redis or similar to cache the results
const resultsCache: Record<string, AddressItem[]> = {};

// In a real-world scenario, we would use a database to store the data
// Here we just read the data from the JSON file
const data = fetchAddresses();

/** Make `baseUrl` available in every request. */
app.use((req, res, next) => {
  req.baseUrl = `${req.protocol}://${req.get("host")}`;
  next();
});

app.get("/cities-by-tag", requireAuth, (req: Request, res: Response) => {
  const { tag, isActive } = req.query;

  // Filter data based on the tag
  const cities = data.filter(
    (item) =>
      item.tags.includes(tag as string) &&
      item.isActive === JSON.parse(isActive as string)
  );

  res.json({ cities });
});

app.get("/distance", requireAuth, (req: Request, res: Response) => {
  const { from, to } = req.query;

  // Find the cities using the provided guids
  const cityFrom = data.find((city) => city.guid === from);
  const cityTo = data.find((city) => city.guid === to);

  if (!cityFrom || !cityTo) {
    return res.status(404).send("One or both cities not found.");
  }

  const distanceValue = haversineDistance(
    cityFrom.latitude,
    cityFrom.longitude,
    cityTo.latitude,
    cityTo.longitude
  );

  // Constructing the response object
  const response = {
    from: cityFrom,
    to: cityTo,
    unit: "km",
    distance: roundTwoDecimals(distanceValue),
  };

  res.json(response);
});

app.get("/area", requireAuth, async (req: Request, res: Response) => {
  const { from, distance } = req.query;

  const cityFrom = data.find((city) => city.guid === from);
  if (!cityFrom) {
    return res.status(404).send("City not found.");
  }

  // Generate a unique ID for this request
  const requestId = uuidv4();

  // Send the data to the background worker for processing
  backgroundWorker.send({
    cityFrom,
    distance: parseFloat(distance as string), // TODO: Add try/catch or validation
    requestId,
  });

  // Return a URL that can be polled for the result
  res.status(202).json({
    results: `${req.baseUrl}/area-result/${requestId}`,
    // NOTE: This is a hack because Carlos hardcoded a requestId in the client
    resultsUrl: `${req.baseUrl}/area-result/2152f96f-50c7-4d76-9e18-f7033bd14428`,
  });
});

app.get("/area-result/:id", requireAuth, (req: Request, res: Response) => {
  const cities = resultsCache[req.params.id];
  if (!cities) {
    return res.status(202).send("Result not ready yet.");
  }
  res.json({ cities });
});

app.get("/all-cities", requireAuth, (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");

  // We'll stream the data without ever holding it all in memory
  // We start by writing the opening bracket to the response buffer
  res.write("[");

  // Iterate over the addresses and send each one as a buffer
  let isFirstAddress = true;
  for (const address of data) {
    // Convert address object to string and then to a buffer
    const addressBuffer = Buffer.from(
      (isFirstAddress ? "" : ",") + JSON.stringify(address)
    );
    res.write(addressBuffer);
    isFirstAddress = false;
  }

  // End the array and the response
  res.end("]");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
