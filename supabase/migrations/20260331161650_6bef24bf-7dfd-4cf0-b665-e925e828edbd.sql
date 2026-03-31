CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  checkout_session_secret TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL DEFAULT '0LD5G',
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  payment_id TEXT,
  fanbasis_customer_id TEXT,
  amount_cents INTEGER,
  currency TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checkout_sessions_email ON public.checkout_sessions(email);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_paid_email ON public.checkout_sessions(email, paid);

ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_checkout_sessions_updated_at
BEFORE UPDATE ON public.checkout_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();