"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      className="w-full text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
    </Button>
  );
}
