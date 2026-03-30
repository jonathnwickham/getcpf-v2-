
-- Create consent_log table
CREATE TABLE public.consent_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  consented_at timestamptz NOT NULL DEFAULT now(),
  consent_text text NOT NULL,
  consent_version text NOT NULL DEFAULT '1.0',
  consent boolean NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;

-- Users can insert their own consent records
CREATE POLICY "Users can insert own consent"
  ON public.consent_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own consent records
CREATE POLICY "Users can view own consent"
  ON public.consent_log FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all consent records
CREATE POLICY "Admins can view all consent"
  ON public.consent_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- No UPDATE or DELETE policies — consent_log is append-only and permanent
