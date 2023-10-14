import { Request, Response, NextFunction } from "express";

// Middleware for Bearer token authorization
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // If no token is provided, return 401 Unauthorized
  }

  // In a real-world scenario, we would verify the token here, probably using an auth service.
  // For this basic example, we'll just check if the decoded token is "thesecrettoken"
  const decodedToken = Buffer.from(token, "base64").toString("utf8");
  if (decodedToken !== "thesecrettoken") {
    return res.sendStatus(403); // Forbidden, the token is not valid
  }

  next();
}
