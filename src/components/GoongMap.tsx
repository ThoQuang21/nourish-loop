import { useEffect, useRef, useState } from "react";
import "@goongmaps/goong-js/dist/goong-js.css";
import type { LatLng } from "@/lib/api";
import { getRoute } from "@/lib/routing";

const MAPTILES_KEY = (import.meta as any).env?.VITE_GOONG_MAPTILES_KEY as string | undefined;
// Trung tâm TP.HCM [lng, lat]
const HCMC: [number, number] = [106.7009, 10.7769];

export interface MapPost {
  id: string;
  lat: number | null;
  lng: number | null;
  title: string;
  weightKg: number;
}

interface Props {
  posts: MapPost[];
  userLocation?: LatLng | null;
  activeId?: string | null;
  onSelect?: (id: string) => void;
  height?: string;
}

export function GoongMap({ posts, userLocation, activeId, onSelect, height = "100%" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const goongRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(
    null,
  );

  // Khởi tạo map một lần — import SDK động để KHÔNG chạy lúc SSR (tránh "self is not defined").
  useEffect(() => {
    if (!containerRef.current || !MAPTILES_KEY) return;
    let cancelled = false;

    import("@goongmaps/goong-js").then((mod) => {
      const goongjs = mod.default ?? mod;
      if (cancelled || !containerRef.current) return;
      goongRef.current = goongjs;
      goongjs.accessToken = MAPTILES_KEY;
      const map = new goongjs.Map({
        container: containerRef.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: userLocation ? [userLocation.lng, userLocation.lat] : HCMC,
        zoom: 12,
      });
      mapRef.current = map;
      map.on("load", () => {
        if (!cancelled) setReady(true);
      });
    });

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove?.());
      markersRef.current = [];
      mapRef.current?.remove?.();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cập nhật marker khi posts / vị trí / activeId đổi (sau khi map sẵn sàng).
  useEffect(() => {
    const map = mapRef.current;
    const goongjs = goongRef.current;
    if (!map || !goongjs || !ready) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const pts = posts.filter((p) => p.lat != null && p.lng != null);

    pts.forEach((p) => {
      const active = p.id === activeId;
      const el = document.createElement("div");
      el.textContent = `${p.weightKg}kg`;
      el.style.cssText = `
        background:${active ? "#16a34a" : "#ffffff"};
        color:${active ? "#ffffff" : "#111827"};
        border:2px solid #16a34a;border-radius:9999px;padding:2px 8px;
        font-size:11px;font-weight:700;cursor:pointer;
        box-shadow:0 1px 4px rgba(0,0,0,.25);white-space:nowrap;
      `;
      el.title = p.title;
      el.addEventListener("click", () => onSelect?.(p.id));
      markersRef.current.push(
        new goongjs.Marker(el).setLngLat([p.lng, p.lat]).addTo(map),
      );
    });

    // Marker "vị trí của bạn"
    if (userLocation) {
      const dot = document.createElement("div");
      dot.title = "Vị trí của bạn";
      dot.style.cssText = `
        width:18px;height:18px;border-radius:9999px;background:#2563eb;
        border:3px solid #ffffff;box-shadow:0 0 0 4px rgba(37,99,235,.30);
      `;
      markersRef.current.push(
        new goongjs.Marker(dot).setLngLat([userLocation.lng, userLocation.lat]).addTo(map),
      );
    }

    // Căn khung: gồm cả tin lẫn vị trí user
    const all: [number, number][] = pts.map((p) => [p.lng as number, p.lat as number]);
    if (userLocation) all.push([userLocation.lng, userLocation.lat]);
    if (all.length === 1) {
      map.easeTo({ center: all[0], zoom: 14, duration: 500 });
    } else if (all.length > 1) {
      const bounds = new goongjs.LngLatBounds();
      all.forEach((c) => bounds.extend(c));
      map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 500 });
    }
  }, [posts, userLocation, activeId, ready, onSelect]);

  // Tuyến đường THẬT tới tin đang chọn (OSRM). Vẽ đường thẳng tạm rồi thay bằng route khi có.
  useEffect(() => {
    const map = mapRef.current;
    const goongjs = goongRef.current;
    if (!map || !goongjs || !ready) return;

    const active = posts.find((p) => p.id === activeId && p.lat != null && p.lng != null);
    let cancelled = false;

    function applyRoute(coords: [number, number][]) {
      const data =
        coords.length >= 2
          ? { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } }
          : { type: "FeatureCollection", features: [] };
      const src = map.getSource("route");
      if (src) {
        src.setData(data);
      } else {
        map.addSource("route", { type: "geojson", data });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#2563eb", "line-width": 4 },
        });
      }
    }

    if (!userLocation || !active) {
      applyRoute([]);
      setRouteInfo(null);
      return;
    }

    // Đường thẳng tạm trong lúc chờ OSRM.
    applyRoute([
      [userLocation.lng, userLocation.lat],
      [active.lng as number, active.lat as number],
    ]);

    void getRoute(userLocation, { lat: active.lat as number, lng: active.lng as number }).then(
      (r) => {
        if (cancelled) return;
        if (r) {
          applyRoute(r.coordinates);
          setRouteInfo({ distanceKm: r.distanceKm, durationMin: r.durationMin });
        } else {
          setRouteInfo(null);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [activeId, userLocation, posts, ready]);

  if (!MAPTILES_KEY) {
    return (
      <div
        style={{ height }}
        className="grid place-items-center rounded-2xl border border-dashed border-border bg-secondary/40 text-sm text-muted-foreground text-center p-6"
      >
        Thiếu <code className="mx-1">VITE_GOONG_MAPTILES_KEY</code> trong .env để hiển thị bản đồ Goong.
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height }}>
      <div ref={containerRef} style={{ height: "100%", borderRadius: 16, overflow: "hidden" }} />
      {routeInfo && (
        <div className="absolute top-3 left-3 bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold shadow-card">
          🚗 {routeInfo.distanceKm.toFixed(1)} km · {Math.round(routeInfo.durationMin)} phút
        </div>
      )}
    </div>
  );
}
