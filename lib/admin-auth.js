import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "fallback-secret");

export async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return {
      ...payload,
      id: payload.sub,
      email: payload.email,
      name: payload.name || "Admin",
      role: payload.role || "member",
    };
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden(message = "Forbidden: Insufficient privileges") {
  return NextResponse.json({ error: message }, { status: 403 });
}
