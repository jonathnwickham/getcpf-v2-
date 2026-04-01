-- Fix the security definer view warning by using security_invoker
DROP VIEW IF EXISTS public.public_promo_codes;
CREATE VIEW public.public_promo_codes WITH (security_barrier = true, security_invoker = true) AS
  SELECT code, discount_percent, is_active
  FROM public.promo_codes
  WHERE is_active = true;

REVOKE ALL ON public.public_promo_codes FROM anon, authenticated;
GRANT SELECT ON public.public_promo_codes TO anon, authenticated;