CREATE POLICY "No direct client access to checkout sessions"
ON public.checkout_sessions
FOR ALL
TO public
USING (false)
WITH CHECK (false);