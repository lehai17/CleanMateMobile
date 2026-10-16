# Repeat a previous booking

Open **Đơn hàng** and choose **Đặt lại** on a completed/cancelled order. The app
loads a private template and current services, keeps the booking contact, address
and notes, and asks for a new schedule. Review the current price before confirming.
If a service is retired, choose another one. Changed hour limits are explained.

Each new repeat action resets the Booking tab's previous draft or success screen.
Switching tabs preserves the current draft. A different logged-in user cannot
restore the previous account's repeat details. Rebooking creates a new unassigned
cash booking after confirmation; the previous order keeps its history.

Run `npm test` for draft/privacy/limit tests. The Android Expo export checks that
native screens and navigation compile; it does not test taps on a physical device.
API and browser checks are described in ../backend/REBOOKING.md.

Branch: `rebook-orders`. Commit:

```text
Add safe rebooking drafts to customer web and mobile
```
