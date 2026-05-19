"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { formatShortDate, getInitials } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Edit,
  Shield,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  admin: "Quản trị viên",
  user: "Người dùng",
};

export default function UsersPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    address: string | null;
  } | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const isAdmin = session?.user?.role === "admin";

  const { data, isLoading } = useQuery({
    queryKey: ["users", debouncedSearch, role, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (role && role !== "all") params.set("role", role);
      params.set("page", page.toString());
      params.set("pageSize", "10");
      const res = await fetch(`/api/users?${params}`);
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (userData: Record<string, unknown>) => {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Không thể cập nhật người dùng");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Cập nhật người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditUser(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const users = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Người Dùng</h1>
        <p className="text-muted-foreground">
          {isAdmin ? "Quản lý tài khoản và quyền truy cập" : "Danh sách người dùng"}
        </p>
      </div>

      {/* Filters */}
      <Card className="border-white/5 bg-card/50 p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 border-white/10 bg-white/5"
            />
          </div>
          <Select value={role} onValueChange={(v) => { setRole(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-full md:w-44 border-white/10 bg-white/5">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
              <SelectItem value="user">Người dùng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-white/5 bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>Người dùng</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Đơn hàng</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              {isAdmin && <TableHead className="text-right">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  {[...Array(isAdmin ? 6 : 5)].map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="h-32 text-center text-muted-foreground">
                  <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  Không tìm thấy người dùng
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: { id: string; name: string; email: string; role: string; phone: string | null; address: string | null; createdAt: string; _count?: { orders: number } }) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-white/10">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${
                      user.role === "admin"
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}>
                      {user.role === "admin" && <Shield className="mr-1 h-3 w-3" />}
                      {roleLabels[user.role] || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{user._count?.orders || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatShortDate(user.createdAt)}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Hiển thị {(meta.page - 1) * meta.pageSize + 1}-{Math.min(meta.page * meta.pageSize, meta.total)} trong {meta.total}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="border-white/10">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">{meta.page} / {meta.totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="border-white/10">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="border-white/10 bg-slate-900">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
            <DialogDescription>Cập nhật thông tin và quyền người dùng</DialogDescription>
          </DialogHeader>
          {editUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateMutation.mutate({
                  id: editUser.id,
                  name: formData.get("name"),
                  email: formData.get("email"),
                  role: formData.get("role"),
                  phone: formData.get("phone") || null,
                  address: formData.get("address") || null,
                });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Họ và tên</Label>
                <Input name="name" defaultValue={editUser.name} className="border-white/10 bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" defaultValue={editUser.email} className="border-white/10 bg-white/5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vai trò</Label>
                  <select name="role" defaultValue={editUser.role} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Điện thoại</Label>
                  <Input name="phone" defaultValue={editUser.phone || ""} className="border-white/10 bg-white/5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ</Label>
                <Input name="address" defaultValue={editUser.address || ""} className="border-white/10 bg-white/5" />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditUser(null)}>Hủy</Button>
                <Button type="submit" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
