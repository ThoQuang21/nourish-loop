import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, Clock, MapPin, Scale } from "lucide-react";

export const Route = createFileRoute("/provider/create")({
  component: CreatePost,
});

const categories = [
  "Bữa ăn nấu sẵn",
  "Bánh mì & ngũ cốc",
  "Rau củ quả",
  "Trái cây",
  "Sữa & sản phẩm",
  "Lương thực khô",
  "Khác",
];

function CreatePost() {
  const nav = useNavigate();
  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Đăng thực phẩm</h1>
        <p className="text-muted-foreground mt-1">
          Mỗi bài đăng là một bữa ăn được cứu khỏi lãng phí.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          nav({ to: "/provider/posts" });
        }}
        className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-card space-y-6"
      >
        <Field label="Tên thực phẩm">
          <input
            placeholder="Ví dụ: Buffet trưa khách sạn (suất ăn)"
            className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
            required
          />
        </Field>

        <Field label="Danh mục">
          <select className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:border-primary outline-none">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Khối lượng (kg)">
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="number"
                defaultValue={10}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
              />
            </div>
          </Field>
          <Field label="Thời gian có thể lấy">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                placeholder="14:30 – 16:00 hôm nay"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
              />
            </div>
          </Field>
        </div>

        <Field label="Mô tả">
          <textarea
            rows={4}
            placeholder="Mô tả tình trạng thực phẩm, bao bì, điều kiện bảo quản..."
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:border-primary outline-none resize-none"
          />
        </Field>

        <Field label="Hình ảnh">
          <button
            type="button"
            className="w-full border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary hover:bg-primary-soft/10 transition"
          >
            <Camera className="size-8 mx-auto text-muted-foreground mb-2" />
            <div className="font-semibold text-sm">Tải ảnh lên hoặc kéo thả</div>
            <div className="text-xs text-muted-foreground mt-1">PNG, JPG tối đa 5MB</div>
          </button>
        </Field>

        <Field label="Địa điểm">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              defaultValue="12 Lê Lợi, Quận 1, TP.HCM"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background focus:border-primary outline-none"
            />
          </div>
        </Field>

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
            className="flex-1 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
          >
            Đăng thực phẩm
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
