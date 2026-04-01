-- Fix 1: Add WITH CHECK to applications UPDATE policy to prevent user_id injection
ALTER POLICY "Users can update their own applications"
  ON public.applications
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix 2: public_promo_codes is a VIEW, so we use security_barrier and restrict access
-- Views don't support ALTER TABLE ENABLE ROW LEVEL SECURITY, so we drop and recreate as security_barrier
DROP VIEW IF EXISTS public.public_promo_codes;
CREATE VIEW public.public_promo_codes WITH (security_barrier = true) AS
  SELECT code, discount_percent, is_active
  FROM public.promo_codes
  WHERE is_active = true;

-- Revoke direct access and grant only SELECT
REVOKE ALL ON public.public_promo_codes FROM anon, authenticated;
GRANT SELECT ON public.public_promo_codes TO anon, authenticated;