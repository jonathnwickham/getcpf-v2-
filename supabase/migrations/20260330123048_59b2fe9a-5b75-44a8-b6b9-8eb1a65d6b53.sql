
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  plan text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view waitlist" ON public.waitlist FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.affiliate_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  platform text,
  why text,
  posting_frequency text,
  situation text,
  motivation text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit affiliate application" ON public.affiliate_applications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view affiliate applications" ON public.affiliate_applications FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
