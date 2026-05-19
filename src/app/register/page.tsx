"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const getPasswordStrength = (pw: string) => {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: "Yếu", color: "bg-rose-500" };
    if (score <= 3) return { level: 2, label: "Trung bình", color: "bg-amber-500" };
    return { level: 3, label: "Mạnh", color: "bg-emerald-500" };
  };
  const strength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Đăng ký thất bại");
      } else {
        toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
        router.push("/login");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-mesh p-4 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="orb orb-indigo w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 animate-float" />
        <div className="orb orb-violet w-[400px] h-[400px] bottom-0 right-1/4 animate-float-delayed" />
        <div className="orb orb-pink w-[300px] h-[300px] top-1/2 -left-20 animate-float-slow" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/20 rounded-2xl animate-scale-in">
        <CardHeader className="text-center pb-2">
          <Link href="/" className="mx-auto mb-5 flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Package2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Nex<span className="gradient-text">Store</span>
            </span>
          </Link>
          <CardTitle className="text-2xl text-foreground">Tạo tài khoản</CardTitle>
          <CardDescription className="text-muted-foreground">
            Đăng ký để bắt đầu mua sắm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground text-sm font-medium">
                Họ và tên
              </Label>
              <Input
                id="name"
                placeholder="Nguyễn Văn A"
                className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 h-11 rounded-xl focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 h-11 rounded-xl focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  className="border-border bg-background/50 pr-10 text-foreground placeholder:text-muted-foreground/60 h-11 rounded-xl focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-muted"}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.level === 1 ? "text-rose-500" : strength.level === 2 ? "text-amber-500" : "text-emerald-500"}`}>
                    {strength.label}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground text-sm font-medium">
                Xác nhận mật khẩu
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 h-11 rounded-xl focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 font-semibold shadow-lg shadow-violet-500/20 btn-glow transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  Tạo Tài Khoản <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
