import ProductForm from "@/features/products/product-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thêm sản phẩm",
};

export default function NewProductPage() {
  return <ProductForm />;
}
