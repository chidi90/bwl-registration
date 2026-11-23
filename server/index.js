// Load environment variables from .env so secrets and ports are available
import "dotenv/config";
import express from "express";
import cors from "cors";

// Create the Express application and set the port from .env (defaulting to 5000)
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend access and allow Express to read JSON request bodies
app.use(cors());
app.use(express.json());

// Respond to health check requests so we can verify the server is running
function handleHealthCheck(req, res) {
  res.json({ status: "ok" });
}

// Register the GET /api/health route
app.get("/api/health", handleHealthCheck);

// Print the server address in the terminal once startup succeeds
function handleServerStart() {
  console.log(`Server running on http://localhost:${PORT}`);
}

// Start listening for incoming network requests on the chosen port
app.listen(PORT, handleServerStart);