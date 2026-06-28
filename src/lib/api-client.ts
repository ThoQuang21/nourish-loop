const rawApiBaseUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim();

if (!rawApiBaseUrl) {
  throw new Error("Missing VITE_API_URL. Add it to .env before running the frontend.");
}

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

type JsonRequestInit = RequestInit & {
  body?: BodyInit | null;
};

export async function requestJson<T>(
  path: string,
  init?: JsonRequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${path.replace(/^\//, "")}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload?.message ??
      payload?.error ??
      `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return payload as T;
}
