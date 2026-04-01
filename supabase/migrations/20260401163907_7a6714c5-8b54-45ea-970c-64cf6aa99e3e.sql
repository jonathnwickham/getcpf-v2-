
-- Trigger: prevent non-admin users from changing restricted columns on applications
CREATE OR REPLACE FUNCTION public.guard_application_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If status is changing and caller is not admin, block it
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
      RAISE EXCEPTION 'Only administrators can change application status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_application_status_trigger
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_application_status();

-- Trigger: prevent non-admin users from changing plan on profiles
CREATE OR REPLACE FUNCTION public.guard_profile_plan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF OLD.plan IS DISTINCT FROM NEW.plan THEN
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
      RAISE EXCEPTION 'Only administrators can change the plan';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_profile_plan_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profile_plan();

-- Add admin UPDATE policy on messages
CREATE POLICY "Admins can update messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
