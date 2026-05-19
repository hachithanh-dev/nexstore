"use client";

import { useState } from "react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Vui lòng nhập email hợp lệ");
      return;
    }
    toast.success("Đăng ký nhận tin thành công! 🎉");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="Email của bạn..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 h-10 rounded-full border border-border bg-background/50 px-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all text-foreground"
      />
      <button
        type="submit"
        className="h-10 px-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20"
      >
        Đăng ký
      </button>
    </form>
  );
}
