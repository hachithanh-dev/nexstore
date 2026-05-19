"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PRODUCT_CATEGORIES } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, X, ImageIcon } from "lucide-react";
import Link from "next/link";

const productSchema = z.object({
  name: z.string().min(2, "Tên sản phẩm phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  stock: z.coerce.number().int().min(0, "Tồn kho không thể âm"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  sku: z.string().min(2, "SKU là bắt buộc"),
  status: z.enum(["active", "draft", "archived"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues & { id?: string; image?: string };
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  isEdit,
}: ProductFormProps = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      sku: "",
      status: "active",
    },
  });

  const selectedCategory = useWatch({ control, name: "category" });
  const selectedStatus = useWatch({ control, name: "status" });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPEG, PNG, WebP và GIF");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh phải nhỏ hơn 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      let imageUrl = initialData?.image || null;

      // Upload image if new
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          imageUrl = uploadData.data.url;
        }
      }

      const url = isEdit
        ? `/api/products/${initialData?.id}`
        : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image: imageUrl }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Không thể lưu sản phẩm");
      } else {
        toast.success(
          isEdit ? "Cập nhật sản phẩm thành công!" : "Tạo sản phẩm thành công!"
        );
        router.push("/dashboard/products");
        router.refresh();
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Cập nhật thông tin sản phẩm" : "Thêm sản phẩm mới vào cửa hàng"}
          </p>
        </div>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <Card className="lg:col-span-2 border-white/5 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Thông Tin Sản Phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm *</Label>
                <Input
                  id="name"
                  placeholder="Nhập tên sản phẩm"
                  className="border-white/10 bg-white/5"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả sản phẩm"
                  rows={4}
                  className="border-white/10 bg-white/5 resize-none"
                  {...register("description")}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VND) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    className="border-white/10 bg-white/5"
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-400">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Tồn kho *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    className="border-white/10 bg-white/5"
                    {...register("stock")}
                  />
                  {errors.stock && (
                    <p className="text-xs text-red-400">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="e.g., MBP-16-M3"
                    className="border-white/10 bg-white/5"
                    {...register("sku")}
                  />
                  {errors.sku && (
                    <p className="text-xs text-red-400">{errors.sku.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Danh mục *</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(v) => setValue("category", v || "")}
                  >
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-red-400">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="border-white/5 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Trạng Thái</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedStatus}
                  onValueChange={(v) =>
                    setValue("status", v as "active" | "draft" | "archived")
                  }
                >
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang bán</SelectItem>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="archived">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="border-white/5 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Hình Ảnh Sản Phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/5 transition-colors hover:border-violet-500/30 hover:bg-white/10">
                    <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Nhấp để tải lên
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      JPEG, PNG, WebP (max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : isEdit ? (
                "Cập Nhật Sản Phẩm"
              ) : (
                "Tạo Sản Phẩm"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
