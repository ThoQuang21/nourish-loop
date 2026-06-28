import { API_BASE_URL, requestJson } from "./api-client";

export type ProviderMatchCandidate = {
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
};

export type ProviderPostPayload = {
  title: string;
  category: string;
  weightKg: number;
  description?: string;
  imageUrl?: string;
  address: string;
  district?: string;
  pickupWindow?: string;
};

export type ProviderPostResponse = ProviderPostPayload & {
  id: string;
  image: string;
  expiresInHours: number;
  providerId: string;
  status: "open" | "matched" | "completed" | "expired";
  matching?: {
    receiversNotified: number;
    topReceivers: ProviderMatchCandidate[];
  };
};

export type PreviewProviderMatchResponse = {
  formula: {
    distance: number;
    rating: number;
    capacity: number;
    availability: number;
  };
  matches: ProviderMatchCandidate[];
};

function providerHeaders(providerId: string) {
  return {
    "x-user-id": providerId,
  };
}

export function previewProviderMatches(
  providerId: string,
  payload: ProviderPostPayload,
) {
  return requestJson<PreviewProviderMatchResponse>("provider/matching/preview", {
    method: "POST",
    headers: providerHeaders(providerId),
    body: JSON.stringify(payload),
  });
}

export function createProviderPost(
  providerId: string,
  payload: ProviderPostPayload,
) {
  return requestJson<ProviderPostResponse>("provider/posts", {
    method: "POST",
    headers: providerHeaders(providerId),
    body: JSON.stringify(payload),
  });
}

export async function uploadProviderPostImage(providerId: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/provider/uploads/post-image`, {
    method: "POST",
    headers: providerHeaders(providerId),
    body: formData,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload?.message ??
      payload?.error ??
      `Upload failed with status ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return payload as {
    imageUrl?: string;
    publicUrl?: string;
    bucket: string;
    path: string;
  };
}
