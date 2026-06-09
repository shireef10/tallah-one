
-- Role -> Permission matrix
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  permission public.app_permission NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(role, permission)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rp_select_auth" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "rp_admin_write" ON public.role_permissions FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission public.app_permission)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin(_user_id) OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    WHERE ur.user_id = _user_id AND rp.permission = _permission
  );
$$;

INSERT INTO public.role_permissions (role, permission)
SELECT 'content_manager'::public.app_role, p::public.app_permission FROM unnest(ARRAY[
  'view_dashboard','manage_homepage','manage_announcements','manage_tutorials','manage_knowledge',
  'manage_processes','manage_faqs','manage_team','manage_vendors','manage_partners',
  'manage_meetings','manage_workspace_tools','manage_media','manage_settings'
]) AS p ON CONFLICT DO NOTHING;
INSERT INTO public.role_permissions (role, permission)
SELECT 'support_agent'::public.app_role, p::public.app_permission FROM unnest(ARRAY[
  'view_dashboard','manage_support_tickets','manage_service_requests','manage_faqs','manage_knowledge'
]) AS p ON CONFLICT DO NOTHING;
INSERT INTO public.role_permissions (role, permission)
SELECT 'team_lead'::public.app_role, p::public.app_permission FROM unnest(ARRAY[
  'view_dashboard','manage_announcements','manage_team','manage_meetings'
]) AS p ON CONFLICT DO NOTHING;
INSERT INTO public.role_permissions (role, permission) VALUES
  ('employee'::public.app_role, 'view_dashboard'::public.app_permission),
  ('read_only'::public.app_role, 'view_dashboard'::public.app_permission)
ON CONFLICT DO NOTHING;

-- Vendors
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, category text, description text, logo_url text, website_url text,
  contact_name text, contact_email text, contact_phone text, country text,
  visible boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors TO authenticated;
GRANT ALL ON public.vendors TO service_role;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vendors_select" ON public.vendors FOR SELECT TO authenticated USING (visible OR public.is_admin(auth.uid()));
CREATE POLICY "vendors_admin_write" ON public.vendors FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER vendors_updated BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Partners
CREATE TABLE IF NOT EXISTS public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, category text, description text, logo_url text, website_url text,
  contact_name text, contact_email text, contact_phone text, partnership_tier text,
  visible boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partners_select" ON public.partners FOR SELECT TO authenticated USING (visible OR public.is_admin(auth.uid()));
CREATE POLICY "partners_admin_write" ON public.partners FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER partners_updated BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Media library
CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'tallah-media',
  path text NOT NULL, url text NOT NULL, name text NOT NULL,
  mime_type text, size_bytes bigint, folder text, tags text[] NOT NULL DEFAULT '{}',
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(bucket, path)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_select" ON public.media_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "media_insert_auth" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by OR public.is_admin(auth.uid()));
CREATE POLICY "media_admin_update" ON public.media_assets FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "media_admin_delete" ON public.media_assets FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER media_updated BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text, action text NOT NULL,
  resource_type text, resource_id text,
  old_value jsonb, new_value jsonb, metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_admin_select" ON public.audit_log FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "audit_insert_auth" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id OR public.is_admin(auth.uid()));

-- Team members & profile extras
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS force_password_change boolean NOT NULL DEFAULT false;

-- Homepage CMS keys
INSERT INTO public.site_settings (key, value) VALUES
  ('homepage_hero', '{"eyebrow":"","title_template":"{name}, welcome to Tallah One","subtitle":"Everything you need for your workday is right here.","cta_primary_label":"Open Workspace","cta_primary_href":"/workspace","cta_secondary_label":"Browse Tallah Academy","cta_secondary_href":"/learning"}'::jsonb),
  ('homepage_quick_actions', '[]'::jsonb),
  ('homepage_banners', '[]'::jsonb),
  ('homepage_sections', '{"hero":true,"admin_shortcut":true,"quick_access":true,"tutorials":true,"announcements":true,"your_day":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
