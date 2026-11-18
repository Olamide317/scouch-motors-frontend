const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const TOKEN_KEY = "scouch_access_token";
const USER_KEY = "scouch_auth_user";
const AUTH_CHANGED_EVENT = "scouch:auth-changed";

// Read the current authentication token.
export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

// Check whether a token is present.
export function isSignedIn() {
  return Boolean(getAccessToken());
}

// Return a stable string for React's
// useSyncExternalStore hook.
export function getStoredUserSnapshot() {
  if (!getAccessToken()) return null;

  return sessionStorage.getItem(USER_KEY);
}

// Allow components to observe authentication changes.
export function subscribeToAuthChanges(callback) {
  window.addEventListener(AUTH_CHANGED_EVENT, callback);

  return () => {
    window.removeEventListener(
      AUTH_CHANGED_EVENT,
      callback
    );
  };
}

function notifyAuthChanged() {
  window.dispatchEvent(
    new Event(AUTH_CHANGED_EVENT)
  );
}

// Retain compatibility with existing code that
// only saves an access token.
export function saveAccessToken(token) {
  if (typeof token !== "string" || !token) {
    throw new Error("Invalid authentication token");
  }

  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.removeItem(USER_KEY);

  notifyAuthChanged();
}

// Save a complete authenticated session.
export function saveAuthSession(token, user) {
  if (typeof token !== "string" || !token) {
    throw new Error("Invalid authentication token");
  }

  if (
    typeof user?.firstName !== "string" ||
    typeof user?.lastName !== "string" ||
    !user.firstName.trim() ||
    !user.lastName.trim()
  ) {
    throw new Error("Invalid user profile received.");
  }

  const safeUser = {
    firstName: user.firstName.trim(),
    lastName: user.lastName.trim(),
  };

  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(
    USER_KEY,
    JSON.stringify(safeUser)
  );

  notifyAuthChanged();
}

// Update the saved profile from /api/auth/me.
// Never store passwords or other sensitive details.
export function saveAuthUser(user) {
  if (!getAccessToken()) return;

  if (
    typeof user?.firstName !== "string" ||
    typeof user?.lastName !== "string"
  ) {
    return;
  }

  const safeUser = {
    firstName: user.firstName.trim(),
    lastName: user.lastName.trim(),
  };

  if (!safeUser.firstName || !safeUser.lastName) {
    return;
  }

  const serialized = JSON.stringify(safeUser);

  if (sessionStorage.getItem(USER_KEY) !== serialized) {
    sessionStorage.setItem(USER_KEY, serialized);
    notifyAuthChanged();
  }
}

// Remove both token and profile information.
export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  notifyAuthChanged();
}

// Central API request handler.
export async function apiRequest(
  path,
  {
    method = "GET",
    body,
    authenticated = false,
  } = {}
) {
  const headers = {};
  let requestToken = null;

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authenticated) {
    requestToken = getAccessToken();

    if (!requestToken) {
      throw new Error("Please sign in to continue.");
    }

    headers.Authorization = `Bearer ${requestToken}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      ...(body !== undefined
        ? { body: JSON.stringify(body) }
        : {}),
    });
  } catch {
    throw new Error("Unable to connect to the backend.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.success === false) {
    // Only clear the session that made the request.
    if (
      response.status === 401 &&
      authenticated &&
      getAccessToken() === requestToken
    ) {
      clearAccessToken();
    }

    throw new Error(
      data?.message ||
      `Request failed (${response.status})`
    );
  }

  return data;
}