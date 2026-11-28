// Load environment variables from server/.env before importing local modules
import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./lib/supabase.js";
import { sendError } from "./lib/errors.js";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler.js";
import registerRouter from "./routes/register.js";

const PORT = process.env.PORT || 5000;
const RAW_CLIENT_URL = process.env.CLIENT_URL;

// Fail fast if CLIENT_URL is missing so CORS is never left misconfigured
if (!RAW_CLIENT_URL || !RAW_CLIENT_URL.trim()) {
  throw new Error("Missing CLIENT_URL in server/.env");
}

// Split comma-separated origins, trim spaces, and drop any empty entries
const allowedOrigins = RAW_CLIENT_URL.split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

if (allowedOrigins.length === 0) {
  throw new Error("CLIENT_URL in server/.env must list at least one valid origin");
}

const app = express();

// Restrict browser API requests so ONLY our exact allowed frontend origins can call the API
app.use(
  cors({
    origin: allowedOrigins
  })
);

// Parse incoming JSON bodies up to 100kb to prevent oversized payload abuse
app.use(express.json({ limit: "100kb" }));

// Confirm the Express server is running
function handleHealthCheck(req, res) {
  res.json({ ok: true, status: "ok" });
}

// Test the database connection by reading 'current_year' from the settings table
async function handleDatabaseHealthCheck(req, res) {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "current_year")
      .single();

    if (error) {
      console.error("Database health check failed:", error.message);
      return sendError(
        res,
        500,
        "Unable to reach the registration database right now. Please try again shortly."
      );
    }

    return res.json({ ok: true, year: data.value });
  } catch (err) {
    console.error("Unexpected error in /api/health/db:", err);
    return sendError(
      res,
      500,
      "Unable to reach the registration database right now. Please try again shortly."
    );
  }
}

// Register API routes
app.get("/api/health", handleHealthCheck);
app.get("/api/health/db", handleDatabaseHealthCheck);
app.use("/api/register", registerRouter);

// Register 404 and global error handlers AFTER all valid routes
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Print startup confirmation in the terminal
function handleServerStart() {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
}

app.listen(PORT, handleServerStart);