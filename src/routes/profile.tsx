import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const activity = [
    { d: "Hôm nay", t: "Chia sẻ 'Buffet trưa khách sạn' · 28kg" },
    { d: "Hôm qua", t: "Hoàn thành giao dịch với Bếp ăn Tình Thương" },
    { d: "3 ngày trước", t: "Được đánh giá 5★ từ Trại cứu hộ Sài Gòn Time" },
    { d: "1 tuần trước", t: "Đạt mốc 100 giao dịch thành công 🎉" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 lg:p-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft className="size-4" /> Quay lại
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-card">
          <div className="flex flex-wrap items-start gap-6">
            <img src="https://i.pravatar.cc/200?img=11" alt="" className="size-24 rounded-2xl object-cover" />
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Khách sạn Lotus Saigon</h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary-soft/40 px-2 py-1 rounded-full">
                  <ShieldCheck className="size-3.5" /> Đã xác minh
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Nguyễn Minh Anh · Tham gia từ 03/2025</div>
              <div className="text-sm text-muted-foreground mt-1">12 Lê Lợi, Quận 1, TP.HCM · minhanh@lotussaigon.vn</div>
            </div>
            <button className="px-4 py-2 rounded-xl border border-border font-semibold hover:bg-secondary">
              Chỉnh sửa
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { l: "Uy tín", v: "4.9", icon: <Star className="size-4 fill-accent text-accent" /> },
              { l: "Giao dịch", v: "124" },
              { l: "Đã chia sẻ", v: "1,840kg" },
              { l: "Hoàn thành", v: "98%" },
            ].map((s) => (
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
          <h2 className="text-xl font-bold mb-4">Lịch sử hoạt động</h2>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border shadow-card">
            {activity.map((a, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="text-xs text-muted-foreground w-24 flex-shrink-0">{a.d}</div>
                <div className="text-sm">{a.t}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Đánh giá nhận được</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { who: "Bếp ăn Tình Thương", text: "Thực phẩm đúng giờ, đóng gói cẩn thận. Cảm ơn rất nhiều!", stars: 5 },
              { who: "Mái ấm Hoa Hồng Nhỏ", text: "Đối tác tuyệt vời, mong được hợp tác dài lâu.", stars: 5 },
            ].map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <div className="text-accent">{"★".repeat(r.stars)}</div>
                <p className="text-sm mt-2">{r.text}</p>
                <div className="text-xs text-muted-foreground mt-3">— {r.who}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
