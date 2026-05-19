"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TESTIMONIALS = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "Software Engineer",
    avatar: "NT",
    rating: 5,
    text: "MacBook Pro mua ở NexStore giá tốt hơn rất nhiều so với các nơi khác. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!",
  },
  {
    name: "Trần Thị Hương",
    role: "Content Creator",
    avatar: "TH",
    rating: 5,
    text: "Mình đã mua iPhone 16 Pro Max tại đây. Sản phẩm chính hãng, seal nguyên, kích hoạt bảo hành Apple dễ dàng. Sẽ ủng hộ dài lâu!",
  },
  {
    name: "Lê Hoàng Nam",
    role: "Graphic Designer",
    avatar: "LN",
    rating: 4,
    text: "Đội ngũ tư vấn rất nhiệt tình và chuyên nghiệp. Giúp mình chọn được chiếc laptop phù hợp với công việc thiết kế. Cảm ơn NexStore!",
  },
  {
    name: "Phạm Thu Hà",
    role: "Digital Marketer",
    avatar: "PH",
    rating: 5,
    text: "Dịch vụ hậu mãi tuyệt vời. Khi gặp vấn đề với tai nghe, NexStore đã đổi mới ngay trong 24h. Rất đáng tin cậy!",
  },
  {
    name: "Võ Đình Khoa",
    role: "Student",
    avatar: "VK",
    rating: 5,
    text: "Là sinh viên nên rất quan tâm giá cả. NexStore có nhiều chương trình ưu đãi cho sinh viên, giảm thêm 5%. Quá tuyệt!",
  },
];

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const GRADIENT_AVATARS = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Cards */}
      <div className="relative h-[280px] sm:h-[240px]">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className={`absolute inset-0 glass-panel rounded-2xl p-8 border border-border/50 transition-all duration-700 ease-out ${
              i === active
                ? "opacity-100 translate-x-0 scale-100 z-10"
                : i === (active + 1) % TESTIMONIALS.length
                ? "opacity-30 translate-x-[60px] scale-95 z-0"
                : "opacity-0 -translate-x-[60px] scale-95 z-0"
            }`}
          >
            <Quote className="h-8 w-8 text-primary/20 mb-4" />
            <p className="text-foreground/90 leading-relaxed mb-6 text-base">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${GRADIENT_AVATARS[i % GRADIENT_AVATARS.length]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                {t.avatar}
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
              <div className="ml-auto flex items-center gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`h-3.5 w-3.5 ${j < t.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline" size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => setActive((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
            />
          ))}
        </div>
        <Button
          variant="outline" size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => setActive((active + 1) % TESTIMONIALS.length)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
