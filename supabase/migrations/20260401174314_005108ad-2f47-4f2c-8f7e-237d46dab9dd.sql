-- Prevent non-admin users from changing stripe_customer_id in profiles
CREATE OR REPLACE FUNCTION public.guard_profile_plan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Backend/service operations are allowed
  IF COALESCE(auth.role(), '') = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Only admins can change plan
  IF OLD.plan IS DISTINCT FROM NEW.plan THEN
    IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
      RAISE EXCEPTION 'Only administrators can change the plan';
    END IF;
  END IF;

  -- Only admins can change stripe_customer_id
  IF OLD.stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id THEN
    IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
      RAISE EXCEPTION 'Only administrators can change stripe customer id';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Enforce valid sender types at the database level
ALTER TABLE public.messages
DROP CONSTRAINT IF EXISTS messages_sender_type_check;

ALTER TABLE public.messages
ADD CONSTRAINT messages_sender_type_check
CHECK (sender_type IN ('user', 'admin'));