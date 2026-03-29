

# FanBasis Payment Integration Plan

## What You Need to Provide

Before I can build anything, I need **two things** from you:

1. **Your FanBasis API Key** -- get it from your FanBasis dashboard under "API Keys". I'll store it securely as a backend secret.
2. **Your FanBasis creator handle** -- this is the slug in your FanBasis profile URL (e.g. if your page is `fanbasis.com/yourcreator`, the handle is `yourcreator`).

That's it. No domain setup needed for payments. No Stripe account. FanBasis handles everything including tax, compliance, and chargebacks as the Merchant of Record.

---

## How It Will Work

### The User Flow

```text
Email → Plan selection → Redirect to FanBasis checkout → 
FanBasis handles payment → User returns to app → 
Set password → Access granted
```

The key difference from what you have now: instead of a fake "Pay with card" button, the user clicks "Get started -- $49" and gets sent to a real FanBasis-hosted checkout page. When they pay, FanBasis redirects them back to your app where they set their password and get in.

### Two Approaches Available

FanBasis offers two checkout options:

**Option A: Redirect checkout** -- User clicks the button, goes to a FanBasis payment page, pays, comes back. Simpler to build, works immediately.

**Option B: Embedded checkout** -- Payment form loads inside your app via an iframe. Smoother experience but requires an existing product ID in FanBasis first.

I recommend **Option A** to start -- it's faster to ship and you can upgrade to embedded later.

---

## Technical Implementation (5 parts)

### 1. Database: Add payment tracking
- Add `payment_status` and `fanbasis_customer_id` columns to the `profiles` table
- Create a `payments` table to log transactions (payment_id, amount, status, user_id)

### 2. Edge Function: Create checkout session
- `create-checkout` edge function calls FanBasis `POST /public-api/checkout-sessions` with the $49 one-time product
- Passes the user's email as metadata so we can link payment to account
- Returns the `payment_link` URL to the frontend

### 3. Edge Function: Webhook receiver
- `fanbasis-webhook` edge function receives `payment.succeeded` events
- Validates the HMAC-SHA256 signature using the webhook secret
- Updates the user's `payment_status` to `paid` in the database
- Idempotent -- checks `payment_id` to prevent double-processing

### 4. Update PricingPage.tsx
- Replace the mock payment step with a real "Pay $49" button
- Button calls the `create-checkout` edge function, gets the payment link, redirects user
- Add a `success_url` that points back to `/pricing?payment=success`
- On return, detect the success parameter and move to the password step

### 5. Auth guards
- `/ready-pack` and `/dashboard` check `payment_status = 'paid'` before allowing access
- Unpaid users get redirected to `/pricing`

---

## What FanBasis Gives You for Free

- Card payments (Visa, Mastercard, Amex, Discover)
- Apple Pay and Google Pay
- Cash App Pay
- Chargeback handling and dispute management
- PCI compliance
- Global payment acceptance (works from South Africa, no restrictions)
- Receipt emails to customers

No PayPal though -- FanBasis is the Merchant of Record so payments go through their processor only.

---

## Next Step

Confirm you want to proceed and I'll ask you to securely add your FanBasis API key. Then I'll build the whole thing.

