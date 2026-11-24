// Send a consistent JSON error shape across every route in the app
export function sendError(res, statusCode, message, field) {
  const payload = {
    ok: false,
    message
  };

  // Include the optional field name only when a specific form input caused the error
  if (field) {
    payload.field = field;
  }

  return res.status(statusCode).json(payload);
}