import { useEffect, useRef, useState } from "react";
import { getUserLocation, type LatLng } from "@/lib/api";

export type LocationStatus =
  | "idle"
  | "locating"
  | "granted" // GPS realtime
  | "denied" // bị chặn -> fallback hồ sơ
  | "unavailable"; // trình duyệt không hỗ trợ -> fallback hồ sơ

export type PermissionState = "granted" | "prompt" | "denied" | "unsupported";

/**
 * Vị trí realtime qua Geolocation API (watchPosition), kết hợp Permissions API:
 * - Biết trước trạng thái quyền (granted/prompt/denied) mà KHÔNG cần prompt.
 * - Nếu đã "denied" thì không gọi geolocation nữa, fallback toạ độ hồ sơ ngay.
 * - Tự phản ứng khi user đổi quyền trong cài đặt trình duyệt.
 */
export function useUserLocation(): {
  location: LatLng | null;
  status: LocationStatus;
  permission: PermissionState;
  refresh: () => void;
} {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [permission, setPermission] = useState<PermissionState>("unsupported");
  const watchId = useRef<number | null>(null);

  function clearWatch() {
    if (
      watchId.current != null &&
      typeof navigator !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }

  function startWatch() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocation(getUserLocation());
      setStatus("unavailable");
      return;
    }
    clearWatch();
    setStatus("locating");
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
        setPermission("granted");
      },
      (err) => {
        setLocation(getUserLocation());
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setPermission("denied");
        } else {
          setStatus("unavailable");
        }
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 },
    );
  }

  useEffect(() => {
    let cancelled = false;
    let permStatus: PermissionStatus | null = null;

    async function init() {
      const perms = typeof navigator !== "undefined" ? navigator.permissions : undefined;
      if (perms?.query) {
        try {
          permStatus = await perms.query({ name: "geolocation" as PermissionName });
          if (cancelled) return;
          setPermission(permStatus.state as PermissionState);
          permStatus.onchange = () => {
            const s = permStatus!.state as PermissionState;
            setPermission(s);
            if (s === "granted") startWatch();
            else if (s === "denied") {
              clearWatch();
              setLocation(getUserLocation());
              setStatus("denied");
            }
          };
          if (permStatus.state === "denied") {
            // Đã chặn -> không prompt, dùng toạ độ hồ sơ.
            setLocation(getUserLocation());
            setStatus("denied");
            return;
          }
        } catch {
          // Permissions API không hỗ trợ name này -> bỏ qua, vẫn thử watch.
        }
      }
      startWatch();
    }

    void init();
    return () => {
      cancelled = true;
      if (permStatus) permStatus.onchange = null;
      clearWatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { location, status, permission, refresh: startWatch };
}
