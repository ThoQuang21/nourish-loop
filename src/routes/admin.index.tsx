import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ClipboardList,
  Package,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  foodPosts,
  impactStats,
  providers,
  receivers,
  requests,
  stories,
  verificationRequests,
} from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const pendingVerifications = verificationRequests.filter((v) => v.status === "pending");
  const openPosts = foodPosts.filter((p) => p.status === "open");
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pendingStories = stories.filter((s) => s.status === "pending");
  const unverifiedProviders = providers.filter((p) => p.level === "community");
  const unverifiedReceivers = receivers.filter((r) => !r.verified);

  const stats = [
    {
      label: "Tổ chức đã xác minh",
      value: providers.filter((p) => p.level === "verified").length + receivers.filter((r) => r.verified).length,
      sub: `${providers.length + receivers.length} tổng`,
      accent: "text-primary",
    },
    {
      label: "Bài đăng đang mở",
      value: openPosts.length,
      sub: `${foodPosts.length} tổng bài`,
      accent: "text-accent-foreground",
    },
    {
      label: "Giao dịch hoàn thành",
      value: impactStats.deals,
      sub: `${requests.length} đang xử lý`,
      accent: "text-primary",
    },
    {
      label: "Thực phẩm cứu trợ",
      value: `${(impactStats.totalKg / 1000).toFixed(1)}t`,
      sub: `${impactStats.co2Tons}t CO₂ giảm`,
      accent: "text-accent-foreground",
    },
  ];

  const alerts = [
    {
      to: "/admin/verifications",
      count: pendingVerifications.length,
      label: "yêu cầu xác minh chờ duyệt",
      icon: ShieldCheck,
    },
    {
      to: "/admin/requests",
      count: pendingRequests.length,
      label: "giao dịch chờ xử lý",
      icon: ClipboardList,
    },
    {
      to: "/admin/stories",
      count: pendingStories.length,
      label: "câu chuyện chờ duyệt",
      icon: Package,
    },
  ].filter((a) => a.count > 0);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      <header>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full mb-2">
          <ShieldCheck className="size-3.5" /> Quản trị viên
        </div>
        <h1 className="text-3xl font-bold">Bảng điều khiển Food Life</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý nền tảng kết nối thực phẩm dư thừa — {impactStats.partners}+ đối tác trên toàn quốc.
        </p>
      </header>

      {alerts.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-3">
          {alerts.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition"
            >
              <div className="size-10 rounded-xl bg-destructive/15 text-destructive grid place-items-center">
                <a.icon className="size-5" />
              </div>
              <div>
                <div className="font-bold text-destructive">{a.count}</div>
                <div className="text-xs text-muted-foreground">{a.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 shadow-card">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className={`text-3xl font-bold mt-2 ${s.accent}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg">Xác minh chờ duyệt</h2>
            <Link to="/admin/verifications" className="text-sm text-primary font-semibold inline-flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingVerifications.slice(0, 3).map((v) => (
              <div key={v.id} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50">
                <div className="size-10 rounded-xl bg-primary-soft/40 text-primary grid place-items-center text-xs font-bold">
                  {v.role === "provider" ? "NC" : "NN"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{v.orgName}</div>
                  <div className="text-xs text-muted-foreground">
                    {v.type} · {v.submittedAt}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/15 px-2 py-1 rounded-full shrink-0">
                  CHỜ DUYỆT
                </span>
              </div>
            ))}
            {pendingVerifications.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Không có yêu cầu chờ duyệt.</p>
            )}
          </div>
        </section>

        <section className="bg-card border border-border rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg">Tổ chức chưa xác minh</h2>
            <Link to="/admin/users" className="text-sm text-primary font-semibold inline-flex items-center gap-1">
              Quản lý <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {[...unverifiedProviders.slice(0, 2), ...unverifiedReceivers.slice(0, 2)].map((u) => (
              <div key={"id" in u ? u.id : u.org} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <img src={u.avatar} alt="" className="size-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{u.org}</div>
                  <div className="text-xs text-muted-foreground">{u.name}</div>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  CHƯA XÁC MINH
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/admin/verifications", title: "Duyệt xác minh", body: `${pendingVerifications.length} chờ duyệt`, icon: ShieldCheck },
          { to: "/admin/users", title: "Quản lý người dùng", body: `${providers.length + receivers.length} tổ chức`, icon: Users },
          { to: "/admin/posts", title: "Kiểm duyệt bài đăng", body: `${openPosts.length} đang mở`, icon: Package },
          { to: "/admin/requests", title: "Theo dõi giao dịch", body: `${requests.length} giao dịch`, icon: TrendingUp },
        ].map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="group bg-card border border-border rounded-2xl p-5 hover:border-primary hover:shadow-soft transition-all"
          >
            <q.icon className="size-6 text-primary mb-3" />
            <div className="font-semibold">{q.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{q.body}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
