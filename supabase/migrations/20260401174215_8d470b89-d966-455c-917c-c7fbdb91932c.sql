-- 1) Remove unused public promo view surface (promo validation already uses secure RPC)
DROP VIEW IF EXISTS public.public_promo_codes;

-- 2) Application update guard helper for user updates
CREATE OR REPLACE FUNCTION public.can_user_update_application_fields(
  _id uuid,
  _user_id uuid,
  _status text,
  _final_price numeric,
  _discount_amount numeric,
  _protocol_number text,
  _cpf_number text,
  _promo_code text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = _id
      AND a.user_id = auth.uid()
      AND a.user_id = _user_id
      AND a.status IS NOT DISTINCT FROM _status
      AND a.final_price IS NOT DISTINCT FROM _final_price
      AND a.discount_amount IS NOT DISTINCT FROM _discount_amount
      AND a.protocol_number IS NOT DISTINCT FROM _protocol_number
      AND a.cpf_number IS NOT DISTINCT FROM _cpf_number
      AND a.promo_code IS NOT DISTINCT FROM _promo_code
  );
$$;

DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
CREATE POLICY "Users can update their own applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND public.can_user_update_application_fields(
    id,
    user_id,
    status,
    final_price,
    discount_amount,
    protocol_number,
    cpf_number,
    promo_code
  )
);

-- 3) Tighten user message sender identity
DROP POLICY IF EXISTS "Users can send messages for their applications" ON public.messages;
CREATE POLICY "Users can send messages for their applications"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.applications
    WHERE applications.id = messages.application_id
      AND applications.user_id = auth.uid()
  )
  AND sender_type = 'user'
  AND sender_id = auth.uid()
);

-- 4) Ensure profile updates preserve ownership after edit
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5) Enforce plan-change guard via trigger (with service-role bypass)
CREATE OR REPLACE FUNCTION public.guard_profile_plan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(auth.role(), '') = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF OLD.plan IS DISTINCT FROM NEW.plan THEN
    IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
      RAISE EXCEPTION 'Only administrators can change the plan';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profile_plan ON public.profiles;
CREATE TRIGGER trg_guard_profile_plan
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.guard_profile_plan();