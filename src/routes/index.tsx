import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Heart,
  Leaf,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { foodPosts, impactStats, stories } from "@/lib/mock-data";
import { FoodCard } from "@/components/FoodCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Food Life – Kết nối thực phẩm dư thừa với những nơi cần nó nhất" },
      {
        name: "description",
        content:
          "Food Life giúp các tổ chức và cộng đồng chia sẻ thực phẩm dư thừa một cách nhanh chóng, minh bạch và bền vững.",
      },
      { property: "og:title", content: "Food Life – Chia sẻ thực phẩm dư thừa" },
      {
        property: "og:description",
        content: "Kết nối nhà cung cấp uy tín với tổ chức cần thực phẩm – trước khi nó trở thành rác.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="size-5" />
            </div>
            <span className="font-display font-bold text-lg">Food Life</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#how" className="text-foreground/70 hover:text-foreground">Cách hoạt động</a>
            <a href="#impact" className="text-foreground/70 hover:text-foreground">Tác động</a>
            <a href="#stories" className="text-foreground/70 hover:text-foreground">Câu chuyện</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="text-sm font-semibold text-foreground/80 hover:text-foreground">
              Đăng nhập
            </Link>
            <Link
              to="/auth/register"
              className="hidden sm:inline-flex text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grain pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-semibold">
              <Sparkles className="size-3.5 text-accent" />
              Nền tảng chia sẻ thực phẩm dư thừa #1 Việt Nam
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Kết nối <span className="text-primary">thực phẩm dư thừa</span> với những nơi cần nó nhất.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Food Life giúp các tổ chức và cộng đồng chia sẻ thực phẩm dư thừa một cách nhanh chóng,
              minh bạch và bền vững – trước khi chúng trở thành rác.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold shadow-soft hover:bg-primary/90"
              >
                <Upload className="size-4" />
                Tôi muốn chia sẻ thực phẩm
              </Link>
              <Link
                to="/receiver"
                className="inline-flex items-center gap-2 bg-card border border-border px-5 py-3 rounded-xl font-semibold hover:bg-secondary"
              >
                <Heart className="size-4 text-accent" />
                Tôi cần thực phẩm
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[11, 12, 5, 9, 24].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/80?img=${i}`}
                    alt=""
                    className="size-9 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">500+ đối tác tin cậy</div>
                <div className="text-muted-foreground text-xs">
                  Nhà hàng, siêu thị, NGO, bếp ăn xã hội
                </div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-border bg-card">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=70"
                alt="Bữa ăn được chia sẻ"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="bg-card/95 backdrop-blur rounded-2xl px-4 py-3 shadow-soft">
                  <div className="text-xs text-muted-foreground">Hôm nay đã cứu</div>
                  <div className="font-bold text-lg text-primary">847 kg thực phẩm</div>
                </div>
                <div className="bg-accent text-accent-foreground rounded-2xl px-4 py-3 shadow-soft">
                  <div className="text-xs opacity-80">CO₂ giảm</div>
                  <div className="font-bold text-lg">2.5 tấn</div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur rounded-2xl p-4 shadow-soft flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary-soft/50 text-primary grid place-items-center">
                  <PackageCheck className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Vừa có giao dịch mới</div>
                  <div className="text-xs text-muted-foreground">
                    Lotus Saigon → Bếp ăn Tình Thương · 28kg
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary-soft/40 px-2 py-1 rounded-full">
                  ĐÃ XÁC MINH
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-card border border-border p-4 hidden md:block">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span className="text-xs font-semibold">2,000+ giao dịch thành công</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Cách hoạt động
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Ba bước đơn giản để cứu một bữa ăn</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Đăng thực phẩm dư thừa",
                body: "Nhà cung cấp đăng nhanh các phần thực phẩm còn tốt cùng địa điểm và thời gian có thể lấy.",
                icon: Upload,
                color: "bg-primary-soft/40 text-primary",
              },
              {
                step: "02",
                title: "Tìm kiếm & đăng ký nhận",
                body: "Tổ chức cần thực phẩm khám phá trên bản đồ, lọc theo khoảng cách và đăng ký nhận.",
                icon: MapPin,
                color: "bg-accent-soft text-accent-foreground",
              },
              {
                step: "03",
                title: "Xác nhận giao nhận",
                body: "Hai bên gặp nhau, xác nhận bằng QR và đánh giá – mọi giao dịch đều minh bạch.",
                icon: PackageCheck,
                color: "bg-primary-soft/40 text-primary",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-card border border-border rounded-3xl p-8 shadow-card hover:-translate-y-1 transition-transform"
              >
                <div className={`size-12 rounded-2xl grid place-items-center mb-5 ${s.color}`}>
                  <s.icon className="size-6" />
                </div>
                <div className="text-xs font-bold text-muted-foreground mb-2">BƯỚC {s.step}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="py-20 lg:py-24 bg-primary/95 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0%, transparent 40%)" }} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">Tác động đến hôm nay</h2>
            <p className="opacity-90 mt-3">
              Mỗi kg thực phẩm được cứu là một bữa ăn ấm, một giọt nước, một bước cho hành tinh.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { k: `${(impactStats.totalKg / 1000).toFixed(0)}.000kg`, v: "Thực phẩm được chia sẻ" },
              { k: `${impactStats.partners}+`, v: "Đối tác tham gia" },
              { k: `${(impactStats.deals / 1000).toFixed(1)}.000`, v: "Giao dịch thành công" },
              { k: `${impactStats.co2Tons} tấn`, v: "CO₂ giảm thiểu" },
            ].map((s) => (
              <div key={s.v} className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-3xl p-6">
                <div className="text-4xl font-bold mb-1">{s.k}</div>
                <div className="text-sm opacity-90">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live posts */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                Đang có sẵn
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Thực phẩm gần bạn ngay bây giờ</h2>
            </div>
            <Link
              to="/receiver"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Xem bản đồ <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {foodPosts.filter((p) => p.status === "open").slice(0, 4).map((p) => (
              <FoodCard key={p.id} post={p} distanceKm={1.2 + Math.random() * 4} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-soft/40 text-primary text-xs font-semibold mb-4">
              <ShieldCheck className="size-3.5" /> Hệ thống tin cậy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Minh bạch là nền tảng của mọi bữa ăn
            </h2>
            <p className="text-muted-foreground mb-6">
              Food Life không kiểm tra, không lưu trữ, không vận chuyển thực phẩm. Chúng tôi xây dựng
              niềm tin – qua xác minh tổ chức, đánh giá lẫn nhau, lịch sử minh bạch và xác nhận bằng QR.
            </p>
            <ul className="space-y-3">
              {[
                "Xác minh doanh nghiệp & địa chỉ thật",
                "Điểm uy tín dựa trên lịch sử giao dịch",
                "Xác nhận giao nhận bằng mã QR",
                "Đánh giá hai chiều sau mỗi giao dịch",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-primary-soft/40 text-primary grid place-items-center mt-0.5">
                    <ShieldCheck className="size-3.5" />
                  </span>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div id="stories" className="space-y-4">
            {stories.slice(0, 2).map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-3xl p-5 shadow-card flex gap-4">
                <img src={s.image} alt="" className="size-24 rounded-2xl object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={s.avatar} alt="" className="size-6 rounded-full" />
                    <div className="text-sm font-semibold">{s.org}</div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{s.text}</p>
                  <div className="text-xs text-primary font-semibold mt-2">
                    ❤️ Cảm ơn {s.thanksTo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-[2rem] bg-foreground text-background p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, oklch(0.66 0.17 145) 0%, transparent 50%)" }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
              Hãy bắt đầu cứu một bữa ăn hôm nay
            </h2>
            <p className="opacity-80 max-w-xl mx-auto mb-7 relative">
              Tham gia cộng đồng 500+ nhà cung cấp và tổ chức xã hội đang cùng nhau chống lãng phí thực phẩm.
            </p>
            <div className="flex flex-wrap gap-3 justify-center relative">
              <Link to="/auth/register" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90">
                Đăng ký miễn phí
              </Link>
              <Link to="/receiver" className="bg-background/10 backdrop-blur border border-background/20 px-6 py-3 rounded-xl font-semibold hover:bg-background/20">
                Khám phá Food Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="size-4" />
            </div>
            <span className="font-semibold text-foreground">Food Life</span>
            <span>© 2026</span>
          </div>
          <div>Vì một Việt Nam không lãng phí thực phẩm 🌱</div>
        </div>
      </footer>
    </div>
  );
}
