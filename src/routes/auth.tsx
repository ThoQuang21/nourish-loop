import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=70"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/60 to-primary/20" />
        <div className="relative h-full flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-primary-foreground text-primary grid place-items-center">
              <Leaf className="size-5" />
            </div>
            <span className="font-display font-bold text-xl">Food Life</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-3">
              Mỗi bữa ăn được cứu là một bước tới một Việt Nam bền vững.
            </h2>
            <p className="opacity-90">
              500+ tổ chức đã cùng chúng tôi chia sẻ hơn 10.000kg thực phẩm.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
