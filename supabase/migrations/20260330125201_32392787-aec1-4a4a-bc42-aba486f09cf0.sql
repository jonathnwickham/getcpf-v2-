
CREATE TABLE public.affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  platform text,
  why text,
  posting_frequency text,
  situation text,
  motivation text,
  promo_code text,
  commission_percent integer NOT NULL DEFAULT 20,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  location text,
  source text
);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage affiliates" ON public.affiliates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
