# Authentication safeguards

Customer and legacy cleaner login/signup use the shared API's IP quotas. A 429
response contains a readable wait time, shown by the existing error alert.
Failed login clears the entered password; repeated submits are ignored while
the current submit is loading. No saved password is introduced.

Registration caps password and confirmation inputs at 72 characters. The backend
also enforces a maximum of 72 UTF-8 bytes, so accented text can hit the byte limit
sooner. Invalid passwords create no account. Login credentials are unchanged.

See ../backend/AUTH_RATE_LIMITS.md for quotas, proxy trust and test coverage.
The Android bundle export passed; native UI interaction still requires a device.

Branch: `auth-rate-limits`.

```text
Add authentication rate limits and password input safeguards
```

## Email recovery and verification

The login screen offers password recovery with a single-use email code. Security
settings can request and confirm email verification. Reset revokes old sessions;
verification does not grant a cleaner approval. Automated tests use a fake mailbox,
not external email. A real SMTP relay must be configured and tested for deployment.
See ../backend/ACCOUNT_RECOVERY.md for API, limits and restart/delivery caveats.
