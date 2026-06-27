import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [role] = useState<"provider" | "receiver">("provider");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Đăng nhập</h1>
        <p className="text-muted-foreground mt-1 text-sm">Chào mừng trở lại với Food Life 🌱</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
          if (email.includes("admin")) {
            nav({ to: "/admin" });
          } else {
            nav({ to: role === "provider" ? "/provider" : "/receiver" });
          }
        }}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Email</label>
          <input
            name="email"
            type="email"
            defaultValue="minhanh@lotussaigon.vn"
            className="w-full h-11 px-4 rounded-xl border border-input bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Mật khẩu</label>
          <input
            type="password"
            defaultValue="••••••••"
            className="w-full h-11 px-4 rounded-xl border border-input bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-primary" />
            Ghi nhớ tôi
          </label>
          <a className="text-primary font-semibold hover:underline cursor-pointer">
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
        >
          Đăng nhập
        </button>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-background px-3 text-xs text-muted-foreground">Hoặc</span>
        </div>

        <button
          type="button"
          className="w-full h-11 rounded-xl border border-border bg-card font-semibold flex items-center justify-center gap-2 hover:bg-secondary"
        >
          <svg className="size-5" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.4 0 10.3-2 14-5.4l-6.5-5.5c-2 1.4-4.7 2.4-7.5 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.5c-.5.5 7-5 7-15.2 0-1.2-.1-2.3-.4-3.5z"
            />
          </svg>
          Tiếp tục với Google
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link to="/auth/register" className="text-primary font-semibold hover:underline">
          Đăng ký ngay
        </Link>
      </p>
      <p className="text-center text-xs text-muted-foreground">
        Quản trị viên? Dùng email chứa &quot;admin&quot; hoặc{" "}
        <Link to="/admin" className="text-primary font-semibold hover:underline">
          vào bảng điều khiển
        </Link>
      </p>
    </div>
  );
}
