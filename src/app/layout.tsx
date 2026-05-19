import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "NexStore - Premium Tech Store",
    template: "%s | NexStore",
  },
  description:
    "Khám phá các sản phẩm công nghệ đỉnh cao với mức giá ưu đãi nhất tại NexStore",
  openGraph: {
    title: "NexStore - Premium Tech Store",
    description: "Premium E-Commerce Store built with Next.js & React",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
