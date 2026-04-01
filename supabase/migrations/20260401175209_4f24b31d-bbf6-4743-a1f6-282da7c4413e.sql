ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS partner_access_granted boolean NOT NULL DEFAULT false;