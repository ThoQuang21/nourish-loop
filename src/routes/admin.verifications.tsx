import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FileText, Mail, MapPin, X } from "lucide-react";
import { verificationRequests, type VerificationRequest } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/verifications")({
  component: VerificationsPage,
});

function VerificationsPage() {
  const [items, setItems] = useState(verificationRequests);
  const [filter, setFilter] = useState<VerificationRequest["status"] | "all">("pending");

  const list = filter === "all" ? items : items.filter((v) => v.status === filter);
  const pendingCount = items.filter((v) => v.status === "pending").length;

  function updateStatus(id: string, status: VerificationRequest["status"]) {
    setItems((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Duyệt xác minh tổ chức</h1>
        <p className="text-muted-foreground mt-1">
          {pendingCount} yêu cầu đang chờ phê duyệt. Xác minh giúp tăng độ tin cậy trên nền tảng.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            ["pending", "Chờ duyệt"],
            ["approved", "Đã duyệt"],
            ["rejected", "Đã từ chối"],
            ["all", "Tất cả"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === k
                ? "bg-foreground text-background"
                : "bg-card border border-border hover:bg-secondary"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((v) => (
          <div key={v.id} className="bg-card border border-border rounded-2xl p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-lg">{v.orgName}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                      v.role === "provider"
                        ? "bg-primary-soft/40 text-primary"
                        : "bg-accent-soft text-accent-foreground"
                    }`}
                  >
                    {v.role === "provider" ? "Nhà cung cấp" : "Người nhận"}
                  </span>
                  <StatusBadge status={v.status} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{v.type}</div>
              </div>
              <div className="text-xs text-muted-foreground">{v.submittedAt}</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <span>{v.contactName} · {v.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span>{v.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                <FileText className="size-4 shrink-0" />
                <span>Hồ sơ: {v.documents}</span>
              </div>
            </div>

            {v.status === "pending" && (
              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => updateStatus(v.id, "approved")}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
                >
                  <Check className="size-4" /> Duyệt xác minh
                </button>
                <button
                  onClick={() => updateStatus(v.id, "rejected")}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border font-semibold text-sm hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-4" /> Từ chối
                </button>
              </div>
            )}
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">Không có yêu cầu nào trong mục này.</div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VerificationRequest["status"] }) {
  const map = {
    pending: { label: "CHỜ DUYỆT", cls: "bg-amber-500/15 text-amber-600" },
    approved: { label: "ĐÃ DUYỆT", cls: "bg-primary-soft/40 text-primary" },
    rejected: { label: "TỪ CHỐI", cls: "bg-destructive/15 text-destructive" },
  };
  const s = map[status];
  return (
    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${s.cls}`}>{s.label}</span>
  );
}
