import { cookies } from "next/headers";

export const ADMIN_COOKIE = "pragyam_admin";

export async function isAdminRequest() {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_SECRET;
  return Boolean(secret) && value === secret;
}
