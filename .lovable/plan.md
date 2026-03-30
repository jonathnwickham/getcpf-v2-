

# Landing Page Overhaul — From AI-Looking to Launch-Ready

## The Problem
The audit identified specific issues that make the landing page look AI-generated and hurt conversion: no hero visual, generic copy, fake-feeling testimonials, no nationality flags, no post-CPF value section, no trust signals near the buy button, FAQ defaulting to all-closed, emoji-heavy pain points, and generic section headers.

## Plan

### 1. Hero Section — Add Visual + Sharpen Copy
**Hero.tsx** changes:
- Replace the generic subhead with something specific: "Most foreigners waste a full day on their CPF. Our users are done by 9 AM."
- Add a visual mockup of the Ready Pack dashboard using a styled browser-frame component with a screenshot-like preview (CSS-only, no real image needed — show a card grid with form fields, office finder, checklist icons to suggest the product). This sits to the right of the text on desktop, below on mobile.
- Add a nationality flag row below the proof items: 🇺🇸 🇬🇧 🇩🇪 🇫🇷 🇿🇦 🇳🇬 🇦🇺 🇦🇷 🇨🇴 🇮🇳 🇯🇵 🇰🇷 with a "+40 more" label. Instantly communicates global coverage.

### 2. Pain Points — Remove AI Pattern
**PainPoints.tsx** changes:
- Replace the emoji + "X" pattern with a cleaner design: a subtle red-tinted left border on each card, the service name bold, no emoji icons. Use lucide-react icons instead (Smartphone, UtensilsCrossed, Plane, Building2, Ticket, ShoppingCart).
- Change section header from "The reality" to "Life without a CPF" — more specific, less generic.

### 3. New Section — "What Happens After You Get Your CPF"
**Create AfterCPF.tsx** — placed between Pricing and Testimonials in Index.tsx:
- Three cards: "Open a bank account in 10 minutes" (Nubank), "Get a SIM card and data plan" (Claro/Vivo), "Start apartment hunting" (QuintoAndar).
- Brief copy: "Your CPF unlocks everything. We show you exactly what to do next."
- This extends perceived value of the $49 and references the existing unlock guide content.

### 4. Testimonials — Make Them Feel Real
**Testimonials.tsx** changes:
- Remove the "Read more" expand pattern — show the full text for all testimonials (no click-to-expand). Dead interactive buttons destroy trust.
- Add more friction/detail to quotes to make them feel authentic — e.g., add the specific office names, mention small frustrations that got resolved.
- Keep the expand/collapse but default the first two to expanded so visitors see real content immediately.

### 5. Trust Signals Near the Buy Button
**Pricing.tsx** changes:
- Add a row of micro trust signals directly below the Self-Service CTA button: a lock icon + "Secure payment", a clock icon + "5 min setup", a users icon + "200+ foreigners served".
- These appear only on the highlighted (Self-Service) tier card.

### 6. FAQ — Open First Two by Default
**FAQ.tsx** changes:
- Default `openIndex` to show the first FAQ item open on load (index 0). Visitors who scroll to FAQ are close to buying — reduce friction.
- Change section header from generic "FAQ" label to just keep the existing good subhead "Things you're probably wondering".

### 7. Section Headers — Remove Generic AI Patterns
Across all components:
- PainPoints: "The reality" → "Life without a CPF"
- HowItWorks: "How it works" label + "Here's how it works" h2 → "Four steps" label + "From zero to CPF in one visit"
- Pricing: "Simple pricing" → "One payment, done"  
- These are small text changes but they remove the most obvious AI-generated patterns.

### 8. Disclaimer Cleanup
**Footer.tsx** — if there's a long disclaimer, trim it to two sentences max.

## Files Changed
| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Add product mockup, sharper copy, nationality flags row |
| `src/components/PainPoints.tsx` | Lucide icons, remove emoji+X pattern, new header |
| `src/components/AfterCPF.tsx` | **New** — post-CPF value section |
| `src/pages/Index.tsx` | Insert AfterCPF between Pricing and Testimonials |
| `src/components/Testimonials.tsx` | Default first 2 expanded, remove dead "Read more" buttons |
| `src/components/Pricing.tsx` | Add trust signals below Self-Service CTA |
| `src/components/FAQ.tsx` | Default first item open, tweak header |
| `src/components/HowItWorks.tsx` | New header text |

No database changes. No new dependencies. Pure frontend — all changes are visual and copy.

