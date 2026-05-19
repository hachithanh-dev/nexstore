"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    toast.success("Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi trong 24h.");
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Đã gửi thành công!</h3>
        <p className="text-muted-foreground text-sm">Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
        <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSent(false)}>
          Gửi tin nhắn khác
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">Họ tên</Label>
          <Input id="name" required placeholder="Nguyễn Văn A" className="rounded-xl h-11 bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
          <Input id="email" type="email" required placeholder="email@example.com" className="rounded-xl h-11 bg-background/50" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-foreground">Chủ đề</Label>
        <Input id="subject" required placeholder="Hỗ trợ đơn hàng, tư vấn sản phẩm..." className="rounded-xl h-11 bg-background/50" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-foreground">Nội dung</Label>
        <textarea
          id="message"
          required
          rows={5}
          placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all text-foreground resize-none"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-violet-500/20 btn-glow transition-all"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...</>
        ) : (
          <><Send className="mr-2 h-4 w-4" /> Gửi tin nhắn</>
        )}
      </Button>
    </form>
  );
}
