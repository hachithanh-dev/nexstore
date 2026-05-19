"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "admin123",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Sai email hoặc mật khẩu");
      } else {
        toast.success("Đăng nhập thành công!");
        
        // Check session to determine redirect URL based on role
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (session?.user?.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
        router.refresh();
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
        <div className="orb orb-violet w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 animate-float" />
        <div className="orb orb-indigo w-[400px] h-[400px] bottom-0 left-1/4 animate-float-delayed" />
        <div className="orb orb-blue w-[300px] h-[300px] top-1/3 -right-20 animate-float-slow" />
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
          <CardTitle className="text-2xl text-foreground">Chào mừng trở lại</CardTitle>
          <CardDescription className="text-muted-foreground">
            Đăng nhập để tiếp tục mua sắm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
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
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng Nhập <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
            <p className="text-xs font-semibold text-primary mb-1.5">Demo Credentials:</p>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <p>Admin: admin@example.com / admin123</p>
              <p>User: user@example.com / user123</p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
