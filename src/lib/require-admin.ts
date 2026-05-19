import { auth } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";

/**
 * Checks that the current request is from an authenticated admin user.
 * Returns the session on success, or a NextResponse error on failure.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: errorResponse("Vui lòng đăng nhập", 401) };
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return { error: errorResponse("Bạn không có quyền truy cập", 403) };
  }

  return { session };
}
