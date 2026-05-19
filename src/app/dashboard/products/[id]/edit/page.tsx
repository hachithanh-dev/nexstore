"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ProductForm from "@/features/products/product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <ProductForm
      initialData={{
        id: data.id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        stock: data.stock,
        category: data.category,
        sku: data.sku,
        status: data.status,
        image: data.image,
      }}
      isEdit
    />
  );
}
