import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";
import { paginationSchema, updateUserSchema } from "@/lib/schemas";
import { isValidUserRole } from "@/lib/constants";
import bcrypt from "bcryptjs";

// GET /api/users (admin only)
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const { page, pageSize } = paginationSchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    });

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role) {
      if (!isValidUserRole(role)) {
        return errorResponse("Vai trò không hợp lệ", 400);
      }
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          phone: true,
          address: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse(users, undefined, {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Get users error:", error);
    return errorResponse("Không thể tải danh sách người dùng", 500);
  }
}

// PUT /api/users (admin only)
export async function PUT(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return errorResponse(firstError?.message || "Dữ liệu không hợp lệ", 400);
    }

    const { id, name, email, password, role, phone, address } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return errorResponse("Không tìm thấy người dùng", 404);

    // Check email uniqueness
    if (email && email !== existing.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) return errorResponse("Email đã được sử dụng", 409);
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(user, "Cập nhật người dùng thành công");
  } catch (error) {
    console.error("Update user error:", error);
    return errorResponse("Không thể cập nhật người dùng", 500);
  }
}
