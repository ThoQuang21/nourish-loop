// API client cho backend Nourish-Loop (NestJS). Khớp đúng endpoint + payload backend.
// Base URL: đặt qua biến môi trường VITE_API_URL, mặc định localhost:3000/api.
const API_URL =
  ((import.meta as any).env?.VITE_API_URL as string | undefined) ??
  "http://localhost:3000/api";

export type Role = "PROVIDER" | "RECEIVER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  avatarUrl: string | null;
  profile?: Record<string, unknown> | null;
}

// ---------- Session (auth không JWT: lưu user + sessionToken ở localStorage) ----------
const SESSION_KEY = "nl_session";

export interface Session {
  user: AuthUser;
  sessionToken: string;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export function setSession(session: Session): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): AuthUser | null {
  return getSession()?.user ?? null;
}

function getToken(): string | null {
  return getSession()?.sessionToken ?? null;
}

// ---------- Low-level fetch ----------
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const userId = getCurrentUser()?.id;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Backend provider endpoints đọc user hiện tại từ header x-user-id (MVP).
      ...(userId ? { "x-user-id": userId } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const m = data?.message;
    const msg = Array.isArray(m) ? m.join(", ") : (m ?? `Lỗi ${res.status}`);
    throw new Error(msg);
  }
  return data as T;
}

function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ===================== AUTH =====================
export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  org: string;
  phone: string;
  address: string;
}

export function register(input: RegisterInput): Promise<AuthUser> {
  return request<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; sessionToken: string; expiresAt: string }> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  try {
    await request("/auth/logout", { method: "POST" });
  } finally {
    clearSession();
  }
}

export function getMe(): Promise<AuthUser> {
  return request<AuthUser>("/auth/me");
}

// ===================== PROVIDER: FOOD POSTS =====================
// Backend trả về đã map sẵn về shape FE (category nhãn VN, status chữ thường, image, ...).
export interface FoodPostDTO {
  id: string;
  title: string;
  category: string;
  weightKg: number;
  description: string;
  image: string;
  imageUrl: string;
  address: string;
  district: string;
  pickupWindow: string;
  expiresInHours: number;
  providerId: string;
  status: "open" | "matched" | "completed" | "expired";
}

export interface CreatePostInput {
  title: string;
  category: string; // enum code: PREPARED_MEAL | BREAD_CEREAL | ...
  weightKg: number;
  address: string;
  description?: string;
  imageUrl?: string;
  district?: string;
  pickupWindow?: string;
  expiresInHours?: number;
}

export function listMyPosts(query: {
  status?: string;
  search?: string;
} = {}): Promise<FoodPostDTO[]> {
  return request<FoodPostDTO[]>(`/provider/posts${qs(query)}`);
}

export interface ProviderPostDetail extends FoodPostDTO {
  requests: IncomingRequestDTO[];
  transactions: {
    id: string;
    qrCode: string;
    confirmedByProvider: boolean;
    confirmedByReceiver: boolean;
    completedAt: string | null;
  }[];
  provider: {
    id: string;
    name: string;
    org: string;
    trustScore: number;
    level: "verified" | "community";
    avatar: string;
    address: string;
  };
}

export function getMyPost(id: string): Promise<ProviderPostDetail> {
  return request<ProviderPostDetail>(`/provider/posts/${id}`);
}

export function createPost(input: CreatePostInput): Promise<FoodPostDTO> {
  return request<FoodPostDTO>("/provider/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updatePost(id: string, input: Partial<CreatePostInput>): Promise<FoodPostDTO> {
  return request<FoodPostDTO>(`/provider/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deletePost(id: string): Promise<FoodPostDTO> {
  return request<FoodPostDTO>(`/provider/posts/${id}`, { method: "DELETE" });
}

// ===================== PROVIDER: MATCHING (gợi ý người nhận) =====================
export interface MatchInput {
  category: string;
  weightKg: number;
  address: string;
  title?: string;
  description?: string;
  district?: string;
  lat?: number;
  lng?: number;
  pickupWindow?: string;
}

export interface MatchCandidate {
  receiverId: string;
  receiverName: string;
  receiverOrg: string;
  receiverAddress: string;
  verified: boolean;
  trustScore: number;
  distanceKm: number | null;
  capacityLeftKg: number | null;
  availabilityLabel: string;
  autoAcceptMatch: boolean;
  matchScore: number;
  matchPercent: number;
  reasons: string[];
  breakdown: {
    distanceScore: number;
    ratingScore: number;
    capacityScore: number;
    availabilityScore: number;
  };
}

export interface MatchPreview {
  formula: { distance: number; rating: number; capacity: number; availability: number };
  matches: MatchCandidate[];
  postDraft: Record<string, unknown>;
}

export function previewMatches(input: MatchInput): Promise<MatchPreview> {
  return request<MatchPreview>("/provider/matching/preview", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ===================== PROVIDER: REQUESTS (incoming) =====================
export interface IncomingRequestDTO {
  id: string;
  postId: string;
  receiverId: string;
  receiverName: string;
  receiverOrg: string;
  distanceKm: number;
  trustScore: number;
  verified: boolean;
  status: "pending" | "accepted" | "completed" | "rejected" | "cancelled";
  createdAt: string;
  transactionId: string | null;
  qrCode: string | null;
}

export function listIncomingRequests(query: {
  postId?: string;
  status?: "PENDING" | "ACCEPTED" | "COMPLETED" | "REJECTED" | "CANCELLED";
} = {}): Promise<IncomingRequestDTO[]> {
  return request<IncomingRequestDTO[]>(`/provider/requests/incoming${qs(query)}`);
}

export function respondToRequest(
  id: string,
  status: "ACCEPTED" | "REJECTED",
  note?: string,
): Promise<{ request: IncomingRequestDTO; transaction?: { id: string; qrCode: string } }> {
  return request(`/provider/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...(note ? { note } : {}) }),
  });
}

// ===================== PROVIDER: TRANSACTIONS =====================
export function confirmTransaction(id: string, qrCode: string): Promise<unknown> {
  return request(`/provider/transactions/${id}/confirm`, {
    method: "POST",
    body: JSON.stringify({ qrCode }),
  });
}

// ===================== PROVIDER: NOTIFICATIONS =====================
export interface NotificationDTO {
  id: string;
  type: "request" | "accepted" | "reminder" | "expiring";
  title: string;
  body: string;
  postId: string | null;
  time: string;
  unread: boolean;
}

// Notifications dùng chung mọi vai trò (đọc theo x-user-id từ session).
export function listNotifications(unread?: boolean): Promise<NotificationDTO[]> {
  return request<NotificationDTO[]>(
    `/notifications${unread === undefined ? "" : qs({ unread })}`,
  );
}

export function markNotificationRead(id: string): Promise<NotificationDTO> {
  return request<NotificationDTO>(`/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead(): Promise<{ updated: number }> {
  return request<{ updated: number }>(`/notifications/read-all`, { method: "PATCH" });
}

// ===================== PROVIDER: IMPACT / ESG =====================
export interface ImpactSummary {
  headline: {
    providerName: string;
    verified: boolean;
    trustScore: number;
    activePosts: number;
    newRequests: number;
  };
  stats: {
    activePosts: number;
    totalKgShared: number;
    completedDeals: number;
    trustScore: number;
    totalCo2SavedKg: number;
    totalCo2SavedTons: number;
    beneficiaries: number;
    unreadNotifications: number;
  };
  provider: {
    id: string;
    fullName: string;
    email: string;
    org: string;
    level: "verified" | "community";
  };
}

export interface ImpactWeeklyDay {
  date: string;
  day: string;
  deals: number;
  kg: number;
  co2SavedKg: number;
}

export function getImpactSummary(): Promise<ImpactSummary> {
  return request<ImpactSummary>("/provider/impact/summary");
}

export function getImpactWeekly(): Promise<ImpactWeeklyDay[]> {
  return request<ImpactWeeklyDay[]>("/provider/impact/weekly");
}

// ===================== PROVIDER: UPLOAD ẢNH =====================
export async function uploadPostImage(file: File): Promise<{ imageUrl: string }> {
  const token = getToken();
  const userId = getCurrentUser()?.id;
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${API_URL}/provider/uploads/post-image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(userId ? { "x-user-id": userId } : {}),
    },
    body: fd,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? `Lỗi tải ảnh ${res.status}`);
  return data;
}

// ===================== PUBLIC: BROWSE TIN (cho receiver) =====================
export interface ProviderBrief {
  id: string;
  name: string;
  org: string;
  level: "verified" | "community";
  trustScore: number;
  totalKg: number;
  totalDeals: number;
  avatar: string;
  address: string;
}

export interface PublicPostDTO extends FoodPostDTO {
  lat: number | null;
  lng: number | null;
  provider: ProviderBrief;
}

export function listPosts(
  query: { search?: string; category?: string; status?: string; minKg?: number } = {},
): Promise<PublicPostDTO[]> {
  return request<PublicPostDTO[]>(`/posts${qs(query)}`);
}

export function getPublicPost(id: string): Promise<PublicPostDTO> {
  return request<PublicPostDTO>(`/posts/${id}`);
}

export interface LatLng {
  lat: number;
  lng: number;
}

/** Vị trí của người đang đăng nhập (lấy từ toạ độ hồ sơ trong session). */
export function getUserLocation(): LatLng | null {
  const p = getCurrentUser()?.profile as
    | { lat?: number | null; lng?: number | null }
    | null
    | undefined;
  if (p && typeof p.lat === "number" && typeof p.lng === "number") {
    return { lat: p.lat, lng: p.lng };
  }
  return null;
}

/** Khoảng cách đường chim bay (km) giữa 2 toạ độ. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

// ===================== RECEIVER: REQUESTS =====================
// Lưu ý: endpoint receiver trả RAW Prisma shape (status HOA, category enum, imageUrl).
export interface ReceiverRequestDTO {
  id: string;
  postId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "REJECTED" | "CANCELLED";
  distanceKm: number | null;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  post?: {
    id: string;
    title: string;
    category: string;
    weightKg: number;
    status: string;
    imageUrl: string | null;
    district: string | null;
    pickupWindow: string | null;
    provider?: { id: string; fullName: string; avatarUrl: string | null };
  };
}

export function createRequest(input: {
  postId: string;
  receiverId: string;
  distanceKm?: number;
  message?: string;
}): Promise<ReceiverRequestDTO> {
  return request<ReceiverRequestDTO>("/requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listMyRequests(query: {
  receiverId?: string;
  status?: "PENDING" | "ACCEPTED" | "COMPLETED" | "REJECTED" | "CANCELLED";
} = {}): Promise<ReceiverRequestDTO[]> {
  return request<ReceiverRequestDTO[]>(`/requests${qs(query)}`);
}

export function getRequest(id: string): Promise<ReceiverRequestDTO> {
  return request<ReceiverRequestDTO>(`/requests/${id}`);
}

export function cancelRequest(id: string): Promise<ReceiverRequestDTO> {
  return request<ReceiverRequestDTO>(`/requests/${id}/cancel`, { method: "PATCH" });
}

/** Receiver xác nhận đã nhận → đóng đơn (hoàn tất giao dịch). */
export function confirmReceived(requestId: string): Promise<ReceiverRequestDTO> {
  const receiverId = getCurrentUser()?.id;
  return request<ReceiverRequestDTO>(
    `/requests/${requestId}/complete${qs({ receiverId })}`,
    { method: "PATCH" },
  );
}

export interface ReceiverHistoryItem {
  id: string;
  date: string | null;
  providerName: string;
  providerOrg: string;
  item: string;
  image: string;
  kg: number;
  co2SavedKg: number;
  status: string;
  rated: boolean;
  ratingScore: number | null;
}

/** Lịch sử nhận (giao dịch đã hoàn tất) của receiver. */
export function listHistory(receiverId: string): Promise<ReceiverHistoryItem[]> {
  return request<ReceiverHistoryItem[]>(`/requests/history${qs({ receiverId })}`);
}

/** Đánh giá đối phương sau giao dịch hoàn tất (raterId lấy từ session). */
export function createReview(input: {
  transactionId: string;
  score: number;
  comment?: string;
}): Promise<{ success: boolean; trustScore: number }> {
  const raterId = getCurrentUser()?.id;
  return request("/reviews", {
    method: "POST",
    body: JSON.stringify({ ...input, raterId }),
  });
}

// ===================== STORIES (câu chuyện tác động) =====================
export interface StoryDTO {
  id: string;
  author: string;
  org: string;
  avatar: string;
  image: string;
  text: string;
  thanksTo: string;
  daysAgo: number;
  likes: number;
  status: string;
}

export function listStories(): Promise<StoryDTO[]> {
  return request<StoryDTO[]>("/stories");
}

export function createStory(input: {
  text: string;
  imageUrl?: string;
  thanksToProviderId?: string;
}): Promise<StoryDTO> {
  const authorId = getCurrentUser()?.id;
  return request<StoryDTO>("/stories", {
    method: "POST",
    body: JSON.stringify({ ...input, authorId }),
  });
}

export function likeStory(id: string): Promise<{ id: string; likes: number }> {
  return request(`/stories/${id}/like`, { method: "POST" });
}

// ===================== RECEIVER: CẤU HÌNH MATCHING =====================
export interface OperatingHour {
  weekday: string; // MON..SUN
  openTime: string; // "08:00"
  closeTime: string; // "17:00"
  isActive: boolean;
}

export interface MatchingSettings {
  maxCapacityKg: number | null;
  currentLoadKg: number | null;
  serviceRadiusKm: number | null;
  autoAcceptMatch: boolean;
  matchingEnabled: boolean;
  acceptsPreparedMeals: boolean;
  acceptsBreadCereal: boolean;
  acceptsVegetables: boolean;
  acceptsFruits: boolean;
  acceptsDairy: boolean;
  acceptsDryGoods: boolean;
  acceptsOther: boolean;
  operatingHours: OperatingHour[];
}

export function getMatchingSettings(receiverId: string): Promise<MatchingSettings> {
  return request<MatchingSettings>(`/receiver/settings${qs({ receiverId })}`);
}

export function updateMatchingSettings(
  input: Partial<MatchingSettings> & { receiverId: string },
): Promise<MatchingSettings> {
  return request<MatchingSettings>("/receiver/settings", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
