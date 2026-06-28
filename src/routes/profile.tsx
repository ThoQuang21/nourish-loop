import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";
import {
  getCurrentUser,
  getReviewsForUser,
  type ReviewReceived,
} from "@/lib/api";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const me = getCurrentUser();
  const [reviews, setReviews] = useState<ReviewReceived[]>([]);

  useEffect(() => {
    if (me) getReviewsForUser(me.id).then(setReviews).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!me) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Vui lòng đăng nhập để xem hồ sơ.{" "}
        <Link to="/auth/login" className="text-primary font-semibold">
          Đăng nhập
        </Link>
      </div>
    );
  }

  const p = (me.profile ?? {}) as {
    org?: string | null;
    address?: string | null;
    level?: string | null;
    trustScore?: number | null;
    totalKg?: number | null;
    totalDeals?: number | null;
  };
  const verified = p.level === "VERIFIED";
  // Quay lại đúng khu vực theo vai trò (không về landing -> tránh cảm giác bị logout).
  const backTo =
    me.role === "PROVIDER" ? "/provider" : me.role === "ADMIN" ? "/admin" : "/receiver";

  const stats = [
    { l: "Uy tín", v: `${p.trustScore ?? 0}`, icon: <Star className="size-4 fill-accent text-accent" /> },
    { l: "Giao dịch", v: `${p.totalDeals ?? 0}` },
    { l: "Đã chia sẻ/nhận", v: `${(p.totalKg ?? 0).toLocaleString("vi-VN")}kg` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 lg:p-10">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground mb-5"
        >
          <ArrowLeft className="size-4" /> Quay lại
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-card">
          <div className="flex flex-wrap items-start gap-6">
            <img
              src={me.avatarUrl ?? "https://i.pravatar.cc/200?img=11"}
              alt=""
              className="size-24 rounded-2xl object-cover bg-muted"
            />
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{p.org || me.fullName}</h1>
                {verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary-soft/40 px-2 py-1 rounded-full">
                    <ShieldCheck className="size-3.5" /> Đã xác minh
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{me.fullName}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {p.address ? `${p.address} · ` : ""}
                {me.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            {stats.map((s) => (
              <div key={s.l} className="bg-secondary rounded-2xl p-4">
                <div className="text-xs text-muted-foreground">{s.l}</div>
                <div className="text-2xl font-bold mt-1 inline-flex items-center gap-1">
                  {s.icon}
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Đánh giá nhận được ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center text-sm text-muted-foreground">
              Chưa có đánh giá nào.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="text-accent">{"★".repeat(r.score)}</div>
                  {r.comment && <p className="text-sm mt-2">{r.comment}</p>}
                  <div className="text-xs text-muted-foreground mt-3">
                    — {r.raterOrg || r.raterName} · {r.daysAgo} ngày trước
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
