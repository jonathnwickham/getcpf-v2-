
-- Fix 1: Drop the SECURITY DEFINER view and recreate with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_promo_codes;
CREATE VIEW public.public_promo_codes
WITH (security_invoker = true) AS
SELECT code, discount_percent, is_active
FROM public.promo_codes
WHERE is_active = true;

GRANT SELECT ON public.public_promo_codes TO anon, authenticated;

-- Fix 2: Tighten affiliate_applications INSERT — require name and email to be non-empty
DROP POLICY IF EXISTS "Anyone can submit affiliate application" ON public.affiliate_applications;
CREATE POLICY "Anyone can submit affiliate application"
ON public.affiliate_applications
FOR INSERT TO public
WITH CHECK (name IS NOT NULL AND email IS NOT NULL AND length(email) > 0);

-- Fix 3: Tighten waitlist INSERT — require email and plan to be non-empty
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT TO public
WITH CHECK (email IS NOT NULL AND length(email) > 0 AND plan IS NOT NULL AND length(plan) > 0);
