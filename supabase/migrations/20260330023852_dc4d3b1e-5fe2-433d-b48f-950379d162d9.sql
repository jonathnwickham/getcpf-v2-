ALTER TABLE public.promo_codes ADD COLUMN IF NOT EXISTS affiliate_notes text;
ALTER TABLE public.promo_codes ADD COLUMN IF NOT EXISTS affiliate_source text;
ALTER TABLE public.promo_codes ADD COLUMN IF NOT EXISTS affiliate_location text;