## Initiate Mobile Money Inflow
**Endpoint:** `POST /v1/global-collection/mobile-money/initiate`

**Sample Payload:**
```json
{
  "phoneNumber": "0980802xxx",
  "pin": "0000",
  "callbackUrl": "https://your-app.com/callback",
  "amount": 10,
  "currency": "CDF",
  "topupVendor": "AIRTEL"
}
```

**Sample Response:**
```json
{
  "code": "00",
  "description": "Successful",
  "data": {
    "transactionReference": "a822e327-4bcd-40ec-ac61-ed3622eac000",
    "status": "PENDING",
    "message": "success"
  }
}
```

---

## Fetch Collection Transaction
**Endpoint:** `GET /v1/global-collection/mobile-money/transaction/{transactionId}`

**Sample Response:**
```json
{
  "code": "00",
  "description": "Successful",
  "data": {
    "transactionId": "a822e327-4bcd-40ec-ac61-ed3622eac000",
    "coreUserId": "xxxx-xxxx-4402-97c0-6c3824cxxxxx",
    "account": "0980802918",
    "status": "APPROVED",
    "amount": 10.00,
    "currency": "CDF"
  }
}
```
