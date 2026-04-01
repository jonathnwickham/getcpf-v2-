create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'purge-sensitive-data-30d',
  '0 2 * * *',
  $$
  update public.applications
  set
    passport_number = null,
    mother_name = null,
    mother_alternative = null,
    father_name = null,
    passport_photo_url = null,
    selfie_url = null,
    address_proof_url = null
  where
    created_at < now() - interval '30 days'
    and passport_number is not null;
  $$
);