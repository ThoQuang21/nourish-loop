import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

function Register() {
  const [role, setRole] = useState<"provider" | "receiver">("provider");
  const nav = useNavigate();
  const { login } = useAuth();

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

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          login(role);
          nav({ to: role === "provider" ? "/provider" : "/receiver" });
        }}
      >
        {[
          { l: "Họ và tên", p: "Nguyễn Văn A", t: "text" },
          { l: "Tổ chức", p: "Khách sạn / Nhà hàng / NGO...", t: "text" },
          { l: "Email", p: "ban@example.com", t: "email" },
          { l: "Số điện thoại", p: "+84 ...", t: "tel" },
          { l: "Địa chỉ", p: "12 Lê Lợi, Quận 1, TP.HCM", t: "text" },
        ].map((f) => (
          <div key={f.l} className="space-y-1.5">
            <label className="text-sm font-semibold">{f.l}</label>
            <input
              type={f.t}
              placeholder={f.p}
              className="w-full h-11 px-4 rounded-xl border border-input bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
        >
          Tạo tài khoản
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
