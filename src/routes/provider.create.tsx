import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Image as ImageIcon, MapPin, Scale } from "lucide-react";
import { createPost, getCurrentUser, uploadPostImage, type MatchInput } from "@/lib/api";
import { MatchSuggestions } from "@/components/MatchSuggestions";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  // Chọn ảnh: lưu file + tạo URL xem trước. Thu hồi URL cũ để tránh rò bộ nhớ.
  function pickImage(file: File) {
    setImageFile(file);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  }

  // Thu hồi URL xem trước khi rời trang.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // 1) Nếu có chọn ảnh -> upload lên Supabase qua backend, lấy URL công khai.
      let imageUrl = form.imageUrl || undefined;
      if (imageFile) {
        const uploaded = await uploadPostImage(imageFile);
        imageUrl = uploaded.imageUrl;
      }
      // 2) Tạo tin với imageUrl đã upload.
      await createPost({
        title: form.title,
        category: form.category,
        weightKg: Number(form.weightKg),
        address: form.address,
        ...(form.description ? { description: form.description } : {}),
        ...(imageUrl ? { imageUrl } : {}),
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

  // Nháp tin để gợi ý người nhận (đủ danh mục + khối lượng + địa điểm mới chấm điểm).
  const matchDraft: MatchInput | null =
    form.category && Number(form.weightKg) > 0 && form.address
      ? {
          category: form.category,
          weightKg: Number(form.weightKg),
          address: form.address,
          ...(form.title.length >= 3 ? { title: form.title } : {}),
          ...(form.pickupWindow ? { pickupWindow: form.pickupWindow } : {}),
        }
      : null;

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

        <Field label="Hình ảnh">
          <label className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary transition overflow-hidden bg-background">
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Xem trước" className="absolute inset-0 size-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition grid place-items-center text-white text-sm font-medium">
                  Đổi ảnh khác
                </div>
                <span className="absolute bottom-2 left-2 right-2 truncate text-xs text-white/90 bg-black/40 rounded px-2 py-1">
                  {imageFile?.name}
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="size-8 text-muted-foreground mb-2" />
                <span className="font-medium">Chọn ảnh thực phẩm</span>
                <span className="text-sm text-muted-foreground mt-1">PNG, JPG hoặc JPEG</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) pickImage(file);
              }}
            />
          </label>
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

      <div className="mt-6">
        <MatchSuggestions draft={matchDraft} />
      </div>
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
