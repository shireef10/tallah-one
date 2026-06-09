
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support_agent';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'team_lead';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'read_only';

DO $$ BEGIN
  CREATE TYPE public.app_permission AS ENUM (
    'view_dashboard',
    'manage_homepage',
    'manage_announcements',
    'manage_tutorials',
    'manage_knowledge',
    'manage_processes',
    'manage_faqs',
    'manage_team',
    'manage_vendors',
    'manage_partners',
    'manage_meetings',
    'manage_workspace_tools',
    'manage_service_requests',
    'manage_support_tickets',
    'manage_users',
    'manage_roles',
    'manage_media',
    'manage_audit',
    'manage_settings'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
