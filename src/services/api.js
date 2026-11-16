const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const TOKEN_KEY = "scouch_access_token";

export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function saveAccessToken(token) {
  if (typeof token !== "string" || !token) {
    throw new Error("Invalid authentication token");
  }

  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(
  path,
  { method = "GET", body, authenticated = false } = {}
) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authenticated) {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Please sign in to continue.");
    }

    headers.Authorization = `Bearer ${token}`;
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
    if (response.status === 401 && authenticated) {
      clearAccessToken();
    }

    throw new Error(
      data?.message || `Request failed (${response.status})`
    );
  }

  return data;
}