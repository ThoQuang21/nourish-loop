import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Scale, ShieldCheck, Star } from "lucide-react";
import { getPost, getProvider } from "@/lib/mock-data";
import { MapMock } from "@/components/MapMock";

export const Route = createFileRoute("/receiver/food/$id")({
  component: FoodDetail,
});

function FoodDetail() {
  const { id } = useParams({ from: "/receiver/food/$id" });
  const post = getPost(id);
  if (!post) {
    return (
      <div className="p-10">
        <p>Không tìm thấy bài đăng.</p>
        <Link to="/receiver" className="text-primary">Quay lại bản đồ</Link>
      </div>
    );
  }
  const provider = getProvider(post.providerId);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <Link
        to="/receiver"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground mb-5"
      >
        <ArrowLeft className="size-4" /> Quay lại bản đồ
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <div className="rounded-3xl overflow-hidden aspect-[16/10] bg-muted shadow-card">
            <img src={post.image} alt={post.title} className="size-full object-cover" />
          </div>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-primary bg-primary-soft/40 inline-block px-2.5 py-1 rounded-full">
                {post.category}
              </div>
              <h1 className="text-3xl font-bold mt-3">{post.title}</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Scale className="size-4" /> {post.weightKg} kg</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-4" /> {post.pickupWindow}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> {post.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Còn lại</div>
              <div className="text-2xl font-bold text-accent-foreground">{post.expiresInHours}h</div>
            </div>
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{post.description}</p>

          <div className="mt-8">
            <h3 className="font-bold text-lg mb-3">Vị trí</h3>
            <MapMock posts={[post]} activeId={post.id} height="280px" />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <img src={provider.avatar} alt="" className="size-14 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-bold">{provider.org}</div>
                <div className="text-xs text-muted-foreground">{provider.name}</div>
              </div>
            </div>
            {provider.level === "verified" && (
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-soft/40 px-2.5 py-1 rounded-full">
                <ShieldCheck className="size-3.5" /> Đã xác minh
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
              <div>
                <div className="text-xs text-muted-foreground">Uy tín</div>
                <div className="font-bold inline-flex items-center gap-1">
                  <Star className="size-3.5 fill-accent text-accent" /> {provider.trustScore}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Đã chia sẻ</div>
                <div className="font-bold">{provider.totalKg}kg</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Giao dịch</div>
                <div className="font-bold">{provider.totalDeals}</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {provider.address}
            </div>
          </div>

          <button className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-soft hover:bg-primary/90">
            Đăng ký nhận
          </button>
          <button className="w-full h-12 rounded-2xl bg-card border border-border font-semibold hover:bg-secondary">
            Nhắn cho nhà cung cấp
          </button>

          <div className="text-xs text-muted-foreground text-center px-4">
            Food Life không kiểm tra hoặc lưu trữ thực phẩm. Vui lòng kiểm tra trực tiếp khi nhận.
          </div>
        </aside>
      </div>
    </div>
  );
}
