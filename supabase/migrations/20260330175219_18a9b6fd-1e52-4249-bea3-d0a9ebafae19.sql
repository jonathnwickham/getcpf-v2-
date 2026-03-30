
-- 1. Create a public-facing view for promo code validation (only safe fields)
CREATE OR REPLACE VIEW public.public_promo_codes AS
SELECT code, discount_percent, is_active
FROM public.promo_codes
WHERE is_active = true;

-- 2. Drop the overly permissive public SELECT policy on promo_codes
DROP POLICY IF EXISTS "Anyone can read active promo codes" ON public.promo_codes;

-- 3. Add admin-only SELECT policy on promo_codes (the ALL policy already covers admins, but be explicit)
CREATE POLICY "Only admins can read promo codes"
ON public.promo_codes
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Grant SELECT on the public view to anon and authenticated
GRANT SELECT ON public.public_promo_codes TO anon, authenticated;

-- 5. Fix user_roles: add explicit restrictive INSERT policy preventing non-admins
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Fix overly permissive INSERT policies (WITH CHECK true)
-- affiliate_applications: public insert is intentional (signup form), keep as-is
-- waitlist: public insert is intentional (waitlist form), keep as-is

-- 7. Fix applications INSERT policy: tighten from public to authenticated
DROP POLICY IF EXISTS "Users can create their own applications" ON public.applications;
CREATE POLICY "Users can create their own applications"
ON public.applications
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 8. Fix profiles INSERT policy: tighten from public to authenticated
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- 9. Fix applications UPDATE/DELETE from public to authenticated
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
CREATE POLICY "Users can update their own applications"
ON public.applications
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own applications" ON public.applications;
CREATE POLICY "Users can delete their own applications"
ON public.applications
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 10. Fix profiles UPDATE from public to authenticated
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- 11. Fix messages policies from public to authenticated
DROP POLICY IF EXISTS "Users can send messages for their applications" ON public.messages;
CREATE POLICY "Users can send messages for their applications"
ON public.messages
FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM applications
  WHERE applications.id = messages.application_id
  AND applications.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Users can view messages for their applications" ON public.messages;
CREATE POLICY "Users can view messages for their applications"
ON public.messages
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM applications
  WHERE applications.id = messages.application_id
  AND applications.user_id = auth.uid()
));
