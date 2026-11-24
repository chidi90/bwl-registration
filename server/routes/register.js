// Import Express router, rate limiter, database client, error helper, and validator
import express from "express";
import rateLimit from "express-rate-limit";
import { supabase } from "../lib/supabase.js";
import { sendError } from "../lib/errors.js";
import { validateRegistration } from "../lib/validateRegistration.js";

const router = express.Router();

// Read RATE_LIMIT_MAX from .env, falling back to 100 if unset or invalid
const parsedMax = Number.parseInt(process.env.RATE_LIMIT_MAX, 10);
const rateLimitMax = Number.isInteger(parsedMax) && parsedMax > 0 ? parsedMax : 100;

// Send a friendly 429 error when a connection exceeds the registration limit
function handleRateLimitExceeded(req, res) {
  return sendError(
    res,
    429,
    "Too many registrations from this connection. Please wait a few minutes and try again, or contact the registrar."
  );
}

// Rate limit ONLY successful registrations (skipFailedRequests ignores 400/409/500 errors)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: rateLimitMax,
  skipFailedRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimitExceeded
});

// Check settings and auto-mark the new registrant present when enabled
async function markInitialAttendanceIfEnabled(registrantId) {
  try {
    const { data: rows, error: settingsError } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["current_year", "auto_mark_present"]);

    if (settingsError || !rows) {
      console.error("Could not read attendance settings:", settingsError);
      return;
    }

    // Turn the settings rows into a simple key-value lookup object
    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    if (settings.auto_mark_present !== "true") {
      return;
    }

    const year = Number.parseInt(settings.current_year, 10);
    if (Number.isNaN(year)) {
      console.error("Invalid current_year in settings:", settings.current_year);
      return;
    }

    // Insert attendance row for the active meeting year
    const { error: attendanceError } = await supabase
      .from("attendance")
      .insert({ registrant_id: registrantId, year });

    if (attendanceError) {
      console.error("Auto-attendance insert failed:", attendanceError.message);
    }
  } catch (err) {
    // Log any unexpected attendance error on the server without failing registration
    console.error("Unexpected error in markInitialAttendanceIfEnabled:", err);
  }
}

// Handle POST /api/register submissions
async function handleRegister(req, res) {
  try {
    // Step 1: Validate and sanitize incoming request body
    const { error: validationError, data: cleanData } = validateRegistration(req.body);
    if (validationError) {
      return sendError(res, 400, validationError.message, validationError.field);
    }

    // Step 2: Insert clean data and return ONLY id and generated meeting_code
    const { data: registrant, error: insertError } = await supabase
      .from("registrants")
      .insert(cleanData)
      .select("id, meeting_code")
      .single();

    // Step 3: Translate Postgres error codes into safe, human-friendly messages
    if (insertError) {
      if (insertError.code === "23505") {
        return sendError(
          res,
          409,
          "This person is already registered with the same names and age range. Please check your details, or contact the registrar."
        );
      }

      if (insertError.code === "23514") {
        console.error("Database check constraint failed:", insertError.message);
        return sendError(
          res,
          400,
          "One or more selected values are invalid. Please review your details and try again."
        );
      }

      console.error("Database insert failed:", insertError);
      return sendError(res, 500, "Something went wrong on our side. Please try again.");
    }

    // Step 4: Auto-mark attendance if enabled (errors here never fail registration)
    await markInitialAttendanceIfEnabled(registrant.id);

    // Step 5: Respond 201 Created with the generated meeting code
    return res.status(201).json({
      ok: true,
      meeting_code: registrant.meeting_code,
      message: "Registration successful!"
    });
  } catch (err) {
    console.error("Unexpected error in POST /api/register:", err);
    return sendError(res, 500, "Something went wrong on our side. Please try again.");
  }
}

// Apply the rate limiter ONLY to this registration route
router.post("/", registerLimiter, handleRegister);

export default router;