import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  await prisma.user.upsert({ create: { name: "Admin User", email: "admin@example.com", password: adminPassword, role: "admin", phone: "0901234567", address: "123 Admin Street, Ho Chi Minh City" }, update: {}, where: { email: "admin@example.com" } });
  const user1 = await prisma.user.create({ data: { name: "Nguyen Van A", email: "user@example.com", password: userPassword, role: "user", phone: "0912345678", address: "456 User Road, Ha Noi" } });
  const user2 = await prisma.user.create({ data: { name: "Tran Thi B", email: "user2@example.com", password: userPassword, role: "user", phone: "0923456789", address: "789 Customer Ave, Da Nang" } });

  const products = await Promise.all([
    prisma.product.create({ data: { name: "MacBook Pro 16 inch M3 Max", description: "Laptop cao cấp với chip M3 Max, 36GB RAM, 1TB SSD", price: 62990000, stock: 15, category: "Laptop", status: "active", sku: "MBP-16-M3MAX", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" } }),
    prisma.product.create({ data: { name: "iPhone 16 Pro Max 256GB", description: "Smartphone flagship với camera 48MP, chip A18 Pro", price: 34990000, stock: 50, category: "Phone", status: "active", sku: "IP16-PRO-256", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80" } }),
    prisma.product.create({ data: { name: "iPad Air M2 11 inch", description: "Tablet mỏng nhẹ với chip M2, màn hình Liquid Retina", price: 18990000, stock: 30, category: "Tablet", status: "active", sku: "IPAD-AIR-M2", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80" } }),
    prisma.product.create({ data: { name: "AirPods Pro 2nd Gen", description: "Tai nghe không dây chống ồn chủ động, chip H2", price: 6790000, stock: 100, category: "Accessories", status: "active", sku: "APP-2ND-GEN", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80" } }),
    prisma.product.create({ data: { name: "Apple Watch Ultra 2", description: "Đồng hồ thông minh chuyên dụng, titan, GPS + Cellular", price: 23990000, stock: 20, category: "Wearable", status: "active", sku: "AW-ULTRA-2", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80" } }),
    prisma.product.create({ data: { name: "Samsung Galaxy S24 Ultra", description: "Smartphone AI tiên tiến, S Pen tích hợp, 200MP camera", price: 31990000, stock: 40, category: "Phone", status: "active", sku: "SS-S24-ULTRA", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80" } }),
    prisma.product.create({ data: { name: "Sony WH-1000XM5", description: "Tai nghe headphone chống ồn cao cấp, 30 giờ pin", price: 8490000, stock: 25, category: "Accessories", status: "active", sku: "SONY-XM5", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80" } }),
    prisma.product.create({ data: { name: "Dell XPS 15 OLED", description: "Laptop OLED 3.5K, Intel Core Ultra 9, 32GB RAM", price: 45990000, stock: 10, category: "Laptop", status: "active", sku: "DELL-XPS-15", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80" } }),
    prisma.product.create({ data: { name: "Logitech MX Master 3S", description: "Chuột không dây ergonomic, DPI 8000, sạc USB-C", price: 2490000, stock: 60, category: "Accessories", status: "active", sku: "LOG-MX3S", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80" } }),
    prisma.product.create({ data: { name: "Samsung Galaxy Tab S9 FE", description: "Tablet Android màn hình 10.9 inch, S Pen, IP68", price: 10990000, stock: 0, category: "Tablet", status: "draft", sku: "SS-TAB-S9FE", image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80" } }),
  ]);

  await prisma.order.create({ data: { orderNumber: "ORD-20260101-001", userId: user1.id, status: "delivered", totalAmount: 97980000, shippingAddress: "456 User Road, Ha Noi", items: { create: [{ productId: products[0].id, quantity: 1, price: 62990000 }, { productId: products[1].id, quantity: 1, price: 34990000 }] } } });
  await prisma.order.create({ data: { orderNumber: "ORD-20260115-002", userId: user2.id, status: "processing", totalAmount: 25780000, shippingAddress: "789 Customer Ave, Da Nang", items: { create: [{ productId: products[2].id, quantity: 1, price: 18990000 }, { productId: products[3].id, quantity: 1, price: 6790000 }] } } });
  await prisma.order.create({ data: { orderNumber: "ORD-20260201-003", userId: user1.id, status: "pending", totalAmount: 23990000, shippingAddress: "456 User Road, Ha Noi", items: { create: [{ productId: products[4].id, quantity: 1, price: 23990000 }] } } });
  await prisma.order.create({ data: { orderNumber: "ORD-20260210-004", userId: user2.id, status: "shipped", totalAmount: 40480000, shippingAddress: "789 Customer Ave, Da Nang", items: { create: [{ productId: products[5].id, quantity: 1, price: 31990000 }, { productId: products[6].id, quantity: 1, price: 8490000 }] } } });
  await prisma.order.create({ data: { orderNumber: "ORD-20260220-005", userId: user1.id, status: "delivered", totalAmount: 48480000, shippingAddress: "456 User Road, Ha Noi", items: { create: [{ productId: products[7].id, quantity: 1, price: 45990000 }, { productId: products[8].id, quantity: 1, price: 2490000 }] } } });

  console.log("✅ Seed data created successfully!");
  console.log(`  - 3 users (admin: admin@example.com / admin123)`);
  console.log(`  - ${products.length} products`);
  console.log(`  - 5 orders`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
