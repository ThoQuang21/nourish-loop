import { createFileRoute } from "@tanstack/react-router";
import { Check, Package } from "lucide-react";

export const Route = createFileRoute("/receiver/history")({
  component: HistoryPage,
});

const history = [
  { date: "27/06/2026", provider: "Khách sạn Lotus Saigon", item: "Buffet trưa khách sạn", kg: 28, status: "Hoàn thành" },
  { date: "25/06/2026", provider: "Bakery Hương Việt", item: "Bánh ngọt và pastry", kg: 6, status: "Hoàn thành" },
  { date: "20/06/2026", provider: "Siêu thị Xanh Mart", item: "Rau củ tươi cận hạn", kg: 45, status: "Hoàn thành" },
  { date: "15/06/2026", provider: "Nhà hàng Cơm Niêu", item: "Cơm hộp văn phòng", kg: 12, status: "Hoàn thành" },
  { date: "10/06/2026", provider: "Khách sạn Lotus Saigon", item: "Bánh kem sự kiện", kg: 18, status: "Hoàn thành" },
];

function HistoryPage() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
        <p className="text-muted-foreground mt-1">Tổng cộng 109kg thực phẩm đã được nhận.</p>
      </header>

      <div className="relative pl-6 border-l-2 border-border space-y-6">
        {history.map((h, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[31px] size-6 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <Check className="size-3.5" />
            </span>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">{h.date}</div>
                  <div className="font-semibold mt-1">{h.item}</div>
                  <div className="text-sm text-muted-foreground">từ {h.provider}</div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    <Package className="size-3.5" /> {h.kg}kg
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{h.status}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">★★★★★ Đã đánh giá</span>
                <button className="text-primary font-semibold">Xem chi tiết</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
