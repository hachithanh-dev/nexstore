"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCurrency, formatShortDate } from "@/utils/formatters";
import { ORDER_STATUSES } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
  Trash2,
} from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels = Object.fromEntries(
  ORDER_STATUSES.map((status) => [status.value, status.label])
) as Record<string, string>;

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", debouncedSearch, status, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (status && status !== "all") params.set("status", status);
      params.set("page", page.toString());
      params.set("pageSize", "10");
      const res = await fetch(`/api/orders?${params}`);
      return res.json();
    },
  });

  const { data: orderDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["order", viewOrder],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${viewOrder}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!viewOrder,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật đơn hàng");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái đơn hàng");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", viewOrder] });
    },
    onError: () => toast.error("Không thể cập nhật đơn hàng"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Không thể xóa đơn hàng");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Đã xóa đơn hàng");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Không thể xóa đơn hàng"),
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Đơn Hàng</h1>
        <p className="text-muted-foreground">Theo dõi và quản lý đơn hàng</p>
      </div>

      {/* Filters */}
      <Card className="border-white/5 bg-card/50 p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã đơn hoặc khách hàng..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 border-white/10 bg-white/5"
            />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-full md:w-44 border-white/10 bg-white/5">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-white/5 bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  Không tìm thấy đơn hàng
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: { id: string; orderNumber: string; totalAmount: number; status: string; createdAt: string; user?: { name: string; email: string } }) => (
                <TableRow key={order.id} className="border-white/5 hover:bg-white/5">
                  <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{order.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusStyles[order.status] || ""}`}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatShortDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewOrder(order.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400" onClick={() => setDeleteId(order.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
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

      {/* Order Detail Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="max-w-lg border-white/10 bg-slate-900">
          <DialogHeader>
            <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
            <DialogDescription>{orderDetail?.orderNumber}</DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : orderDetail ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Khách hàng</p>
                  <p className="font-medium">{orderDetail.user?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tổng tiền</p>
                  <p className="font-semibold">{formatCurrency(orderDetail.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ngày tạo</p>
                  <p>{formatShortDate(orderDetail.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Trạng thái</p>
                  <Select
                    value={orderDetail.status}
                    onValueChange={(v) => updateMutation.mutate({ id: orderDetail.id, status: v })}
                  >
                    <SelectTrigger className="mt-1 h-8 border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Sản phẩm</p>
                <div className="space-y-2">
                  {orderDetail.items?.map((item: { id: string; quantity: number; price: number; product?: { name: string; sku: string } }) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-white/5 p-2.5">
                      <div>
                        <p className="text-sm font-medium">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.product?.sku} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="border-white/10 bg-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Xóa Đơn Hàng
            </DialogTitle>
            <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
