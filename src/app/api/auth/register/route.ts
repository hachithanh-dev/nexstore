import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return errorResponse("Vui lòng nhập đầy đủ thông tin", 400);
    }

    if (password.length < 6) {
      return errorResponse("Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("Email đã được đăng ký", 409);
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(user, "Tạo tài khoản thành công");
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse("Có lỗi xảy ra trên máy chủ", 500);
  }
}
