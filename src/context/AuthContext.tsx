import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "provider" | "receiver";

export interface AuthUser {
  id: string;
  name: string;
  org: string;
  avatar: string;
  role: UserRole;
}

const MOCK_USERS: Record<UserRole, AuthUser> = {
  provider: {
    id: "p1",
    name: "Nguyễn Minh Anh",
    org: "Khách sạn Lotus Saigon",
    avatar: "https://i.pravatar.cc/80?img=11",
    role: "provider",
  },
  receiver: {
    id: "r1",
    name: "Bếp ăn Tình Thương",
    org: "NGO Hạt Mầm",
    avatar: "https://i.pravatar.cc/80?img=32",
    role: "receiver",
  },
};

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "food_life_user_role";

function getSavedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "provider" || saved === "receiver") return MOCK_USERS[saved];
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getSavedUser);

  const login = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role]);
    localStorage.setItem(STORAGE_KEY, role);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
