import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Upload } from "lucide-react";
import { login, register, setSession, type Role } from "@/lib/api";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

const fields = [
  { k: "fullName", l: "Họ và tên", p: "Nguyễn Văn A", t: "text" },
  { k: "org", l: "Tổ chức", p: "Khách sạn / Nhà hàng / NGO...", t: "text" },
  { k: "email", l: "Email", p: "ban@example.com", t: "email" },
  { k: "phone", l: "Số điện thoại", p: "+84 ...", t: "tel" },
  { k: "address", l: "Địa chỉ", p: "12 Lê Lợi, Quận 1, TP.HCM", t: "text" },
  { k: "password", l: "Mật khẩu", p: "Ít nhất 6 ký tự", t: "password" },
] as const;

function Register() {
  const [role, setRole] = useState<"provider" | "receiver">("provider");
  const [form, setForm] = useState({
    fullName: "",
    org: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ ...form, role: role.toUpperCase() as Role });
      // Tự đăng nhập để lấy sessionToken rồi lưu phiên.
      const { user, sessionToken } = await login(form.email, form.password);
      setSession({ user, sessionToken });
      nav({ to: user.role === "PROVIDER" ? "/provider" : "/receiver" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tạo tài khoản</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tham gia cộng đồng chia sẻ thực phẩm Food Life
        </p>
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Bạn là?</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("provider")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              role === "provider" ? "border-primary bg-primary-soft/20" : "border-border bg-card"
            }`}
          >
            <Upload className="size-5 text-primary mb-2" />
            <div className="font-semibold text-sm">Provider</div>
            <div className="text-xs text-muted-foreground">Tôi có thực phẩm để chia sẻ</div>
          </button>
          <button
            type="button"
            onClick={() => setRole("receiver")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              role === "receiver" ? "border-primary bg-primary-soft/20" : "border-border bg-card"
            }`}
          >
            <Heart className="size-5 text-accent mb-2" />
            <div className="font-semibold text-sm">Receiver</div>
            <div className="text-xs text-muted-foreground">Tôi cần thực phẩm</div>
          </button>
        </div>
      </div>

      <form className="space-y-3" onSubmit={onSubmit}>
        {fields.map((f) => (
          <div key={f.k} className="space-y-1.5">
            <label className="text-sm font-semibold">{f.l}</label>
            <input
              type={f.t}
              placeholder={f.p}
              required
              minLength={f.k === "password" ? 6 : undefined}
              value={form[f.k]}
              onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-input bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        ))}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Đang tạo..." : "Tạo tài khoản"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link to="/auth/login" className="text-primary font-semibold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
