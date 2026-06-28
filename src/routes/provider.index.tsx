import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, History, Inbox, PackagePlus, ShieldCheck, Sparkles } from "lucide-react";
import {
  getImpactSummary,
  listIncomingRequests,
  respondToRequest,
  type ImpactSummary,
  type IncomingRequestDTO,
} from "@/lib/api";

export const Route = createFileRoute("/provider/")({
  component: ProviderDashboard,
});

function ProviderDashboard() {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [requests, setRequests] = useState<IncomingRequestDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const [s, r] = await Promise.all([
        getImpactSummary(),
        listIncomingRequests({ status: "PENDING" }),
      ]);
      setSummary(s);
      setRequests(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được bảng điều khiển");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function respond(id: string, status: "ACCEPTED" | "REJECTED") {
    setBusy(id);
    try {
      await respondToRequest(id, status);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không cập nhật được yêu cầu");
    } finally {
      setBusy(null);
    }
  }

  const st = summary?.stats;
  const stats = [
    { label: "Bài đăng đang hoạt động", value: st?.activePosts ?? 0, accent: "text-primary" },
    { label: "Tổng số kg đã chia sẻ", value: `${st?.totalKgShared ?? 0}kg`, accent: "text-accent-foreground" },
    { label: "Giao dịch hoàn thành", value: st?.completedDeals ?? 0, accent: "text-primary" },
    { label: "Điểm uy tín", value: `${st?.trustScore ?? 0} ★`, accent: "text-accent-foreground" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {summary?.headline.verified && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-soft/40 px-2.5 py-1 rounded-full mb-2">
              <ShieldCheck className="size-3.5" /> Đã xác minh
            </div>
          )}
          <h1 className="text-3xl font-bold">
            Xin chào, {summary?.provider.org ?? summary?.provider.fullName ?? "Provider"} 🌿
          </h1>
          <p className="text-muted-foreground mt-1">
            Hôm nay bạn có {st?.activePosts ?? 0} bài đăng đang hoạt động và{" "}
            {summary?.headline.newRequests ?? requests.length} yêu cầu nhận mới.
          </p>
        </div>
        <Link
          to="/provider/create"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold shadow-soft hover:bg-primary/90"
        >
          <PackagePlus className="size-4" /> Đăng thực phẩm
        </Link>
      </header>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 shadow-card">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className={`text-3xl font-bold mt-2 ${s.accent}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg">Yêu cầu nhận mới</h2>
            <Link to="/provider/requests" className="text-sm text-primary font-semibold inline-flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                Chưa có yêu cầu nhận mới.
              </div>
            ) : (
              requests.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition"
                >
                  <div className="size-10 rounded-xl bg-primary-soft/40 text-primary grid place-items-center">
                    <Inbox className="size-5" />
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <div className="font-semibold">{r.receiverName}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.receiverOrg} · {r.distanceKm} km · {r.trustScore} ★
                    </div>
                  </div>
                  {r.verified && (
                    <span className="text-[10px] font-semibold text-primary bg-primary-soft/40 px-2 py-1 rounded-full">
                      ĐÃ XÁC MINH
                    </span>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => respond(r.id, "ACCEPTED")}
                      disabled={busy === r.id}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-60"
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() => respond(r.id, "REJECTED")}
                      disabled={busy === r.id}
                      className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold disabled:opacity-60"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-6 shadow-card relative overflow-hidden">
          <Sparkles className="absolute -top-4 -right-4 size-32 opacity-20" />
          <div className="text-sm opacity-90 font-medium">Tác động của bạn</div>
          <div className="text-4xl font-bold mt-3">+ {st?.totalCo2SavedTons ?? 0} tấn CO₂</div>
          <div className="text-sm opacity-90 mt-1">đã được giảm thiểu nhờ bạn</div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span>Thực phẩm chia sẻ</span><span className="font-semibold">{st?.totalKgShared ?? 0} kg</span></div>
            <div className="flex justify-between"><span>Người hưởng lợi</span><span className="font-semibold">~ {st?.beneficiaries ?? 0}</span></div>
            <div className="flex justify-between"><span>Giao dịch</span><span className="font-semibold">{st?.completedDeals ?? 0}</span></div>
          </div>
          <Link to="/provider/esg" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold underline">
            Xem báo cáo ESG <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { to: "/provider/create", title: "Đăng thực phẩm", body: "Tạo bài đăng mới", icon: PackagePlus },
          { to: "/provider/requests", title: "Xem yêu cầu nhận", body: `${requests.length} yêu cầu mới`, icon: Inbox },
          { to: "/provider/posts", title: "Xem lịch sử", body: "Tất cả bài đăng", icon: History },
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
