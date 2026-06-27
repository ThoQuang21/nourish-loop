import { MapPin } from "lucide-react";
import type { FoodPost } from "@/lib/mock-data";

interface Props {
  posts: FoodPost[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  height?: string;
}

export function MapMock({ posts, activeId, onSelect, height = "100%" }: Props) {
  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-border shadow-card"
      style={{ height }}
    >
      {/* Map base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.95 0.04 145) 0%, oklch(0.92 0.05 145) 100%)",
        }}
      />
      {/* Streets */}
      <svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <g stroke="oklch(0.85 0.03 145)" strokeWidth="0.5" fill="none">
          <path d="M0 30 Q 30 25 60 35 T 100 28" />
          <path d="M0 55 Q 25 60 50 52 T 100 60" />
          <path d="M0 78 Q 30 72 55 80 T 100 75" />
          <path d="M20 0 Q 25 30 18 60 T 30 100" />
          <path d="M55 0 Q 60 30 52 60 T 65 100" />
          <path d="M82 0 Q 78 30 85 60 T 80 100" />
        </g>
        <g stroke="oklch(0.78 0.04 145)" strokeWidth="0.3" fill="none" opacity="0.7">
          <path d="M0 15 L100 18" />
          <path d="M0 45 L100 42" />
          <path d="M0 90 L100 88" />
          <path d="M10 0 L12 100" />
          <path d="M40 0 L43 100" />
          <path d="M70 0 L72 100" />
        </g>
        {/* Water */}
        <path
          d="M0 95 Q 30 90 60 96 T 100 92 L100 100 L0 100 Z"
          fill="oklch(0.85 0.07 220 / 0.5)"
        />
        {/* Park */}
        <circle cx="35" cy="40" r="8" fill="oklch(0.82 0.12 145 / 0.5)" />
        <circle cx="75" cy="65" r="6" fill="oklch(0.82 0.12 145 / 0.5)" />
      </svg>

      {/* Pins */}
      {posts.map((p) => {
        const active = activeId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect?.(p.id)}
            className="absolute -translate-x-1/2 -translate-y-full group"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div
              className={`relative flex flex-col items-center transition-transform ${
                active ? "scale-110 z-20" : "z-10 hover:scale-105"
              }`}
            >
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-soft border whitespace-nowrap ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
              >
                {p.weightKg}kg · {p.title.split(" ").slice(0, 2).join(" ")}
              </div>
              <div
                className={`size-3 rotate-45 -mt-1.5 border-r border-b ${
                  active ? "bg-primary border-primary" : "bg-card border-border"
                }`}
              />
              <MapPin
                className={`size-4 -mt-2 ${
                  active ? "text-primary" : "text-accent"
                } fill-current drop-shadow`}
              />
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur px-3 py-2 rounded-xl shadow-soft text-xs">
        <div className="font-semibold mb-1">TP. Hồ Chí Minh</div>
        <div className="text-muted-foreground">{posts.length} bài đăng đang mở</div>
      </div>
    </div>
  );
}
