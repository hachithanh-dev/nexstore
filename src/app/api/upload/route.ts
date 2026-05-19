import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";

// POST /api/upload (admin only)
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("Chưa có tệp được tải lên", 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("Định dạng tệp không hợp lệ. Chỉ hỗ trợ JPEG, PNG, WebP và GIF.", 400);
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse("Tệp quá lớn. Kích thước tối đa là 5MB.", 400);
    }

    // Create uploads directory
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = join(uploadDir, filename);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    return successResponse({ url, filename, size: file.size }, "Tải tệp lên thành công");
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("Không thể tải tệp lên", 500);
  }
}
