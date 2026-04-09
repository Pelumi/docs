# Checkout NG Documentation Review
**Date:** 2026-03-31
**Scope:** Nigeria Checkout — product docs, API reference, guides, and api-basics pages
**Purpose:** Pre-implementation findings report for review before any changes are made

---

## Summary

The checkout documentation has three overlapping problems: **contradictions** (pages give conflicting instructions), **gaps** (critical information developers need simply isn't there), and **structural fragmentation** (content spread across guides, product pages, and api-basics with no clear hierarchy). The fixes file identifies the right issues; this report expands on each one, adds newly observed issues, and proposes concrete resolutions.

---

## Part 1 — Confirmed Issues from `checkout-docs-fixes.md`

### 1.1 Two different verification endpoints (Inconsistency #1)

**Severity: High** — Developer will use the wrong endpoint and get confused when it doesn't work in sandbox.

| Location | Endpoint | Method | Identifier used |
|---|---|---|---|
| `verify-transactions.mdx:40` | `/v1/transactions/accounts/single` | GET | `?orderReference=` (query param) |
| `accept-online-payments.mdx:238` | `/v1/transactions/accounts/single` | GET | `?transactionRef=` (query param) |
| `testing.mdx:47` | `/v1/transactions/accounts` | POST | `transactionRef` (body) |

Three different combinations for what is described as the same action. The actual inconsistency is deeper than the fixes file notes: it's not just two pages, it's three, and two of them use the same endpoint (`/v1/transactions/accounts/single`) but different query params (`orderReference` vs `transactionRef`).

**Proposed resolution:**
- Clarify in `verify-transactions.mdx` which identifiers `/v1/transactions/accounts/single` accepts and whether both `orderReference` and `transactionRef` are valid query params.
- Clearly separate the two use cases: "verify by order reference" (pre-delivery check) vs "look up by transaction ID" (post-webhook check).
- The POST endpoint on `testing.mdx` (`/v1/transactions/accounts`) is sandbox-only — label it clearly and do not mix it with production verification docs.

---

### 1.2 Two overlapping guides covering the same flow (Inconsistency #2)

**Severity: Medium** — Developer doesn't know which page is authoritative.

`accept-online-payments.mdx` (Guides section) and `create-checkout-order.mdx` (Products section) both walk through the full checkout creation flow end-to-end. Key differences observed:

| | `accept-online-payments.mdx` | `create-checkout-order.mdx` |
|---|---|---|
| Depth | High-level 6-step journey | More detailed, includes split payments, tokenization, webhook payload |
| Webhook examples | ✅ Card + bank transfer payloads | ✅ Expanded card payment payload |
| Verification | Uses `transactionRef` query param | Refers to `verify-transactions.mdx` |
| `orderReference` field | Not explained | Not explained either |
| Split payment | ❌ Not covered | ✅ Covered |
| Allowed payment methods | ❌ Not covered | ✅ Covered |

The guide (`accept-online-payments.mdx`) was likely written first and never updated to defer to the product page. It now duplicates content less completely.

**Proposed resolution:**
- Keep `create-checkout-order.mdx` as the canonical technical reference for checkout order creation.
- Refactor `accept-online-payments.mdx` into a true integration guide: it should narrate the end-to-end journey (authentication → create order → handle webhook → verify → deliver value) but link to product pages for detail rather than repeating it.
- Add a note at the top of `accept-online-payments.mdx` pointing to `create-checkout-order.mdx` for the full field reference.

---

### 1.3 Sandbox vs production base URL inconsistency (Inconsistency #3)

**Severity: High** — Developer uses production URL with sandbox credentials and gets auth failures, or vice versa.

`sandbox.nomba.com` appears only once in the entire documentation — in `testing.mdx:47`. Every other page (including `accept-online-payments.mdx`, `create-checkout-order.mdx`, `verify-transactions.mdx`) uses `api.nomba.com` exclusively, with no note that sandbox calls require a different base URL.

`environment.mdx` explains the two environments conceptually but never states the sandbox URL, never shows what a sandbox auth call looks like, and never warns that credentials and base URL must be paired.

**Proposed resolution:**
- Update `environment.mdx` to explicitly state both base URLs and require URL+credential pairing (see Part 2.5 below).
- Add a short callout box to `testing.mdx` (and the new Sandbox Testing page) with a prominent notice about the correct base URL and credential pairing.
- Consider adding a global environment indicator component (e.g., a switchable `<Tabs>` for Sandbox / Production) on the create-checkout-order page to show both URL variants in the code examples.

---

### 1.4 Missing request body field definitions (Missing Content #1)

**Severity: High** — Developers must reverse-engineer field requirements from code examples.

Neither `create-checkout-order.mdx` nor any other checkout page has a structured table of the `order` object fields. There is no documentation of:
- Which fields are required vs optional
- Data types and formats (e.g. is `amount` a string or number? what currency formats are accepted?)
- Length/format constraints on `orderReference`
- What `customerId` is (merchant-defined? Nomba-assigned?)
- Whether `callbackUrl` must be HTTPS

**Proposed resolution:**
- Add a **Request Parameters** table to `create-checkout-order.mdx` covering the full `order` object, similar to the table format used in `cancel-checkout-order.mdx`.
- Clearly mark required vs optional, include type, and add a short description + example for each field.

---

### 1.5 No error response examples (Missing Content #2)

**Severity: High** — Developer has no reference for what failure looks like and can't build proper error handling.

Zero checkout pages show a failed API response. The only error indicator across all checkout pages is the cancel order page (which we just added). No page shows what a 400, 401, or 500 looks like in practice, nor what error codes (`01`, `96`, etc.) mean.

**Proposed resolution:**
- Add an error response example to `create-checkout-order.mdx` and `verify-transactions.mdx` at minimum.
- Consider adding a shared "Error Codes" section to the checkout overview (or a dedicated API basics page) listing the common `code` values and their meanings.

---

### 1.6 No guidance on obtaining sandbox API keys (Missing Content #3)

**Severity: Medium** — Developer doesn't know if test keys are different from live keys or how to find them.

`environment.mdx` includes a screenshot of the dashboard showing production/sandbox keys but gives no step-by-step instructions for locating or using the sandbox credentials. `testing.mdx` jumps straight to test card details without explaining setup.

**Proposed resolution:**
- Add a short "Getting sandbox credentials" section to `testing.mdx` (or the new Sandbox Testing page): navigate to dashboard → API Keys → copy the test `clientId` and `clientSecret`.
- Explicitly state that sandbox and production keys are separate pairs generated together when an API key is created.

---

### 1.7 No end-to-end sandbox walkthrough (Missing Content #4)

**Severity: High** — Developer can't validate their integration in isolation before going live.

No page walks through the full sandbox flow in sequence:
1. Get test credentials from dashboard
2. Generate a sandbox token (`sandbox.nomba.com`)
3. Create a checkout order (sandbox)
4. Open the checkout link
5. Enter test card details
6. Enter the test OTP
7. Verify the transaction

`testing.mdx` lists test cards and a verification endpoint but provides no narrative connecting them.

**Proposed resolution:**
- Create a new **Sandbox Testing** page (as proposed in the fixes file) that covers this end-to-end flow as a `<Steps>` component.
- This page should live under the Checkout submenu and replace the standalone `testing.mdx` page (or make `testing.mdx` redirect to it).

---

### 1.8 No documentation of sandbox limitations (Missing Content #5)

**Severity: Medium** — Developer wastes time testing features that don't work in sandbox.

There is no list of which checkout endpoints are sandbox-compatible. Currently `verify-transactions.mdx` flags `/v1/checkout/transaction` as production-only with a `<Warning>` but offers no alternative. Developers don't know if webhooks fire in sandbox, whether refunds can be tested, etc.

**Proposed resolution:**
- Add a **Sandbox Limitations** table to the Sandbox Testing page listing endpoint availability per environment.
- For production-only endpoints, state the sandbox alternative (e.g., use `/v1/transactions/accounts` POST instead of `/v1/checkout/transaction` GET).

---

### 1.9 No guidance on `orderReference` format (Missing Content #6)

**Severity: Medium** — Developers guess at format and hit validation errors.

The `orderReference` field appears throughout the checkout docs but is never explained:
- Is it merchant-generated or Nomba-assigned?
- What format is required (UUID? free-form string? length limit)?
- The create order response returns an `orderReference` — is this the same value the merchant passed in, or a new Nomba-generated one?
- Is it idempotent (same reference = same order)?

The sample in `create-checkout-order.mdx` shows a UUID-like value (`90e81e8a-bc14-4ebf-89c0-57**`), while the response shows a different UUID (`fd3002af-d48b-40a0-adba-0b**`). This suggests the request and response references are different — but this is never explained.

**Proposed resolution:**
- Add a `orderReference` field explanation in the request parameters table: "A unique reference you generate to identify this order. Must be unique per request. Recommended format: UUID v4. Max length: 64 characters."
- Clarify in the response section that the `orderReference` in the response is the Nomba-assigned order ID, distinct from the merchant-provided reference — or clarify if they are the same.

---

### 1.10 Production-only endpoints with no sandbox alternative (Missing Content #7)

**Severity: Low-Medium** — Discovered during sandbox testing, frustrating but not blocking.

`verify-transactions.mdx` warns that `/v1/checkout/transaction` is production-only. No sandbox alternative is offered. Similarly, the refund API is production-only (`refund-checkout-order.mdx`).

**Proposed resolution:**
- In both pages, add a note pointing developers to the sandbox alternative: use `POST /v1/transactions/accounts` with the transaction reference to look up sandbox transactions.
- This cross-link is currently only in `testing.mdx`, not where the developer would naturally look.

---

## Part 2 — Structural Improvements (from `checkout-docs-fixes.md`)

### 2.1 Add a Checkout Overview page

**Current state:** The Accept Payment overview (`overview.mdx`) has a "Checkout" card that links directly to `create-checkout-order.mdx`. There is no intermediate overview page for the Checkout product.

**Proposed:** Create `docs/products/accept-payment/checkout-overview.mdx` with:
- What Nomba Checkout is (1–2 paragraph summary)
- Supported payment methods (card, bank transfer, USSD, QR, BNPL, Apple Pay)
- Links to: Sandbox Testing, SDK recommendations (React, mobile), Create Order, Verify Transactions, Refund, Cancel Order
- A `<Steps>` high-level integration journey (5 steps: get keys → create order → display link → handle webhook → verify)

Update `overview.mdx` to point its Checkout card to this new page instead of directly to `create-checkout-order.mdx`.

---

### 2.2 Create a Sandbox Testing submenu page

**Current state:** `testing.mdx` lives under `api-basics/` in the nav. It only covers test card details and a POST verification endpoint.

**Proposed:** Create `docs/products/accept-payment/sandbox-testing.mdx` under the Checkout submenu. This page replaces the functional content of `testing.mdx` for checkout-specific testing and expands it significantly:
- Sandbox credentials setup
- Base URL notice
- End-to-end walkthrough (Steps component)
- Test card details (moved from `testing.mdx`)
- Transaction scenarios table (moved from `testing.mdx`)
- Sandbox limitations table
- Sandbox verification endpoint (`POST /v1/transactions/accounts`)

`testing.mdx` (under api-basics) can remain as a thin page that links to this new sandbox testing page for checkout, and to equivalent pages for other products.

---

### 2.3 Navigation changes

Current Checkout submenu pages in `docs.json`:
```
create-checkout-order
verify-transactions
recurring-payments
server-to-server
payment-methods
refund-checkout-order
cancel-checkout-order  ← newly added
```

**Proposed Checkout submenu order:**
```
checkout-overview          ← NEW
create-checkout-order
verify-transactions
refund-checkout-order
cancel-checkout-order
recurring-payments
server-to-server
payment-methods
sandbox-testing            ← NEW (replaces api-basics/testing for checkout)
```

The overview goes first to orient new developers; sandbox testing goes last as a reference page.

---

### 2.4 Update `environment.mdx`

**Current state:** Explains two environments conceptually but:
- Never states the sandbox base URL
- Never shows a sandbox auth example
- Doesn't mention URL/credential pairing requirement

**Proposed additions:**
- Add a two-column table: Environment → Base URL → When to use
  - Production: `https://api.nomba.com` → Live transactions
  - Sandbox: `https://sandbox.nomba.com` → Development & testing
- Add a `<Warning>` callout: "The sandbox base URL and sandbox credentials must always be used together. Using production credentials with the sandbox URL (or vice versa) will result in authentication errors."
- Add a short sandbox auth example showing a token request to `https://sandbox.nomba.com/v1/auth/token/issue`.

---

### 2.5 Update `testing.mdx`

**Current state:** Starts with a test card, has no context about how to use it.

**Proposed additions (as specified in fixes file, expanded):**
- Add a prominent `<Warning>` or `<Note>` at the top: "To use the sandbox environment, you must generate a token using your **test credentials** and the **sandbox base URL** (`https://sandbox.nomba.com`). See the [Environment page](/docs/api-basics/environment) for details."
- After the test card section, add a brief numbered flow connecting the pieces: (1) generate sandbox token → (2) create checkout order → (3) open checkout link → (4) enter test card → (5) enter OTP → (6) verify transaction.
- Link to the new `sandbox-testing.mdx` page for the full walkthrough.

---

## Part 3 — Additional Issues Observed

These were not in the fixes file but discovered during review.

### 3.1 `orderReference` in request vs response appears to be different values — never explained

In `create-checkout-order.mdx`, the request passes `"orderReference": "90e81e8a-..."` but the response returns `"orderReference": "fd3002af-..."`. These are clearly different. Developers will be confused about which one to use for verification. This is related to Missing Content #6 but distinct: the ambiguity is in the code example itself.

**Proposed:** Add a note below the response example explaining which `orderReference` to use for downstream calls (verification, cancellation, etc.).

---

### 3.2 `accept-online-payments.mdx` uses a different webhook payload format than `create-checkout-order.mdx`

The two pages show `tokenizedCardData` with different shapes:

| Field | `accept-online-payments.mdx` | `create-checkout-order.mdx` |
|---|---|---|
| Expiry field | `tokenExpiryDate` | `tokenExpiryYear` + `tokenExpiryMonth` |

One of these is wrong or outdated. This should be verified against the actual webhook payload and corrected.

---

### 3.3 `verify-transactions.mdx` response has `"status": false` at root level

The verify transaction response example on line 93 contains `"status": false` as a root-level field alongside `"code": "00"` and `"description": "SUCCESS"`. A `SUCCESS` response with `status: false` at root is contradictory and will confuse developers building response parsers. This should be reviewed and either corrected or explained.

---

### 3.4 `create-checkout-order.mdx` has a truncated/broken response example

Line 83 in `create-checkout-order.mdx`:
```
    }
```
The closing backtick for the JSON block is on the wrong indentation and missing its label — only `Response` opens, there is no corresponding closing code fence inside the CodeGroup. While this may render correctly, it is inconsistent with the rest of the file.

---

### 3.5 No mention of the checkout link lifecycle (expiry, redirect behaviour)

The create-checkout-order page tells developers to "display the checkout link to the customer" but never explains:
- Does the link expire? If so, when?
- What happens after a successful payment — does the customer get redirected to `callbackUrl`?
- What query params does Nomba append to `callbackUrl` on redirect (if any)?

This is critical for building a good UX and is currently undocumented.

---

## Proposed Change Summary

| # | File | Change type | Priority |
|---|---|---|---|
| 1 | `verify-transactions.mdx` | Fix endpoint contradictions, clarify query params | High |
| 2 | `accept-online-payments.mdx` | Refactor to true integration guide, remove duplicate content | Medium |
| 3 | `environment.mdx` | Add sandbox URL, credential pairing warning, auth example | High |
| 4 | `testing.mdx` | Add sandbox token warning, brief flow, link to new sandbox page | High |
| 5 | `create-checkout-order.mdx` | Add request fields table, error response, `orderReference` explanation, checkout link lifecycle | High |
| 6 | `docs/products/accept-payment/checkout-overview.mdx` | **Create new file** | Medium |
| 7 | `docs/products/accept-payment/sandbox-testing.mdx` | **Create new file** (full sandbox walkthrough) | High |
| 8 | `docs.json` | Update navigation (add overview + sandbox-testing, reorder checkout pages) | Medium |
| 9 | `overview.mdx` | Update Checkout card to link to new checkout overview | Low |
| 10 | `accept-online-payments.mdx` | Fix `tokenizedCardData` shape discrepancy vs `create-checkout-order.mdx` | Medium |
| 11 | `verify-transactions.mdx` | Fix `"status": false` contradiction in response example | Medium |
| 12 | `refund-checkout-order.mdx` + `verify-transactions.mdx` | Add sandbox alternative for production-only endpoints | Low |

---

*Ready for review. Awaiting approval before implementation begins.*