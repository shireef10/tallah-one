import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  const ok = (data ?? []).some(
    (r: { role: string }) => r.role === "super_admin" || r.role === "digital_transformation",
  );
  if (!ok) throw new Error("Forbidden: admin only");
}

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function audit(actorId: string, actorEmail: string | null, action: string, resource: { type: string; id?: string }, meta?: Record<string, unknown>) {
  const admin = await getAdmin();
  await admin.from("audit_log").insert({
    actor_id: actorId, actor_email: actorEmail, action,
    resource_type: resource.type, resource_id: resource.id ?? null,
    metadata: meta ?? null,
  });
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) throw new Error(error.message);
    return data.users.map((u) => ({
      id: u.id,
      email: u.email ?? null,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      banned_until: (u as { banned_until?: string | null }).banned_until ?? null,
      email_confirmed_at: u.email_confirmed_at ?? null,
    }));
  });

export const createUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; password?: string; full_name?: string; send_invite?: boolean }) => d)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    if (data.send_invite) {
      const { data: res, error } = await admin.auth.admin.inviteUserByEmail(data.email, {
        data: { full_name: data.full_name },
      });
      if (error) throw new Error(error.message);
      await audit(context.userId, (context.claims as { email?: string }).email ?? null, "user.invite", { type: "user", id: res.user?.id });
      return { id: res.user?.id };
    }
    const { data: res, error } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name },
    });
    if (error) throw new Error(error.message);
    await audit(context.userId, (context.claims as { email?: string }).email ?? null, "user.create", { type: "user", id: res.user.id });
    return { id: res.user.id };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string }) => d)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.user_id === context.userId) throw new Error("You cannot delete yourself");
    const admin = await getAdmin();
    const { error } = await admin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    await audit(context.userId, (context.claims as { email?: string }).email ?? null, "user.delete", { type: "user", id: data.user_id });
    return { ok: true };
  });

export const sendPasswordReset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    const { error } = await admin.auth.admin.generateLink({
      type: "recovery", email: data.email,
    });
    if (error) throw new Error(error.message);
    await audit(context.userId, (context.claims as { email?: string }).email ?? null, "user.password_reset", { type: "user" }, { email: data.email });
    return { ok: true };
  });

export const setUserBan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; ban: boolean }) => d)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.user_id === context.userId) throw new Error("You cannot lock yourself");
    const admin = await getAdmin();
    const { error } = await admin.auth.admin.updateUserById(data.user_id, {
      ban_duration: data.ban ? "8760h" : "none",
    } as { ban_duration: string });
    if (error) throw new Error(error.message);
    await audit(context.userId, (context.claims as { email?: string }).email ?? null, data.ban ? "user.lock" : "user.unlock", { type: "user", id: data.user_id });
    return { ok: true };
  });

export const setUserActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; active: boolean }) => d)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    const { error } = await admin.from("profiles").update({ active: data.active }).eq("id", data.user_id);
    if (error) throw new Error(error.message);
    await audit(context.userId, (context.claims as { email?: string }).email ?? null, data.active ? "user.activate" : "user.deactivate", { type: "user", id: data.user_id });
    return { ok: true };
  });

export const setForcePasswordChange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; force: boolean }) => d)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    const { error } = await admin.from("profiles").update({ force_password_change: data.force }).eq("id", data.user_id);
    if (error) throw new Error(error.message);
    await audit(context.userId, (context.claims as { email?: string }).email ?? null, "user.force_password_change", { type: "user", id: data.user_id }, { force: data.force });
    return { ok: true };
  });
