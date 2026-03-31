
-- Add cpf_number to user-updatable columns
GRANT UPDATE (cpf_number) ON public.applications TO authenticated;

-- Create secure status transition function
CREATE OR REPLACE FUNCTION public.transition_application_status(
  _application_id uuid,
  _new_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_status text;
  _owner_id uuid;
  _has_cpf boolean;
BEGIN
  SELECT status, user_id, (cpf_number IS NOT NULL AND cpf_number != '')
  INTO _current_status, _owner_id, _has_cpf
  FROM public.applications
  WHERE id = _application_id;

  IF NOT FOUND THEN RETURN false; END IF;

  -- Only the owner or an admin can transition
  IF _owner_id != auth.uid() AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN false;
  END IF;

  -- Allowed user transitions
  IF _new_status = 'prepared' AND (_current_status = 'draft' OR _current_status = 'prepared') THEN
    UPDATE public.applications SET status = _new_status, updated_at = now() WHERE id = _application_id;
    RETURN true;
  END IF;

  IF _new_status = 'completed' AND _has_cpf THEN
    UPDATE public.applications SET status = _new_status, updated_at = now() WHERE id = _application_id;
    RETURN true;
  END IF;

  -- Admins can set any status
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    UPDATE public.applications SET status = _new_status, updated_at = now() WHERE id = _application_id;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;
