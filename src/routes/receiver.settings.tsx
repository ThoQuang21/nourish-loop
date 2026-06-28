import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getMatchingSettings,
  updateMatchingSettings,
  type MatchingSettings,
  type OperatingHour,
} from "@/lib/api";

export const Route = createFileRoute("/receiver/settings")({
  component: ReceiverSettings,
});

const WEEKDAYS = [
  { key: "MON", label: "Thứ 2" },
  { key: "TUE", label: "Thứ 3" },
  { key: "WED", label: "Thứ 4" },
  { key: "THU", label: "Thứ 5" },
  { key: "FRI", label: "Thứ 6" },
  { key: "SAT", label: "Thứ 7" },
  { key: "SUN", label: "Chủ nhật" },
];

const ACCEPTS: { key: keyof MatchingSettings; label: string }[] = [
  { key: "acceptsPreparedMeals", label: "Bữa ăn nấu sẵn" },
  { key: "acceptsBreadCereal", label: "Bánh mì & ngũ cốc" },
  { key: "acceptsVegetables", label: "Rau củ quả" },
  { key: "acceptsFruits", label: "Trái cây" },
  { key: "acceptsDairy", label: "Sữa & sản phẩm" },
  { key: "acceptsDryGoods", label: "Lương thực khô" },
  { key: "acceptsOther", label: "Khác" },
];

function ReceiverSettings() {
  const me = getCurrentUser();
  const [s, setS] = useState<MatchingSettings | null>(null);
  const [hours, setHours] = useState<Record<string, OperatingHour>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!me) {
      setLoading(false);
      setError("Vui lòng đăng nhập bằng tài khoản receiver.");
      return;
    }
    getMatchingSettings(me.id)
      .then((data) => {
        setS(data);
        const map: Record<string, OperatingHour> = {};
        WEEKDAYS.forEach((w) => {
          map[w.key] =
            data.operatingHours.find((h) => h.weekday === w.key) ??
            { weekday: w.key, openTime: "08:00", closeTime: "17:00", isActive: false };
        });
        setHours(map);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được cấu hình"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function upd<K extends keyof MatchingSettings>(k: K, v: MatchingSettings[K]) {
    setS((prev) => (prev ? { ...prev, [k]: v } : prev));
  }

  function updHour(weekday: string, patch: Partial<OperatingHour>) {
    setHours((prev) => ({ ...prev, [weekday]: { ...prev[weekday], ...patch } }));
  }

  async function save() {
    if (!me || !s) return;
    setSaving(true);
    setMsg(null);
    setError(null);
    try {
      const operatingHours = WEEKDAYS.map((w) => hours[w.key]);
      const updated = await updateMatchingSettings({ receiverId: me.id, ...s, operatingHours });
      setS(updated);
      setMsg("Đã lưu cấu hình ghép nối.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 text-sm text-muted-foreground">Đang tải...</div>;
  if (error && !s) return <div className="p-10 text-sm text-destructive">{error}</div>;
  if (!s) return null;

  const numField = (k: "maxCapacityKg" | "currentLoadKg" | "serviceRadiusKm") => (
    <input
      type="number"
      min={0}
      value={s[k] ?? ""}
      onChange={(e) => upd(k, e.target.value === "" ? null : Number(e.target.value))}
      className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
    />
  );

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Cấu hình ghép nối</h1>
        <p className="text-muted-foreground mt-1">
          Hệ thống dùng các thông tin này để gợi ý bài đăng phù hợp tới bạn.
        </p>
      </header>

      {/* Bật/tắt */}
      <section className="bg-card border border-border rounded-3xl p-5 lg:p-6 space-y-4">
        <Toggle
          label="Bật ghép nối tự động"
          desc="Cho phép hệ thống gợi ý bạn cho các bài đăng phù hợp."
          checked={s.matchingEnabled}
          onChange={(v) => upd("matchingEnabled", v)}
        />
        <Toggle
          label="Tự động nhận khi khớp"
          desc="Tự động chấp nhận bài đăng có độ phù hợp cao."
          checked={s.autoAcceptMatch}
          onChange={(v) => upd("autoAcceptMatch", v)}
        />
      </section>

      {/* Sức chứa & bán kính */}
      <section className="bg-card border border-border rounded-3xl p-5 lg:p-6 grid sm:grid-cols-3 gap-4">
        <Field label="Sức chứa tối đa (kg)">{numField("maxCapacityKg")}</Field>
        <Field label="Đang nhận (kg)">{numField("currentLoadKg")}</Field>
        <Field label="Bán kính phục vụ (km)">{numField("serviceRadiusKm")}</Field>
      </section>

      {/* Danh mục nhận */}
      <section className="bg-card border border-border rounded-3xl p-5 lg:p-6">
        <h2 className="font-bold mb-3">Loại thực phẩm nhận</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {ACCEPTS.map((a) => (
            <label key={a.key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-primary size-4"
                checked={Boolean(s[a.key])}
                onChange={(e) => upd(a.key, e.target.checked as MatchingSettings[typeof a.key])}
              />
              {a.label}
            </label>
          ))}
        </div>
      </section>

      {/* Giờ hoạt động */}
      <section className="bg-card border border-border rounded-3xl p-5 lg:p-6">
        <h2 className="font-bold mb-3">Khung giờ nhận hàng</h2>
        <div className="space-y-2">
          {WEEKDAYS.map((w) => {
            const h = hours[w.key];
            if (!h) return null;
            return (
              <div key={w.key} className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 w-28 text-sm font-medium">
                  <input
                    type="checkbox"
                    className="accent-primary size-4"
                    checked={h.isActive}
                    onChange={(e) => updHour(w.key, { isActive: e.target.checked })}
                  />
                  {w.label}
                </label>
                <input
                  type="time"
                  value={h.openTime}
                  disabled={!h.isActive}
                  onChange={(e) => updHour(w.key, { openTime: e.target.value })}
                  className="h-10 px-3 rounded-xl border border-input bg-background disabled:opacity-50"
                />
                <span className="text-muted-foreground">—</span>
                <input
                  type="time"
                  value={h.closeTime}
                  disabled={!h.isActive}
                  onChange={(e) => updHour(w.key, { closeTime: e.target.value })}
                  className="h-10 px-3 rounded-xl border border-input bg-background disabled:opacity-50"
                />
              </div>
            );
          })}
        </div>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {msg && <p className="text-sm text-primary">{msg}</p>}

      <button
        onClick={save}
        disabled={saving}
        className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60"
      >
        {saving ? "Đang lưu..." : "Lưu cấu hình"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <input
        type="checkbox"
        className="accent-primary size-5 mt-0.5"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
