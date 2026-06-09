import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export type Role = "super_admin" | "digital_transformation" | "department_manager" | "employee";

export async function getCurrentUserRoles(): Promise<Role[]> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return [];
  const { data: rows } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);
  return ((rows ?? []) as { role: Role }[]).map((r) => r.role);
}

/** Throws redirect() when the user lacks any of the allowed roles. Use inside beforeLoad. */
export async function requireRole(allowed: Role[], fallback: string = "/dashboard") {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw redirect({ to: "/auth" });
  const roles = await getCurrentUserRoles();
  const ok = roles.some((r) => allowed.includes(r));
  if (!ok) throw redirect({ to: fallback });
  return { userId: data.user.id, roles };
}

export const requireSuperAdmin = () => requireRole(["super_admin"]);
export const requireDigitalTransformation = () =>
  requireRole(["super_admin", "digital_transformation"]);
export const requireManager = () =>
  requireRole(["super_admin", "digital_transformation", "department_manager"]);
export const requireEmployee = () =>
  requireRole(["super_admin", "digital_transformation", "department_manager", "employee"]);

/** Pick the best landing route for a user based on their roles. */
export function landingRouteForRoles(roles: Role[]): "/admin" | "/dashboard" {
  if (roles.includes("super_admin")) return "/admin";
  return "/dashboard";
}
