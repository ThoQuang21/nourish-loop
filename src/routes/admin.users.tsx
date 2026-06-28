import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Star, UserMinus } from "lucide-react";
import { providers, receivers, type Provider, type Receiver } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

type Tab = "all" | "providers" | "receivers" | "unverified";

function UsersPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [providerList, setProviderList] = useState(providers);
  const [receiverList, setReceiverList] = useState(receivers);

  const unverifiedCount =
    providerList.filter((p) => p.level === "community").length +
    receiverList.filter((r) => !r.verified).length;

  function toggleProviderVerified(id: string) {
    setProviderList((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, level: p.level === "verified" ? "community" : "verified" }
          : p
      )
    );
  }

  function toggleReceiverVerified(id: string) {
    setReceiverList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, verified: !r.verified } : r))
    );
  }

  const showProviders = tab === "all" || tab === "providers" || tab === "unverified";
  const showReceivers = tab === "all" || tab === "receivers" || tab === "unverified";

  const filteredProviders =
    tab === "unverified"
      ? providerList.filter((p) => p.level === "community")
      : providerList;

  const filteredReceivers =
    tab === "unverified"
      ? receiverList.filter((r) => !r.verified)
      : receiverList;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <p className="text-muted-foreground mt-1">
          {providerList.length} nhà cung cấp · {receiverList.length} người nhận · {unverifiedCount} chưa xác minh
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            ["all", "Tất cả"],
            ["providers", "Nhà cung cấp"],
            ["receivers", "Người nhận"],
            ["unverified", "Chưa xác minh"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === k
                ? "bg-foreground text-background"
                : "bg-card border border-border hover:bg-secondary"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {showProviders && filteredProviders.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">Nhà cung cấp</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 font-semibold">Tổ chức</th>
                  <th className="text-left p-4 font-semibold hidden sm:table-cell">Địa chỉ</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Thống kê</th>
                  <th className="text-left p-4 font-semibold">Trạng thái</th>
                  <th className="text-right p-4 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((p) => (
                  <ProviderRow key={p.id} provider={p} onToggle={() => toggleProviderVerified(p.id)} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showReceivers && filteredReceivers.length > 0 && (
        <section>
          <h2 className="font-bold text-lg mb-4">Người nhận</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 font-semibold">Tổ chức</th>
                  <th className="text-left p-4 font-semibold hidden sm:table-cell">Loại</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Thống kê</th>
                  <th className="text-left p-4 font-semibold">Trạng thái</th>
                  <th className="text-right p-4 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceivers.map((r) => (
                  <ReceiverRow key={r.id} receiver={r} onToggle={() => toggleReceiverVerified(r.id)} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {filteredProviders.length === 0 && filteredReceivers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">Không có người dùng nào trong mục này.</div>
      )}
    </div>
  );
}

function ProviderRow({ provider: p, onToggle }: { provider: Provider; onToggle: () => void }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-secondary/20">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img src={p.avatar} alt="" className="size-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold">{p.org}</div>
            <div className="text-xs text-muted-foreground">{p.name}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-muted-foreground hidden sm:table-cell">{p.address}</td>
      <td className="p-4 hidden md:table-cell">
        <div className="text-xs space-y-0.5">
          <div>{p.totalKg}kg đã chia sẻ</div>
          <div className="inline-flex items-center gap-1">
            <Star className="size-3 fill-accent text-accent" /> {p.trustScore}
          </div>
        </div>
      </td>
      <td className="p-4">
        {p.level === "verified" ? (
          <span className="text-[10px] font-semibold text-primary bg-primary-soft/40 px-2 py-1 rounded-full">
            ĐÃ XÁC MINH
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
            CỘNG ĐỒNG
          </span>
        )}
      </td>
      <td className="p-4 text-right">
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary hover:bg-primary/10 hover:text-primary"
        >
          <ShieldCheck className="size-3.5" />
          {p.level === "verified" ? "Thu hồi" : "Xác minh"}
        </button>
      </td>
    </tr>
  );
}

const RECEIVER_TYPE: Record<Receiver["type"], string> = {
  ngo: "Tổ chức phi lợi nhuận",
  shelter: "Mái ấm / Trại cứu hộ",
  community: "Cộng đồng",
};

function ReceiverRow({ receiver: r, onToggle }: { receiver: Receiver; onToggle: () => void }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-secondary/20">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img src={r.avatar} alt="" className="size-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold">{r.org}</div>
            <div className="text-xs text-muted-foreground">{r.name}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-muted-foreground hidden sm:table-cell">{RECEIVER_TYPE[r.type]}</td>
      <td className="p-4 hidden md:table-cell">
        <div className="text-xs space-y-0.5">
          <div>{r.totalReceivedKg}kg đã nhận</div>
          <div className="inline-flex items-center gap-1">
            <Star className="size-3 fill-accent text-accent" /> {r.trustScore}
          </div>
        </div>
      </td>
      <td className="p-4">
        {r.verified ? (
          <span className="text-[10px] font-semibold text-primary bg-primary-soft/40 px-2 py-1 rounded-full">
            ĐÃ XÁC MINH
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
            CHƯA XÁC MINH
          </span>
        )}
      </td>
      <td className="p-4 text-right">
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary hover:bg-primary/10 hover:text-primary"
        >
          {r.verified ? <UserMinus className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
          {r.verified ? "Thu hồi" : "Xác minh"}
        </button>
      </td>
    </tr>
  );
}
