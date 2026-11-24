// Import our standard error response helper
import { sendError } from "../lib/errors.js";

// Handle requests to routes that do not exist (404 Not Found)
export function notFoundHandler(req, res) {
  sendError(res, 404, "The requested resource could not be found.");
}

// Catch any unexpected server crash, log details privately, and send a safe message
export function globalErrorHandler(err, req, res, next) {
  console.error("Unexpected server error:", err);

  // If a response was already started, hand off to Express's default handler
  if (res.headersSent) {
    return next(err);
  }

  sendError(res, 500, "Something went wrong on our side. Please try again.");
}