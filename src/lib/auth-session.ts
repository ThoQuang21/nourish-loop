export type StoredAuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: "PROVIDER" | "RECEIVER" | "ADMIN";
  profile?: {
    org?: string | null;
    address?: string | null;
  } | null;
};

export type StoredAuthSession = {
  user: StoredAuthUser;
  sessionToken: string;
  expiresAt: string;
};

const STORAGE_KEY = "nourish-loop.auth-session";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readStoredAuthSession(): StoredAuthSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function writeStoredAuthSession(session: StoredAuthSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentProviderUserId() {
  const session = readStoredAuthSession();
  if (session?.user.role === "PROVIDER") {
    return session.user.id;
  }

  return import.meta.env.VITE_PROVIDER_USER_ID ?? "";
}
