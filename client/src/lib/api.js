// Read the backend base URL from Vite's environment variables and strip any trailing slash
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

// Maximum time (in milliseconds) to wait before cancelling a slow network request
const REQUEST_TIMEOUT_MS = 15000;

// Reusable JSON fetch helper with a 15-second timeout and friendly error translation
export async function requestJson(path, options = {}) {
  const controller = new AbortController();

  // Trigger abort if the server does not respond within 15 seconds
  function handleTimeout() {
    controller.abort();
  }

  const timeoutId = setTimeout(handleTimeout, REQUEST_TIMEOUT_MS);

  try {
    const fetchOptions = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      signal: controller.signal
    };

    // Attach JSON-encoded body only when provided
    if (options.body !== undefined) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

    // Safely parse JSON response; fall back if the server returned non-JSON text
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      return {
        ok: false,
        message: "Something went wrong. Please try again."
      };
    }

    // Handle HTTP error replies (400, 409, 429, 500) using the server's friendly message
    if (!response.ok || !payload || payload.ok === false) {
      const errorResult = {
        ok: false,
        message:
          payload && typeof payload.message === "string"
            ? payload.message
            : "Something went wrong. Please try again."
      };

      // Pass along the specific form field name if the server identified one
      if (payload && typeof payload.field === "string") {
        errorResult.field = payload.field;
      }

      return errorResult;
    }

    // Return successful parsed response data
    return {
      ok: true,
      data: payload
    };
  } catch (err) {
    // Distinguish a 15-second timeout from an unreachable server or offline device
    if (err && err.name === "AbortError") {
      return {
        ok: false,
        message:
          "The request is taking too long. Please check your connection and try again."
      };
    }

    return {
      ok: false,
      message:
        "We could not reach the server. Please check your internet connection and try again."
    };
  } finally {
    // Always clear the timer once the request finishes or fails
    clearTimeout(timeoutId);
  }
}

// Submit a new registrant to POST /api/register and return a guaranteed safe result shape
export async function registerPerson(formData) {
  const result = await requestJson("/api/register", {
    method: "POST",
    body: formData
  });

  if (!result.ok) {
    const failure = {
      ok: false,
      message: result.message
    };

    if (result.field) {
      failure.field = result.field;
    }

    return failure;
  }

  return {
    ok: true,
    meeting_code: result.data.meeting_code
  };
}