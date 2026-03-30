
-- Promo codes table
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL DEFAULT 10,
  affiliate_name TEXT,
  affiliate_commission_percent INTEGER NOT NULL DEFAULT 20,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  times_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track which user used which promo code
ALTER TABLE public.applications ADD COLUMN promo_code TEXT;
ALTER TABLE public.applications ADD COLUMN discount_amount NUMERIC(10,2);
ALTER TABLE public.applications ADD COLUMN final_price NUMERIC(10,2);

-- RLS: anyone can read active promo codes (to validate), only admin can manage
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active promo codes"
  ON public.promo_codes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed the first promo code
INSERT INTO public.promo_codes (code, discount_percent, affiliate_name, affiliate_commission_percent)
VALUES ('BRAZILIANGRINGO', 10, 'Brazilian Gringo', 20);
