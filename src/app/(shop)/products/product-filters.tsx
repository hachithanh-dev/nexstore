"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  categories: string[];
  currentCategory: string;
  currentSort: string;
  currentOrder: string;
  currentSearch: string;
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentOrder,
  currentSearch,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset page when filters change
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      {/* Category filter */}
      <Button
        variant={currentCategory === "" ? "default" : "outline"}
        size="sm"
        className="rounded-full"
        onClick={() => updateFilter("category", "")}
      >
        Tất cả
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={currentCategory === cat ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => updateFilter("category", cat)}
        >
          {cat}
        </Button>
      ))}

      {/* Sort dropdown */}
      <div className="ml-auto flex items-center gap-2">
        <select
          value={`${currentSort}-${currentOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            const params = new URLSearchParams(searchParams.toString());
            params.set("sortBy", sortBy);
            params.set("sortOrder", sortOrder);
            params.delete("page");
            router.push(`/products?${params.toString()}`);
          }}
          className="h-9 rounded-full border border-border bg-background/50 px-4 text-sm outline-none text-foreground focus:border-primary/50 transition-all"
        >
          <option value="createdAt-desc">Mới nhất</option>
          <option value="createdAt-asc">Cũ nhất</option>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
          <option value="name-asc">Tên A → Z</option>
          <option value="name-desc">Tên Z → A</option>
        </select>
      </div>

      {/* Active search indicator */}
      {currentSearch && (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-xs"
          onClick={() => updateFilter("search", "")}
        >
          ✕ Xóa tìm kiếm: &quot;{currentSearch}&quot;
        </Button>
      )}
    </div>
  );
}
