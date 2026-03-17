# Goal: Update GlobalPayout documentation

Update the existing GlobalPayout docs page and add a new GlobalCollections page.

The docs live in `/Users/nombauser/nomba/docs/`. Use the existing structure there.

---

## Context

The API has been refactored. The request DTOs are now cleaner and more API-user-friendly. The key changes:
- `paymentMethod` is now a top-level string field (enum value: `BANK`, `MobileMoney`, `INTERAC`, `FASTER_PAYMENTS`, `SEPA`)
- `source`, `doFormFieldValidation`, `consentGivenToAddBeneficiary` are all handled server-side — not needed in the request
- `institute` object and `paymentInfo` object are removed from the request — handled server-side
- `accountType` is now a top-level optional string field (e.g. `Individual`, `Corporate`) — required by some corridors (FASTER_PAYMENTS, SEPA)
- `purposeOfPayment` is now a top-level optional string field — pass it when required by the corridor (e.g. SEPA corporate transfers)
- For bank routing codes use `institutionCode` (sort code for FASTER_PAYMENTS, SWIFT/BIC for SEPA, institution number for Canada Bank)
- For bank/provider names use `institutionName` (bank name for BANK, provider display name for MobileMoney)
- `phoneNumber` field is removed — for MOBILE_MONEY, put the recipient phone number in `accountNumber`
- `meta` in the response is now a clean JSON object containing only transaction-relevant info — no vendor, user, or internal system data

---

## PM Descriptions (use these verbatim as section intros)

### GlobalPayout
GlobalPayout enables cross-border fund disbursements, giving you full control over international transfers from initiation to completion.

### AuthTransfer
Manage the complete transfer lifecycle with a single endpoint. AuthTransfer walks you through every required step from initiating a transfer to final authorization, ensuring nothing is missed before funds are moved.

### ConvertMoney
When moving funds across currencies, ConvertMoney handles the conversion for you. Call this endpoint whenever a transaction requires a currency switch, and we'll take care of the exchange before disbursement.

### FetchExchangeRates
Before sending funds in a currency different from your base currency, use this endpoint to retrieve the latest exchange rates. This ensures your customers always see accurate, up-to-date conversion values before a transaction is confirmed.

### FetchTransaction
Track the status of any transaction at any point in its lifecycle. FetchTransaction takes a transaction reference and returns its current state, giving you and your customers full visibility into where funds are at any given time.

### AuthExchange
Move funds between your own accounts with ease. AuthExchange is designed for internal transfers, allowing you to shift balances across your accounts without the overhead of an external disbursement flow.

### GlobalCollections
GlobalCollections simplifies the process of receiving funds, giving you reliable tools to collect money from customers across supported mobile money networks.

### InitiateMobileMoneyInflow
Trigger a mobile money collection from your customer. This endpoint initiates an inflow request through the supported mobile money flow, prompting the customer to complete the payment on their end.

### FetchMobileMoneyTransaction
Retrieve the status of any initiated mobile money transaction. Use this endpoint to confirm whether a collection was successful, pending, or failed, keeping your records accurate and your customers informed.

---

## Supported Payment Methods (GET /v1/global-payout/payment-methods)

This is a new endpoint. Include it in the GlobalPayout docs.

**Sample Response:**
```json
{
  "code": "00",
  "description": "Success",
  "status": false,
  "data": [
    { "code": "BANK", "displayName": "Bank Transfer" },
    { "code": "MobileMoney", "displayName": "Mobile Money" },
    { "code": "INTERAC", "displayName": "Interac" },
    { "code": "FASTER_PAYMENTS", "displayName": "Faster Payments" },
    { "code": "SEPA", "displayName": "SEPA" }
  ]
}
```

> **Note:** The endpoint returns only the payment method code and display name. Destination countries, limits, and delivery timelines are documented in the Supported Countries page — not returned by the API. This keeps the response lean and easy to extend as new corridors are added.

---

## API Reference

### 1. Authorize Transfer (Auth Transfer)
**Endpoint:** `POST /v1/global-payout/transfer/authorize`

The `paymentMethod` field drives what additional fields are required:

| Payment Method   | Required fields                          | Optional fields         |
|-----------------|------------------------------------------|-------------------------|
| `BANK` (non-Canada, e.g. DRC) | `accountNumber`, `receiverName`, `institutionName` (bank display name), `institutionCode` (bank code from `/bank/providers`) | `narration` |
| `BANK` (Canada) | `accountNumber`, `receiverName`, `institutionCode` (institution number), `beneficiary.beneficiaryEmail` | `beneficiary.securityQuestion`, `beneficiary.securityQuestionAnswer`, `beneficiary.transitNumber`, `narration` |
| `MobileMoney`   | `accountNumber` (recipient phone number), `receiverName`, `institutionName` (provider display name, e.g. "Mpesa") | `narration` |
| `INTERAC`       | `receiverName`, `beneficiary.beneficiaryEmail` | `beneficiary.securityQuestion`, `beneficiary.securityQuestionAnswer` |
| `FASTER_PAYMENTS` | `accountNumber`, `receiverName`, `institutionCode` (sort code, 6 digits) | `accountType` (e.g. `Individual`, `Corporate`), `narration` |
| `SEPA`          | `accountNumber` (IBAN), `receiverName`, `institutionCode` (SWIFT/BIC code) | `accountType` (e.g. `Individual`, `Corporate`), `purposeOfPayment`, `narration` |

**Sample Payloads:**

MobileMoney (DRC):
```json
{
  "amount": 250.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "USD",
  "receiverName": "John Cena",
  "accountNumber": "0903086112",
  "institutionName": "Mpesa",
  "sourceCountryIsoCode": "CD",
  "destinationCountryIsoCode": "CD",
  "authCode": "2580",
  "paymentMethod": "MobileMoney",
  "narration": "Family support"
}
```

**Sample Response:**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "wtTransactionId": "01kky197w3xc6wyjenpc5r0tnp",
    "coreTransactionId": "API-FX_TX_DR-08A1B-6add611a-e538-4e67-bcf9-661c77a16804",
    "status": "PROCESSING",
    "coreStatus": "PAYMENT_SUCCESSFUL",
    "type": "TRANSFER",
    "meta": {
      "source_currency": "USD",
      "destination_country": "CD",
      "amount_charged": "255.0",
      "source_amount": "250.0",
      "wt_transaction_id": "01kky197w3xc6wyjenpc5r0tnp",
      "spread_currency": "USD",
      "trade_context": "default",
      "destination_country_name": "Congo DR",
      "source_country": "CD",
      "destination_amount": "250.0",
      "spread_amount": "0.0",
      "narration": "Family support",
      "transactionCategory": "General",
      "payment_destination_type": "Account",
      "trade_side": "BUY",
      "destination_currency": "USD",
      "currency_pair_name": "USD/USD",
      "payment_method": "MobileMoney",
      "tradeType": "FIXED_TRADE"
    },
    "prettyStatus": "Successful"
  }
}
```

> **Tip:** Call `GET /v1/global-payout/bank/providers?isMobileMoney=true` to get available mobile money providers. Use `displayName` as `institutionName`.

BANK (DRC):
> **Note:** For DRC bank transfers, `institutionCode` and `institutionName` are required. Get them from `GET /v1/global-payout/bank/providers`. The `destinationCurrency` should be `CDF` (Congolese Franc).
```json
{
  "amount": 2.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "CDF",
  "accountNumber": "00444555555",
  "receiverName": "John Doe",
  "institutionName": "Access Bank",
  "institutionCode": "access_bank",
  "sourceCountryIsoCode": "CD",
  "destinationCountryIsoCode": "CD",
  "authCode": "2580",
  "paymentMethod": "Bank",
  "narration": "Business payment"
}
```

**Sample Response (DRC BANK):**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "wtTransactionId": "01kkx3p9abc4d12ef56gh7ij8k",
    "coreTransactionId": "API-FX_TX_DR-1A2B3-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "PROCESSING",
    "coreStatus": "PAYMENT_SUCCESSFUL",
    "type": "TRANSFER",
    "meta": {
      "source_currency": "USD",
      "destination_country": "CD",
      "amount_charged": "2.0",
      "source_amount": "2.0",
      "wt_transaction_id": "01kkx3p9abc4d12ef56gh7ij8k",
      "spread_currency": "USD",
      "trade_context": "default",
      "destination_country_name": "Congo DR",
      "source_country": "CD",
      "destination_amount": "4500.0",
      "spread_amount": "0.0",
      "narration": "Business payment",
      "transactionCategory": "General",
      "payment_destination_type": "Account",
      "trade_side": "BUY",
      "destination_currency": "CDF",
      "currency_pair_name": "USD/CDF",
      "payment_method": "BANK",
      "tradeType": "FIXED_TRADE"
    },
    "prettyStatus": "Successful"
  }
}
```

INTERAC (Canada):
```json
{
  "amount": 21.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "CAD",
  "receiverName": "Thomas Doe",
  "sourceCountryIsoCode": "CD",
  "destinationCountryIsoCode": "CA",
  "authCode": "2580",
  "narration": "Ted",
  "paymentMethod": "Interac",
  "lockedExchangeRateId": "01k7pcakf0t8g03rvny3z5mr1p",
  "beneficiary": {
    "beneficiaryEmail": "testtt@yahoo.com",
    "securityQuestion": "Test",
    "securityQuestionAnswer": "Test"
  }
}
```

**Sample Response (Canada INTERAC):**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "wtTransactionId": "01kkyc0emx2117681kmvhwzxyg",
    "coreTransactionId": "API-FX_TX_DR-08A1B-ce488d5e-c88f-4486-9da5-e7201feb66d4",
    "status": "PROCESSING",
    "coreStatus": "PAYMENT_SUCCESSFUL",
    "type": "TRANSFER",
    "meta": {
      "source_currency": "USD",
      "destination_country": "CA",
      "amount_charged": "41.0",
      "source_amount": "21.0",
      "wt_transaction_id": "01kkyc0emx2117681kmvhwzxyg",
      "spread_currency": "CAD",
      "trade_context": "default",
      "destination_country_name": "Canada",
      "source_country": "CD",
      "destination_amount": "28.98",
      "spread_amount": "0.042",
      "narration": "Ted",
      "transactionCategory": "General",
      "payment_destination_type": "Account",
      "trade_side": "BUY",
      "destination_currency": "CAD",
      "currency_pair_name": "USD/CAD",
      "payment_method": "INTERAC",
      "tradeType": "FIXED_TRADE"
    },
    "prettyStatus": "Successful"
  }
}
```

BANK (Canada):
```json
{
  "amount": 2.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "CAD",
  "accountNumber": "234543245433",
  "receiverName": "Jane Doe",
  "institutionCode": "34444",
  "sourceCountryIsoCode": "CD",
  "destinationCountryIsoCode": "CA",
  "authCode": "2580",
  "paymentMethod": "Bank",
  "lockedExchangeRateId": "01k7pcakf0t8g03rvny3z5mr1p",
  "beneficiary": {
    "beneficiaryEmail": "test@yoop.com",
    "securityQuestion": "353333"
  }
}
```

**Sample Response (Canada BANK):**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "wtTransactionId": "01kkyaqbv4jn3w35a0njkhk7pe",
    "coreTransactionId": "API-FX_TX_DR-08A1B-a17e5b7d-959c-4893-a715-1f5f4dbfb1e4",
    "status": "PROCESSING",
    "coreStatus": "PAYMENT_SUCCESSFUL",
    "type": "TRANSFER",
    "meta": {
      "source_currency": "USD",
      "destination_country": "CA",
      "amount_charged": "22.0",
      "source_amount": "2.0",
      "wt_transaction_id": "01kkyaqbv4jn3w35a0njkhk7pe",
      "spread_currency": "CAD",
      "trade_context": "default",
      "destination_country_name": "Canada",
      "source_country": "CD",
      "destination_amount": "2.76",
      "spread_amount": "0.004",
      "narration": "Sent from Nomba",
      "transactionCategory": "General",
      "payment_destination_type": "Account",
      "trade_side": "BUY",
      "destination_currency": "CAD",
      "currency_pair_name": "USD/CAD",
      "payment_method": "BANK",
      "tradeType": "FIXED_TRADE"
    },
    "prettyStatus": "Successful"
  }
}
```

FASTER_PAYMENTS (UK):
```json
{
  "amount": 23.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "GBP",
  "accountNumber": "404130729909118",
  "receiverName": "Ayodeji Abimbola",
  "institutionCode": "433333",
  "sourceCountryIsoCode": "CD",
  "destinationCountryIsoCode": "GB",
  "authCode": "2580",
  "narration": "Ted Thomos",
  "paymentMethod": "FASTER_PAYMENTS",
  "accountType": "Individual",
  "lockedExchangeRateId": "01k4a8rfrngw76yfcj3ak1rw71"
}
```

**Sample Response (Faster Payments UK):**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "wtTransactionId": "01kkyf2smfe1zw37dhs472ep14",
    "coreTransactionId": "API-FX_TX_DR-08A1B-ce2a2dbf-5650-40fd-a171-4f69cd15d302",
    "status": "PROCESSING",
    "coreStatus": "PAYMENT_SUCCESSFUL",
    "type": "TRANSFER",
    "meta": {
      "source_currency": "USD",
      "destination_country": "GB",
      "amount_charged": "43.0",
      "source_amount": "23.0",
      "wt_transaction_id": "01kkyf2smfe1zw37dhs472ep14",
      "spread_currency": "GBP",
      "trade_context": "default",
      "destination_country_name": "United Kingdom",
      "source_country": "CD",
      "destination_amount": "15.85",
      "spread_amount": "1.17",
      "narration": "Ted Thomos",
      "transactionCategory": "General",
      "payment_destination_type": "Account",
      "trade_side": "SELL",
      "destination_currency": "GBP",
      "currency_pair_name": "GBP/USD",
      "payment_method": "Faster Payments",
      "tradeType": "FIXED_TRADE"
    },
    "prettyStatus": "Successful"
  }
}
```

SEPA (Europe):
```json
{
  "amount": 23.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "GBP",
  "accountNumber": "GB41CLJU04130729909118",
  "receiverName": "trfff tttt",
  "institutionCode": "CLJUGB21",
  "sourceCountryIsoCode": "CD",
  "destinationCountryIsoCode": "GB",
  "authCode": "2580",
  "narration": "Ted",
  "paymentMethod": "SEPA",
  "accountType": "Individual",
  "purposeOfPayment": "Family Support",
  "lockedExchangeRateId": "01k4a8rfrngw76yfcj3ak1rw71"
}
```

**Sample Response (SEPA):**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "wtTransactionId": "01kkyffhqbgpfxh68chnpmheyg",
    "coreTransactionId": "API-FX_TX_DR-08A1B-4e1f0e68-bc94-4dc0-aa83-f070f62eab00",
    "status": "PROCESSING",
    "coreStatus": "PAYMENT_SUCCESSFUL",
    "type": "TRANSFER",
    "meta": {
      "source_currency": "USD",
      "destination_country": "GB",
      "amount_charged": "43.0",
      "source_amount": "23.0",
      "wt_transaction_id": "01kkyffhqbgpfxh68chnpmheyg",
      "spread_currency": "GBP",
      "trade_context": "default",
      "destination_country_name": "United Kingdom",
      "source_country": "CD",
      "destination_amount": "15.85",
      "spread_amount": "1.17",
      "narration": "Ted",
      "transactionCategory": "General",
      "payment_destination_type": "Account",
      "trade_side": "SELL",
      "destination_currency": "GBP",
      "currency_pair_name": "GBP/USD",
      "payment_method": "SEPA",
      "tradeType": "FIXED_TRADE"
    },
    "prettyStatus": "Successful"
  }
}
```

---

### 2. Convert Money
**Endpoint:** `POST /v1/global-payout/money/convert`

**Sample Payload:**
```json
{
  "amount": 15,
  "currency": "USD",
  "destinationCurrency": "EUR",
  "transactionType": "EXCHANGE",
  "sourceCountryIsoCode": "NG"
}
```

**Sample Response:**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "fromAmount": 15.0,
    "fromCurrency": "USD",
    "fromFormatted": "$15.00",
    "toAmount": 13.04,
    "toCurrency": "EUR",
    "toFormatted": "13,04 €",
    "spreadAmount": 0.12,
    "spreadCurrency": "EUR",
    "exchangeRateId": "01kkk4b7rh8pcvtw1s1nxs144s",
    "currencyPairName": "EUR/USD",
    "feeAmount": 0.0,
    "feeCurrency": "USD",
    "feeExpression": ""
  }
}
```

---

### 3. Authorize Exchange (transfer between own accounts)
**Endpoint:** `POST /v1/global-payout/exchange/authorize`

**Sample Payload:**
```json
{
  "amount": 1,
  "sourceCurrency": "USD",
  "destinationCurrency": "CDF",
  "senderName": "ADEBUKOLA AKANJI",
  "receiverName": "ADEBUKOLA AKANJI",
  "sourceCountryIsoCode": "CD",
  "destinationCountryIsoCode": "CD",
  "authCode": "5555",
  "narration": "Transfer between my accounts"
}
```

**Sample Response:**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "wtTransactionId": "01kkk8cjk0fpw9jx2n01wd8yfw",
    "coreTransactionId": "API-P2P-CB9EC-0c2d962e-4730-48e7-b522-d65cac511549",
    "status": "PROCESSING",
    "coreStatus": "SUCCESS",
    "type": "EXCHANGE",
    "meta": {
      "wt_transaction_id": "01kkk8cjk0fpw9jx2n01wd8yfw",
      "source_amount": "1.0",
      "destination_amount": "2250.0",
      "source_currency": "USD",
      "destination_currency": "CDF",
      "amount_charged": "1.0",
      "currency_pair_name": "USD/CDF",
      "destination_country": "CD",
      "source_country": "CD",
      "narration": "Transfer between my accounts",
      "trade_side": "BUY",
      "spread_amount": "250.0",
      "spread_currency": "CDF",
      "trade_context": "default",
      "transactionCategory": "General"
    }
  }
}
```

---

### 4. Fetch Exchange Rates
**Endpoint:** `GET /v1/global-payout/exchange-rates?from=EUR&to=USD`

**Sample Response:**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "rates": [
      {
        "exchangeRateId": "01kkk7pab9mjt70wvk6pzk8mzx",
        "currencyPairName": "EUR/USD",
        "bidRate": "$1.13",
        "askRate": "$1.14",
        "midRate": "$1.14",
        "tradeRegion": "",
        "tradeContext": "",
        "createdAt": "2026-03-13T09:15:57.161946",
        "updatedAt": ""
      }
    ]
  }
}
```

---

### 5. Fetch Transaction
**Endpoint:** `GET /v1/global-payout/transactions/{transactionId}`

**Sample Response:**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "transactionId": "01kj9ssfwqd4a97jhdx65gmyqy",
    "status": "PROCESSING",
    "coreStatus": "PAYMENT_SUCCESSFUL",
    "type": "TRANSFER",
    "createdAt": "2026-03-13T09:15:57.161946"
  }
}
```

---

### 6. Fetch Payment Methods
**Endpoint:** `GET /v1/global-payout/payment-methods`

Returns the list of supported payment method codes and display names. Destination countries, limits, and delivery timelines live in the Supported Countries documentation page — not in the API response.

---

### 7. Fetch Institution Providers (Banks & Mobile Money)
**Endpoint:** `GET /v1/global-payout/bank/providers?isMobileMoney={true|false}`

| Query Param | Type | Default | Description |
|---|---|---|---|
| `isMobileMoney` | boolean | `false` | `false` returns banks, `true` returns mobile money providers |

Returns institutions for the user's region (derived from JWT). Use `code` as `institutionCode` and `displayName` as `institutionName` in the authorize-transfer request.

**Sample Response — Banks (`isMobileMoney=false`):**
```json
{
  "code": "00",
  "description": "Success",
  "status": false,
  "data": [
    { "code": "access_bank", "displayName": "Access Bank" },
    { "code": "bank_of_africa", "displayName": "Bank Of Africa" },
    { "code": "eco_bank", "displayName": "Eco Bank" },
    { "code": "equity_bank", "displayName": "Equity Bank" },
    { "code": "raw_bank", "displayName": "Raw Bank" },
    { "code": "uba", "displayName": "United Bank of Africa" }
  ]
}
```

**Sample Response — Mobile Money Providers (`isMobileMoney=true`):**
```json
{
  "code": "00",
  "description": "Success",
  "status": false,
  "data": [
    { "code": "nomba", "displayName": "Nomba" },
    { "code": "airtel", "displayName": "Airtel Money" },
    { "code": "mpesa", "displayName": "Mpesa" },
    { "code": "orange", "displayName": "Orange" }
  ]
}
```

**Using providers in a transfer request:**
```json
{
  "amount": 2.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "CDF",
  "accountNumber": "00444555555",
  "receiverName": "John Doe",
  "institutionName": "Access Bank",
  "institutionCode": "access_bank",
  "sourceCountryIsoCode": "CD",
  "destinationCountryIsoCode": "CD",
  "authCode": "2255",
  "paymentMethod": "Bank",
  "narration": "Business payment"
}
```

> **Tip:** `code` from this endpoint → `institutionCode` in the transfer. `displayName` → `institutionName`.

---

## GlobalCollections

### 1. Initiate Mobile Money Inflow
**Endpoint:** `POST /v1/global-collection/mobile-money/initiate`

For more details on the request payload, go to the GlobalCollections implementation:
`/Users/nombauser/nomba/kudi/java/src/main/java/com/nomba/merchant_acquiring/vendor_api/globalcollection/`

### 2. Fetch Mobile Money Transaction
**Endpoint:** `GET /v1/global-collection/mobile-money/transaction/{transactionId}`

For more details, see the GlobalCollections implementation referenced above.

---

## Notes for the documentation bot

- The `meta` field in transfer/exchange responses is now a **JSON object** (not a stringified JSON). Only safe, transaction-relevant keys are present — no vendor names, user IDs, internal references, or wallet balances.
- The `source`, `doFormFieldValidation`, and `consentGivenToAddBeneficiary` fields have been removed from the AuthTransfer request — they are now handled server-side.
- `AuthExchange` (exchange between own accounts) does NOT require a `source` field in the request anymore.
- Payment method values: `BANK`, `MobileMoney`, `INTERAC`, `FASTER_PAYMENTS`, `SEPA`. The `paymentMethod` field is case-insensitive on the server, but use the canonical casing shown above.
- `SWIFT` is implemented but not exposed in `GET /payment-methods` — may be added in a future release.
- `accountType` is an optional top-level field. Pass `Individual` or `Corporate` where required by the corridor (FASTER_PAYMENTS, SEPA).
- `purposeOfPayment` is an optional top-level field. Pass it for SEPA or any corridor that requires a transfer reason.
- `lockedExchangeRateId` is optional. When provided, locks in the exchange rate from a prior `ConvertMoney` call. Recommended for all cross-currency transfers to guarantee the rate shown to the user.
- For DRC BANK transfers, always call `GET /v1/global-payout/bank/providers` first to get valid `institutionCode` and `institutionName` values.
