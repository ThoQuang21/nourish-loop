import { createFileRoute } from "@tanstack/react-router";
import { Check, MapPin, ShieldCheck, Star, X } from "lucide-react";
import { foodPosts, requests } from "@/lib/mock-data";

export const Route = createFileRoute("/provider/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý yêu cầu nhận</h1>
        <p className="text-muted-foreground mt-1">
          {requests.filter((r) => r.status === "pending").length} yêu cầu đang chờ phản hồi.
        </p>
      </header>

      <div className="space-y-4">
        {requests.map((r) => {
          const post = foodPosts.find((p) => p.id === r.postId);
          return (
            <div
              key={r.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-card flex flex-wrap gap-5 items-center"
            >
              {post && (
                <img src={post.image} alt="" className="size-20 rounded-xl object-cover" />
              )}
              <div className="flex-1 min-w-[200px]">
                <div className="text-xs text-muted-foreground">{post?.title}</div>
                <div className="font-bold text-lg mt-1">{r.receiverName}</div>
                <div className="text-sm text-muted-foreground">{r.receiverOrg}</div>
                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-3.5" /> {r.distanceKm} km
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Star className="size-3.5 fill-accent text-accent" /> {r.trustScore} điểm uy tín
                  </span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-primary font-semibold">
                      <ShieldCheck className="size-3.5" /> Đã xác minh
                    </span>
                  )}
                  <span className="text-muted-foreground">· {r.createdAt}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {r.status === "pending" ? (
                  <>
                    <button className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90">
                      <Check className="size-4" /> Chấp nhận
                    </button>
                    <button className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border font-semibold text-sm hover:bg-destructive/10 hover:text-destructive">
                      <X className="size-4" /> Từ chối
                    </button>
                  </>
                ) : r.status === "accepted" ? (
                  <a
                    href="/provider/pickup"
                    className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-sm"
                  >
                    Xem mã QR
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">{r.status}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pickup confirmation card */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Xác nhận giao nhận</h2>
        <div className="bg-card border border-border rounded-3xl p-8 shadow-card flex flex-wrap gap-8 items-center">
          <div className="bg-secondary p-6 rounded-2xl">
            <QRCode />
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="text-sm text-muted-foreground">Giao dịch</div>
            <div className="font-bold text-lg">Cơm hộp dư từ căn-tin · 8kg</div>
            <div className="text-sm text-muted-foreground mt-1">→ Mái ấm Hoa Hồng Nhỏ</div>
            <p className="text-sm mt-4">
              Yêu cầu người nhận quét mã QR khi tới điểm giao nhận. Sau khi quét thành công, giao dịch
              sẽ được ghi nhận hoàn tất.
            </p>
            <button className="mt-5 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
              ✓ Xác nhận giao thành công
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function QRCode() {
  // Decorative QR-like grid
  const cells = Array.from({ length: 25 }, (_, i) => (i * 7 + 3) % 5 < 3);
  return (
    <div className="grid grid-cols-5 gap-1 size-40">
      {cells.map((on, i) => (
        <div
          key={i}
          className={`rounded-sm ${on ? "bg-foreground" : "bg-transparent"}`}
        />
      ))}
    </div>
  );
}
