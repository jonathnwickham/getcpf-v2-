

## Plan: RLS Security Audit + 5 Email Sequences

### Part 1: RLS Security Audit

**Findings from full schema + security scan review:**

#### CRITICAL — Must Fix

1. **Users can set their own application status to "paid"**
   The `applications` table allows users to UPDATE any column on their own rows (RLS: `auth.uid() = user_id`). A user could run a direct query setting `status = 'paid'` without ever paying. The `transition_application_status` RPC exists but doesn't prevent direct updates. **Fix:** Replace the user UPDATE policy with one that excludes `status` changes, or use a trigger that prevents users from setting status to payment-related values.

2. **Users can change their own `plan` on profiles**
   The `profiles` UPDATE policy lets users modify any column, including `plan`. A user could set `plan = 'concierge'` without paying. **Fix:** Add a trigger or restricted column list.

#### MEDIUM

3. **Leaked password protection is disabled** — already flagged previously, still not enabled.

4. **`public_promo_codes` view has no RLS** — it's a `security_barrier` view so it's acceptable, but worth confirming it only exposes `code`, `discount_percent`, `is_active` (it does).

5. **Messages table missing admin UPDATE** — admins can't mark messages as `read`. Minor but worth adding.

#### LOW / Confirmed OK

- `user_roles` — properly locked down, only admins can INSERT/UPDATE/DELETE
- `checkout_sessions` — fully blocked from client (`false`), service-role only
- `email tables` — service-role only, correct
- `consent_log` — append-only, correct
- `audit_log` — admin-only, correct
- `waitlist` / `affiliate_applications` — public INSERT with validation, correct

---

### Part 2: 5 Email Sequences

The project already has 3 templates (purchase-confirmation, ready-pack-delivery, contact-form-confirmation) and the fanbasis webhook already triggers purchase-confirmation. Here's what needs building:

#### Sequence 1: Waitlist Confirmation
- **Template:** `waitlist-confirmation.tsx` — "You're on the list for [plan]"
- **Trigger:** After successful waitlist insert on PricingPage

#### Sequence 2: Post-Purchase Onboarding (Day 1)
- Already partially done — `purchase-confirmation` fires from webhook
- **Template:** `onboarding-welcome.tsx` — "Your Ready Pack is waiting, here's what to do first"
- **Trigger:** Fire from fanbasis webhook after purchase-confirmation, with tips on completing onboarding

#### Sequence 3: Contact Form Confirmation
- Already exists and wired. No changes needed.

#### Sequence 4: Ready Pack Delivery
- Template exists (`ready-pack-delivery.tsx`) but need to verify it's triggered when the user completes onboarding
- **Trigger:** Wire into GetStarted.tsx or wherever onboarding completes

#### Sequence 5: Admin Deletion Alert
- **Template:** `admin-deletion-alert.tsx` — notifies admin of accounts flagged for cleanup
- **Trigger:** Called from the existing `check-expired-accounts` edge function

---

### Implementation Steps

**Step 1 — Fix critical RLS vulnerabilities (database migrations)**
- Add a trigger on `applications` that prevents non-admin users from changing `status` to payment-related values (`paid`, `prepared`, `office_visited`, `cpf_issued`)
- Add a trigger on `profiles` that prevents non-admin users from changing the `plan` column

**Step 2 — Add admin UPDATE policy on messages**
- Allow admins to update messages (mark as read)

**Step 3 — Create 3 new email templates**
- `waitlist-confirmation.tsx`
- `onboarding-welcome.tsx`
- `admin-deletion-alert.tsx`
- Update `registry.ts` with all new templates

**Step 4 — Wire email triggers**
- PricingPage.tsx: fire `waitlist-confirmation` after successful waitlist insert
- fanbasis-webhook: fire `onboarding-welcome` alongside purchase-confirmation
- check-expired-accounts: fire `admin-deletion-alert` to admin email
- Verify ready-pack-delivery is triggered (wire if not)

**Step 5 — Deploy all updated edge functions**

**Step 6 — Enable leaked password protection**

### Technical Details

- All email templates use React Email components matching existing brand styling (green primary `#22c55e`, dark background aesthetic)
- Triggers use `supabase.functions.invoke('send-transactional-email', ...)` with idempotency keys
- RLS fixes use BEFORE UPDATE triggers (SECURITY DEFINER) rather than complex column-level policies, which Postgres doesn't natively support in RLS
- The admin deletion alert is a transactional email (triggered by a specific system event for one admin recipient per run), not marketing

