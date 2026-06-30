import { auth } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let token = "";
  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "API Request Failed");
  }

  return response.json();
}
