# M2 Auth and Role Contract

This note describes the small contract that supports the M2 auth and profile bundle.

## Purpose

The account route owns reusable Supabase Auth entry points. It is intentionally separate from booking, cart, payment, order, and notification flows.

## Auth flows

- **Registration:** email and password create a customer account with optional full name metadata. Supabase sends the verification email; the app does not treat the account as verified until Supabase confirms it.
- **Login:** email/password uses signInWithPassword.
- **Logout:** the signed-in account uses signOut.
- **Password reset:** the reset request returns the same neutral message whether or not the email exists, avoiding account enumeration in UI copy.
- **Recovery:** the recovery link returns to /account; the page detects the recovery event and calls updateUser for the new password.
- **Verification:** the verification redirect returns to /account?verified=1 and presents a confirmation message.

## Configuration

Set these browser-safe public variables for the account route:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

The Supabase project must allow the local and deployed account redirect URLs. The local baseline in supabase/config.toml allows http://localhost:3000 and http://127.0.0.1:3000.

## Role model

The approved application roles are:

- admin
- staff
- seller
- customer

The role is server-controlled and must not be editable by a signed-in customer.

## Profile edit boundary

Authenticated customers may only update:

- full_name
- phone

They may not update:

- role
- active

## Implementation notes

- Keep role names consistent across database, helper modules, and UI copy.
- Keep the server-controlled fields separate from customer-editable fields.
- Reuse the role helper for documentation and flow checks instead of hard-coding role strings in multiple places.
- Keep booking, payment, order, cart, and notification behavior in their own milestones; this auth surface only establishes identity.
