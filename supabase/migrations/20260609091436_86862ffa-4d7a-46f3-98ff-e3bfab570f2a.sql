-- Restrict profile reads: remove broad SELECT-all policy. The existing
-- "profiles admin read all" policy already allows users to read their own
-- profile and admins to read all profiles, so phone numbers are no longer
-- exposed to every authenticated user.
DROP POLICY IF EXISTS profiles_select_all_authenticated ON public.profiles;

-- Remove duplicate SELECT policy on user_roles (kept "ur read own or admin")
DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;