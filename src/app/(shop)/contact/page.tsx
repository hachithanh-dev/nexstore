import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description: "Liên hệ với NexStore - Chúng tôi luôn sẵn sàng hỗ trợ bạn",
};

export default function ContactPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="orb orb-violet w-[400px] h-[400px] -top-20 right-1/4 animate-float" />
          <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-1/4 animate-float-delayed" />
        </div>
        <div className="container px-4 mx-auto text-center relative z-10">
          <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            Liên hệ
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Chúng Tôi Luôn <span className="gradient-text">Lắng Nghe</span>
          </h1>
          <p className="max-w-lg mx-auto text-muted-foreground text-lg">
            Có câu hỏi hoặc cần hỗ trợ? Đừng ngần ngại liên hệ với chúng tôi.
          </p>
        </div>
      </section>

      <section className="pb-20 container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: <Phone className="h-5 w-5" />, title: "Hotline", detail: "1900 6868", sub: "Miễn phí cuộc gọi", gradient: "from-blue-500 to-cyan-500" },
              { icon: <Mail className="h-5 w-5" />, title: "Email", detail: "support@nexstore.vn", sub: "Phản hồi trong 24h", gradient: "from-violet-500 to-purple-500" },
              { icon: <MapPin className="h-5 w-5" />, title: "Địa chỉ", detail: "123 Nguyễn Huệ, Q.1", sub: "TP. Hồ Chí Minh", gradient: "from-amber-500 to-orange-500" },
              { icon: <Clock className="h-5 w-5" />, title: "Giờ làm việc", detail: "08:00 - 22:00", sub: "Thứ 2 - Chủ nhật", gradient: "from-emerald-500 to-teal-500" },
            ].map((c) => (
              <div key={c.title} className="glass-panel rounded-xl p-5 flex items-start gap-4 bento-card card-hover">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-lg`}>
                  {c.icon}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{c.title}</div>
                  <div className="text-foreground font-medium">{c.detail}</div>
                  <div className="text-xs text-muted-foreground">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-2xl p-8 border border-border/50">
              <h2 className="text-xl font-bold text-foreground mb-6">Gửi tin nhắn</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
