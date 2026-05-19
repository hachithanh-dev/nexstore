import { Award, Users, Rocket, Heart, ShieldCheck, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về Chúng Tôi",
  description: "Tìm hiểu về NexStore - nền tảng mua sắm công nghệ hàng đầu Việt Nam",
};

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="orb orb-violet w-[500px] h-[500px] -top-32 left-1/3 animate-float" />
          <div className="orb orb-indigo w-[400px] h-[400px] bottom-0 -right-20 animate-float-delayed" />
        </div>
        <div className="container px-4 mx-auto text-center relative z-10">
          <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            Về chúng tôi
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
            Đam Mê <span className="gradient-text">Công Nghệ</span>
            <br />Phục Vụ <span className="gradient-text">Con Người</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            NexStore được thành lập với sứ mệnh mang những sản phẩm công nghệ tốt nhất đến tay người Việt
            với mức giá hợp lý nhất và dịch vụ tận tâm nhất.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel rounded-2xl p-8 bento-card card-hover">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg mb-6">
              <Target className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Sứ mệnh</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cung cấp giải pháp công nghệ toàn diện cho mọi người. Chúng tôi tin rằng mọi người
              đều xứng đáng được tiếp cận với những sản phẩm công nghệ chất lượng cao, chính hãng
              với mức giá phù hợp.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-8 bento-card card-hover">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg mb-6">
              <Rocket className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Tầm nhìn</h2>
            <p className="text-muted-foreground leading-relaxed">
              Trở thành nền tảng thương mại điện tử công nghệ số 1 Đông Nam Á. Nơi khách hàng
              không chỉ mua sắm mà còn được trải nghiệm, tư vấn và đồng hành trong mọi nhu cầu
              công nghệ.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-accent/20">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center stagger-children">
            {[
              { value: "10K+", label: "Khách hàng", icon: <Users className="h-6 w-6" /> },
              { value: "500+", label: "Sản phẩm", icon: <Award className="h-6 w-6" /> },
              { value: "50+", label: "Thương hiệu", icon: <ShieldCheck className="h-6 w-6" /> },
              { value: "99%", label: "Hài lòng", icon: <Heart className="h-6 w-6" /> },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="text-primary mb-1">{stat.icon}</div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Giá Trị Cốt Lõi</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {[
            { title: "Chính hãng tuyệt đối", desc: "100% sản phẩm có nguồn gốc rõ ràng, nhập khẩu trực tiếp từ hãng", gradient: "from-amber-500 to-orange-500", icon: <ShieldCheck className="h-6 w-6" /> },
            { title: "Khách hàng là trọng tâm", desc: "Mọi quyết định đều hướng đến trải nghiệm tốt nhất cho khách hàng", gradient: "from-violet-500 to-purple-500", icon: <Heart className="h-6 w-6" /> },
            { title: "Đổi mới không ngừng", desc: "Luôn cập nhật xu hướng, công nghệ mới nhất để phục vụ khách hàng", gradient: "from-blue-500 to-cyan-500", icon: <Rocket className="h-6 w-6" /> },
          ].map((v) => (
            <div key={v.title} className="glass-panel bento-card card-hover rounded-2xl p-6 text-center">
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${v.gradient} text-white shadow-lg mb-5`}>
                {v.icon}
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
