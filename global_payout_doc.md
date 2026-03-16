# Goal: Update GlobalPayout documentation

Update the existing GlobalPayout docs page and add a new GlobalCollections page.

The docs live in `/Users/nombauser/nomba/docs/`. Use the existing structure there.

---

## Context

The API has been refactored. The request DTOs are now cleaner and more API-user-friendly. The key changes:
- `paymentMethod` is now a top-level string field (enum value: `BANK`, `MOBILE_MONEY`, `INTERAC`, `FASTER_PAYMENTS`, `SEPA`)
- `source`, `doFormFieldValidation`, `consentGivenToAddBeneficiary` are all handled server-side — not needed in the request
- `institute` object, `paymentInfo` object, `purposeOfPayment`, `accountType` are removed from the request
- For bank routing codes use `institutionCode` (sort code for FASTER_PAYMENTS, SWIFT/BIC for SEPA, institution number for Canada Bank)
- For bank/provider names use `institutionName` (bank name for BANK, provider display name for MOBILE_MONEY)
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
  "description": "Successful",
  "status": false,
  "data": [
    { "code": "BANK", "displayName": "Bank Transfer" },
    { "code": "MOBILE_MONEY", "displayName": "Mobile Money" },
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
| `BANK` (non-Canada) | `accountNumber`, `receiverName`, `institutionName` (bank name) | `narration` |
| `BANK` (Canada) | `accountNumber`, `receiverName`, `institutionCode` (institution number), `beneficiary.beneficiaryEmail` | `beneficiary.securityQuestion`, `beneficiary.securityQuestionAnswer`, `beneficiary.transitNumber`, `narration` |
| `MOBILE_MONEY`  | `accountNumber` (recipient phone number), `receiverName`, `institutionName` (provider display name, e.g. "Mpesa") | `narration` |
| `INTERAC`       | `receiverName`, `beneficiary.beneficiaryEmail` | `beneficiary.securityQuestion`, `beneficiary.securityQuestionAnswer` |
| `FASTER_PAYMENTS` | `accountNumber`, `receiverName`, `institutionCode` (sort code, 6 digits) | `narration` |
| `SEPA`          | `accountNumber` (IBAN), `receiverName`, `institutionCode` (SWIFT/BIC code) | `narration` |

**Sample Payloads:**

MOBILE_MONEY (DRC):
```json
{
  "amount": 100.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "USD",
  "receiverName": "John Cena",
  "accountNumber": "+243812345678",
  "institutionName": "Mpesa",
  "sourceCountryIsoCode": "NG",
  "destinationCountryIsoCode": "CD",
  "authCode": "2580",
  "paymentMethod": "MOBILE_MONEY",
  "narration": "Family support"
}
```

> **Tip:** Call `GET /v1/global-payout/mobile-money/providers` to get the available providers and their `code`/`displayName`. Use `displayName` as `institutionName`.

BANK (DRC):
```json
{
  "amount": 500.0,
  "sourceCurrency": "USD",
  "destinationCurrency": "USD",
  "accountNumber": "CD1234567890123456",
  "receiverName": "John Cena",
  "sourceCountryIsoCode": "NG",
  "destinationCountryIsoCode": "CD",
  "authCode": "2580",
  "paymentMethod": "BANK",
  "narration": "Business payment"
}
```

INTERAC (Canada):
```json
{
  "amount": 250.0,
  "sourceCurrency": "CAD",
  "destinationCurrency": "CAD",
  "receiverName": "Jane Doe",
  "sourceCountryIsoCode": "NG",
  "destinationCountryIsoCode": "CA",
  "authCode": "2580",
  "paymentMethod": "INTERAC",
  "beneficiary": {
    "beneficiaryEmail": "jane.doe@email.com",
    "securityQuestion": "What is your pet's name?",
    "securityQuestionAnswer": "Fluffy"
  }
}
```

BANK (Canada):
```json
{
  "amount": 250.0,
  "sourceCurrency": "CAD",
  "destinationCurrency": "CAD",
  "accountNumber": "1234567890",
  "receiverName": "Jane Doe",
  "institutionCode": "001",
  "sourceCountryIsoCode": "NG",
  "destinationCountryIsoCode": "CA",
  "authCode": "2580",
  "paymentMethod": "BANK",
  "beneficiary": {
    "beneficiaryEmail": "jane.doe@email.com"
  }
}
```

FASTER_PAYMENTS (UK):
```json
{
  "amount": 1000.0,
  "sourceCurrency": "GBP",
  "destinationCurrency": "GBP",
  "accountNumber": "12345678",
  "receiverName": "James Smith",
  "institutionCode": "204514",
  "sourceCountryIsoCode": "NG",
  "destinationCountryIsoCode": "GB",
  "authCode": "2580",
  "paymentMethod": "FASTER_PAYMENTS",
  "narration": "Invoice payment"
}
```

SEPA (Europe):
```json
{
  "amount": 500.0,
  "sourceCurrency": "EUR",
  "destinationCurrency": "EUR",
  "accountNumber": "DE89370400440532013000",
  "receiverName": "Hans Müller",
  "institutionCode": "DEUTDEDB",
  "sourceCountryIsoCode": "NG",
  "destinationCountryIsoCode": "DE",
  "authCode": "2580",
  "paymentMethod": "SEPA",
  "narration": "Service fee"
}
```

**Sample Response:**
```json
{
  "code": "00",
  "description": "Successful",
  "status": false,
  "data": {
    "wtTransactionId": "01kj9ssfwqd4a97jhdx65gmyqy",
    "coreTransactionId": "API-FX_TX_DR-D4400-b0a438d7-891f-47cc-8f27-98f6b44c8fc4",
    "status": "PROCESSING",
    "coreStatus": "PAYMENT_SUCCESSFUL",
    "type": "TRANSFER",
    "meta": {
      "wt_transaction_id": "01kj9ssfwqd4a97jhdx65gmyqy",
      "source_amount": "15.0",
      "destination_amount": "12.72",
      "source_currency": "USD",
      "destination_currency": "EUR",
      "amount_charged": "35.0",
      "currency_pair_name": "EUR/USD",
      "payment_method": "SWIFT",
      "destination_country": "BE",
      "destination_country_name": "Belgium",
      "source_country": "NG",
      "narration": "Testing SWIFT",
      "trade_side": "SELL",
      "spread_amount": "0.01",
      "spread_currency": "EUR",
      "client_callback_url": "https://your-app.com/callback",
      "transactionCategory": "General"
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

### 7. Fetch Mobile Money Providers
**Endpoint:** `GET /v1/global-payout/mobile-money/providers`

Returns the available mobile money providers for the user's region. The response `code` maps to `institutionCode` and `displayName` maps to `institutionName` in the authorize-transfer request.

**Sample Response:**
```json
{
  "code": "00",
  "description": "Success",
  "data": [
    { "code": "mpesa", "displayName": "Mpesa" },
    { "code": "airtel", "displayName": "Airtel Money" },
    { "code": "orange", "displayName": "Orange Money" }
  ]
}
```

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
- Payment method values are uppercase strings matching the enum: `BANK`, `MOBILE_MONEY`, `INTERAC`, `FASTER_PAYMENTS`, `SEPA`.
- `SWIFT` is implemented but not exposed in `GET /payment-methods` — it may be added in a future release.
