import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Scale, ShieldCheck } from "lucide-react";
import type { FoodPost } from "@/lib/mock-data";
import { getProvider } from "@/lib/mock-data";

interface Props {
  post: FoodPost;
  distanceKm?: number;
  compact?: boolean;
}

export function FoodCard({ post, distanceKm, compact }: Props) {
  const provider = getProvider(post.providerId);
  const verified = provider.level === "verified";

  return (
    <Link
      to="/receiver/food/$id"
      params={{ id: post.id }}
      className="group block rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={post.image}
          alt={post.title}
          className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-card/95 backdrop-blur text-foreground shadow-sm">
            {post.category}
          </span>
        </div>
        {distanceKm !== undefined && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-foreground/85 text-background backdrop-blur">
            {distanceKm.toFixed(1)} km
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/95 text-accent-foreground">
          <Clock className="size-3.5" />
          Còn {post.expiresInHours}h
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight line-clamp-1">{post.title}</h3>
          {!compact && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.pickupWindow}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <img src={provider.avatar} alt="" className="size-7 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{provider.org}</div>
          </div>
          {verified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary-soft/40 px-2 py-0.5 rounded-full">
              <ShieldCheck className="size-3" /> Đã xác minh
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
          <span className="inline-flex items-center gap-1">
            <Scale className="size-3.5" /> {post.weightKg}kg
          </span>
          <span className="inline-flex items-center gap-1 truncate">
            <MapPin className="size-3.5" /> {post.district}
          </span>
        </div>
      </div>
    </Link>
  );
}
