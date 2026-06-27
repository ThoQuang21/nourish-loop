import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Image as ImageIcon, MapPin, Scale } from "lucide-react";
import { createPost, getCurrentUser } from "@/lib/api";

export const Route = createFileRoute("/provider/create")({
  component: CreatePost,
});

// Nhãn hiển thị (tiếng Việt) -> enum code khớp backend (FoodCategory).
const categories = [
  { value: "PREPARED_MEAL", label: "Bữa ăn nấu sẵn" },
  { value: "BREAD_CEREAL", label: "Bánh mì & ngũ cốc" },
  { value: "VEGETABLES", label: "Rau củ quả" },
  { value: "FRUITS", label: "Trái cây" },
  { value: "DAIRY", label: "Sữa & sản phẩm" },
  { value: "DRY_GOODS", label: "Lương thực khô" },
  { value: "OTHER", label: "Khác" },
];

function CreatePost() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: categories[0].value,
    weightKg: "10",
    pickupWindow: "",
    description: "",
    imageUrl: "",
    address: "12 Lê Lợi, Quận 1, TP.HCM",
    expiresInHours: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const user = getCurrentUser();
    if (!user) {
      setError("Vui lòng đăng nhập (tài khoản Provider) trước khi đăng tin.");
      return;
    }

    setLoading(true);
    try {
      await createPost({
        title: form.title,
        category: form.category,
        weightKg: Number(form.weightKg),
        address: form.address,
        ...(form.description ? { description: form.description } : {}),
        ...(form.imageUrl ? { imageUrl: form.imageUrl } : {}),
        ...(form.pickupWindow ? { pickupWindow: form.pickupWindow } : {}),
        ...(form.expiresInHours ? { expiresInHours: Number(form.expiresInHours) } : {}),
      });
      nav({ to: "/provider/posts" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng tin thất bại");
    } finally {
      setLoading(false);
    }
  }

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Đăng thực phẩm</h1>
        <p className="text-muted-foreground mt-1">
          Mỗi bài đăng là một bữa ăn được cứu khỏi lãng phí.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-card space-y-6"
      >
        <Field label="Tên thực phẩm">
          <input
            placeholder="Ví dụ: Buffet trưa khách sạn (suất ăn)"
            className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
            required
            value={form.title}
            onChange={set("title")}
          />
        </Field>

        <Field label="Danh mục">
          <select
            className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
            value={form.category}
            onChange={set("category")}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Khối lượng (kg)">
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="number"
                min={0}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
                value={form.weightKg}
                onChange={set("weightKg")}
              />
            </div>
          </Field>
          <Field label="Thời gian có thể lấy">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                placeholder="14:30 – 16:00 hôm nay"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
                value={form.pickupWindow}
                onChange={set("pickupWindow")}
              />
            </div>
          </Field>
        </div>

        <Field label="Hết hạn sau (giờ) — tuỳ chọn">
          <input
            type="number"
            min={1}
            placeholder="Ví dụ: 3"
            className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
            value={form.expiresInHours}
            onChange={set("expiresInHours")}
          />
        </Field>

        <Field label="Mô tả">
          <textarea
            rows={4}
            placeholder="Mô tả tình trạng thực phẩm, bao bì, điều kiện bảo quản..."
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:border-primary outline-none resize-none"
            value={form.description}
            onChange={set("description")}
          />
        </Field>

        <Field label="Hình ảnh (URL)">
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="url"
              placeholder="https://... (dán link ảnh; upload sẽ xử lý sau)"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
              value={form.imageUrl}
              onChange={set("imageUrl")}
            />
          </div>
        </Field>

        <Field label="Địa điểm">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
              required
              value={form.address}
              onChange={set("address")}
            />
          </div>
        </Field>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => nav({ to: "/provider" })}
            className="px-5 py-3 rounded-xl border border-border font-semibold hover:bg-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Đang đăng..." : "Đăng thực phẩm"}
          </button>
        </div>
      </form>
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
