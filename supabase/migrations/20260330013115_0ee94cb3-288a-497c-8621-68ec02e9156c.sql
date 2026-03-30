-- Allow admins to read all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all applications
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));