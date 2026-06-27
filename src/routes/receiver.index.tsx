import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { FoodCard } from "@/components/FoodCard";
import { MapMock } from "@/components/MapMock";
import { foodPosts, getProvider } from "@/lib/mock-data";

export const Route = createFileRoute("/receiver/")({
  component: ReceiverMap,
});

function ReceiverMap() {
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [maxDist, setMaxDist] = useState(10);

  const enriched = useMemo(
    () =>
      foodPosts
        .filter((p) => p.status === "open" || p.status === "matched")
        .map((p, i) => ({ ...p, distanceKm: 0.8 + i * 0.9 })),
    []
  );

  const list = enriched.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (verifiedOnly && getProvider(p.providerId).level !== "verified") return false;
    if (p.distanceKm > maxDist) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] md:h-screen overflow-hidden">
      {/* Top search bar */}
      <div className="border-b border-border bg-card px-4 md:px-6 py-3 flex flex-wrap gap-3 items-center sticky top-0 z-20">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm thực phẩm, nhà cung cấp..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none text-sm"
          />
        </div>
        <FilterChip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
          <ShieldCheck className="size-3.5" /> Chỉ Verified
        </FilterChip>
        <FilterChip>
          <Filter className="size-3.5" /> Loại thực phẩm
        </FilterChip>
        <FilterChip>Khối lượng</FilterChip>
        <FilterChip>Thời gian</FilterChip>
        <div className="hidden md:flex items-center gap-2 text-xs">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span>≤ {maxDist} km</span>
          <input
            type="range"
            min={1}
            max={20}
            value={maxDist}
            onChange={(e) => setMaxDist(Number(e.target.value))}
            className="accent-primary w-28"
          />
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_520px] min-h-0">
        {/* Map */}
        <div className="p-4 md:p-6 min-h-[300px] lg:min-h-0">
          <MapMock
            posts={list}
            activeId={activeId}
            onSelect={(id) => setActiveId(id)}
            height="100%"
          />
        </div>

        {/* List */}
        <div className="border-t lg:border-t-0 lg:border-l border-border bg-background overflow-y-auto">
          <div className="p-5 sticky top-0 bg-background/95 backdrop-blur border-b border-border z-10">
            <div className="flex items-baseline justify-between">
              <h2 className="font-bold text-lg">{list.length} bài đăng gần bạn</h2>
              <button className="text-xs font-semibold text-primary">Sắp xếp: Gần nhất</button>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {list.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Không tìm thấy bài đăng phù hợp.
              </div>
            ) : (
              list.map((p) => (
                <div
                  key={p.id}
                  onMouseEnter={() => setActiveId(p.id)}
                  className={activeId === p.id ? "ring-2 ring-primary rounded-2xl" : ""}
                >
                  <FoodCard post={p} distanceKm={p.distanceKm} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card border-border hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}
