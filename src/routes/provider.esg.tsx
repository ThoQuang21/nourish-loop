import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getImpactSummary,
  getImpactWeekly,
  type ImpactSummary,
  type ImpactWeeklyDay,
} from "@/lib/api";

export const Route = createFileRoute("/provider/esg")({
  component: ESGPage,
});

function ESGPage() {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [weekly, setWeekly] = useState<ImpactWeeklyDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getImpactSummary(), getImpactWeekly()])
      .then(([s, w]) => {
        setSummary(s);
        setWeekly(w);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được báo cáo"))
      .finally(() => setLoading(false));
  }, []);

  const stats = summary
    ? [
        { label: "Tổng thực phẩm chia sẻ", value: `${summary.stats.totalKgShared} kg` },
        { label: "Giao dịch thành công", value: `${summary.stats.completedDeals}` },
        { label: "Ước tính CO₂ giảm", value: `${summary.stats.totalCo2SavedTons} tấn` },
        { label: "Người hưởng lợi", value: `~ ${summary.stats.beneficiaries}` },
      ]
    : [];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      <header>
        <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          Báo cáo ESG
        </div>
        <h1 className="text-3xl font-bold">Tác động bền vững của bạn</h1>
        <p className="text-muted-foreground mt-1">
          Dữ liệu thực tế – chia sẻ báo cáo với đối tác và nhà đầu tư.
        </p>
      </header>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="text-sm text-muted-foreground p-10 text-center">Đang tải...</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="text-3xl font-bold mt-2">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
              <h2 className="font-bold text-lg mb-1">Khối lượng chia sẻ (kg)</h2>
              <p className="text-sm text-muted-foreground mb-4">Theo ngày trong tuần</p>
              <div className="h-64">
                <ResponsiveContainer>
                  <AreaChart data={weekly}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.66 0.17 145)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="oklch(0.66 0.17 145)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 145)" />
                    <XAxis dataKey="day" stroke="oklch(0.5 0.02 145)" fontSize={12} />
                    <YAxis stroke="oklch(0.5 0.02 145)" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.02 145)" }} />
                    <Area type="monotone" dataKey="kg" stroke="oklch(0.66 0.17 145)" strokeWidth={2.5} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
              <h2 className="font-bold text-lg mb-1">Số giao dịch</h2>
              <p className="text-sm text-muted-foreground mb-4">Theo ngày trong tuần</p>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 145)" />
                    <XAxis dataKey="day" stroke="oklch(0.5 0.02 145)" fontSize={12} />
                    <YAxis stroke="oklch(0.5 0.02 145)" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.02 145)" }} />
                    <Bar dataKey="deals" fill="oklch(0.78 0.16 65)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/85 text-primary-foreground p-8 flex flex-wrap gap-6 items-center">
        <div className="flex-1 min-w-[240px]">
          <div className="text-xs font-semibold opacity-80 uppercase">Báo cáo tác động</div>
          <h3 className="text-2xl font-bold mt-1">Xuất báo cáo ESG cho cổ đông</h3>
          <p className="opacity-90 text-sm mt-2 max-w-lg">
            Một file PDF tổng hợp số liệu, biểu đồ và câu chuyện tác động của bạn – sẵn sàng cho báo cáo
            phát triển bền vững.
          </p>
        </div>
        <button className="bg-primary-foreground text-primary px-5 py-3 rounded-xl font-semibold">
          Tải báo cáo PDF
        </button>
      </div>
    </div>
  );
}
