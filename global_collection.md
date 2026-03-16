Initiate Mobile Money Inflow 
— POST `/global-collection/inflow/initiate`
Sample Payload
```json
{
  "phoneNumber": "0980802xxx",
  "pin": "0000",
  "callbackUrl": "https://webhook.site/95f4b996-922e-42c0-9167-1f88e29561c1",
  "amount": 10,
  "currency": "CDF",
  "topupVendor": "AIRTEL"
}
```

Sample Response:
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
Fetch Collection Transaction — GET 
Endpoint: `global-collection/transactions/a822e327-4bcd-40ec-ac61-ed3622eac000`
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