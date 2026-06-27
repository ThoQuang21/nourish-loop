import { createFileRoute } from "@tanstack/react-router";
import { QrCode, ScanLine } from "lucide-react";

export const Route = createFileRoute("/receiver/scan")({
  component: ScanPage,
});

function ScanPage() {
  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Xác nhận nhận hàng</h1>
        <p className="text-muted-foreground mt-1">
          Quét mã QR mà nhà cung cấp hiển thị để xác nhận đã nhận thực phẩm.
        </p>
      </header>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-card text-center">
        <div className="relative mx-auto size-72 rounded-3xl bg-foreground/95 overflow-hidden grid place-items-center">
          <div className="absolute inset-4 border-2 border-dashed border-primary/60 rounded-2xl" />
          <ScanLine className="absolute inset-x-0 top-1/2 mx-auto size-40 text-primary/70 animate-pulse" />
          <QrCode className="size-32 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Đặt camera của bạn hướng về mã QR của nhà cung cấp.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button className="h-11 rounded-xl border border-border font-semibold hover:bg-secondary">
            Nhập mã thủ công
          </button>
          <button className="h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
            ✓ Xác nhận đã nhận
          </button>
        </div>
      </div>

      <div className="mt-6 bg-primary-soft/20 border border-primary-soft/40 rounded-2xl p-4 text-sm">
        <strong>Lưu ý:</strong> Hãy kiểm tra thực phẩm trước khi xác nhận. Food Life không kiểm tra
        chất lượng – nhưng minh bạch và đánh giá hai chiều giúp cộng đồng an toàn hơn.
      </div>
    </div>
  );
}
