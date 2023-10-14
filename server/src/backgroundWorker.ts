import { fetchAddresses, haversineDistance } from "./utils";
import type { AddressItem, IncomingMessage } from "./index.types";

// In a real-world scenario, we would use a database to store the data
const data = fetchAddresses();

process.on("message", (message: IncomingMessage) => {
  const { cityFrom, distance, requestId } = message;

  const nearbyCities = data
    .filter((city: AddressItem) => city.guid !== cityFrom.guid) // Exclude the city itself
    .filter((city: AddressItem) => {
      const d = haversineDistance(
        cityFrom.latitude,
        cityFrom.longitude,
        city.latitude,
        city.longitude
      );
      return d <= distance;
    });

  // Send the result back to the parent process
  // process.send is only available if the process was forked
  if (process.send) {
    process.send({ requestId, nearbyCities });
  }
});
