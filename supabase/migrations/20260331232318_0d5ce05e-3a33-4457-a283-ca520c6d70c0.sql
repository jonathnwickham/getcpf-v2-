
-- 1. PROFILES: Restrict user UPDATE to safe columns only
-- Drop the existing permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Revoke default UPDATE, then grant only safe columns
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, email, country_code, location) ON public.profiles TO authenticated;

-- Re-create the UPDATE policy scoped to own row
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- 2. APPLICATIONS: Restrict user UPDATE to form-editable columns only
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;

REVOKE UPDATE ON public.applications FROM authenticated;
-- Grant user-editable form fields only
GRANT UPDATE (
  full_name, mother_name, no_mother, mother_alternative, father_name,
  passport_number, state_code, state_name, street_address, city, nationality, email,
  staying_with_friend, host_name, host_cpf, host_address, host_city, updated_at,
  passport_photo_url, selfie_url, address_proof_url
) ON public.applications TO authenticated;

-- Admin needs full UPDATE access
GRANT UPDATE ON public.applications TO service_role;

-- Re-create user UPDATE policy
CREATE POLICY "Users can update their own applications"
  ON public.applications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Keep admin UPDATE policy (already exists)

-- 3. PROMO CODES: Replace public view with point-lookup RPC
-- Revoke anon access to the view
REVOKE SELECT ON public.public_promo_codes FROM anon;
REVOKE SELECT ON public.public_promo_codes FROM authenticated;

-- Create a secure point-lookup function
CREATE OR REPLACE FUNCTION public.validate_promo_code(_code text)
RETURNS TABLE(code text, discount_percent integer, is_active boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.code, p.discount_percent, p.is_active
  FROM public.promo_codes p
  WHERE UPPER(TRIM(p.code)) = UPPER(TRIM(_code))
    AND p.is_active = true
  LIMIT 1;
$$;

-- 4. USER_ROLES: Remove the permissive ALL policy to prevent any ambiguity
-- and replace with explicit SELECT + DELETE for admins (INSERT already covered by restrictive policy)
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Drop the old restrictive INSERT policy since we now have an explicit admin INSERT
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
