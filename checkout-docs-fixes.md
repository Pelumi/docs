# Checkout Documentation - Categorized Fixes



## Inconsistencies

Places where different pages contradict each other, creating ambiguity about what's correct.

| # | Issue | Locations |
|---|-------|-----------|
| 1 | Two different verification endpoints: `GET /v1/transactions/accounts/single` (with query param) vs `POST /v1/transactions/accounts` (with body) — unclear which to use | `verify-transactions.mdx:33` vs `accept-online-payments.mdx:230` |
| 2 | Two overlapping guides cover the same checkout flow with different detail levels and slightly different info — no clear distinction between them | `accept-online-payments.mdx` vs `create-checkout-order.mdx` |
| 3 | No consistent guidance on sandbox vs production base URL — `sandbox.nomba.com` only appears on the testing page, all other examples use `api.nomba.com` | `testing.mdx:47` vs all other pages |

---

## Missing Content

Information a developer needs that simply doesn't exist in the docs.

| # | Issue |
|---|-------|
| 1 | No request body field definitions table — required vs optional fields, expected types, and formats are undocumented |
| 2 | No error response examples — developers don't know what failures look like or how to handle them |
| 3 | No explanation of how to obtain sandbox/test API keys or whether they differ from production keys |
| 4 | No end-to-end sandbox walkthrough (get keys -> create order -> open link -> enter test card -> submit OTP -> verify) |
| 5 | No documentation of sandbox limitations — which endpoints work, whether webhooks fire, what can't be tested |
| 6 | No guidance on what `orderReference` should be — is it merchant-generated or Nomba-generated? What format? |
| 7 | Refund and `/v1/checkout/transaction` endpoints are flagged "production only" but no sandbox alternatives are offered |

---

## Structural Improvements

### Add Checkout Overview
* Add an overview page for checkout under the `accept payment` side menu
* Update the link on the `Accept Pagment's` overview page to point to the new checkout overview page instead of pointing to the `create order` page.
* the overview page should contain 
    * sumary of the checkout product
    * links to the testing page to inform the user how to test their integration
    * link to the sdk page recommending sdk integration for mobile and web (react).
    * link to the testing page for how to test the integration
* Create a new menu named `Sandbox testing` under the checkout submenu to more detaild process for testing. (this should replace the existing Test page)


### https://developer.nomba.com/docs/api-basics/environment
* clear explain the usage of the sandbox url for any api call involving our test environment
* stress that base url must be corrctly pairs with the environments clientId and secret when creating a token


### https://developer.nomba.com/docs/api-basics/testing
* Add a bold notice here to ensure that sandbox token must be generated using the test clientId and secret from the dashboard, along with the sandbox base url when working with the test environment. Refer them to the environment page for details
* add some more details on the testing flow that is easy to follow