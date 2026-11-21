# Security policy

## Reporting a vulnerability

Use GitHub's private vulnerability reporting: the **Security** tab of this repository, then **Report a vulnerability**. Please do not open a public issue with details. Include steps to reproduce and the impact you observed.

If that option is not available to you, open a public issue that says only "I have a security report, please contact me", with no technical details.

## What protects the app

| Control | Where | What it does |
|---|---|---|
| Password | `lib/auth.js` | The three API routes require `x-auth-password`, compared with `crypto.timingSafeEqual`. With no `AUTH_PASSWORD` configured, every request is denied. |
| Brute-force brake | `lib/auth.js` | Five failures from one IP address block it for 15 minutes (429 with `Retry-After`), even if the right password comes next. A success clears the failures. |
| Model list | `lib/genai-models.js`, `pages/api/chat.js` | A model outside the list gets a 400 and never reaches the gateway. |
| Preview isolation | `components/AppPreview.js` | HTML written by a model runs in a `sandbox` frame without a shared origin, and opens in a new tab with `noopener`. |
| Headers | `next.config.js` | HSTS, `nosniff`, `X-Frame-Options`, `Permissions-Policy` and a content security policy. |

Each control has a scenario in `features/seguridad.feature`.

## Known limits

- **The brute-force brake lives in the memory of each server instance.** On serverless hosts there can be several instances and they restart, so the counter is not global. Use a long random password and a gateway key with a spending limit.
- **The client address is read from `x-forwarded-for`.** That is trustworthy on Vercel, which overwrites the header. Behind another proxy, make sure it does the same.
- **The 15-minute window has no automated test.**
- **The content security policy still allows `unsafe-inline` and `unsafe-eval`**: the interface uses inline styles and scripts.
- **The React and Vue previews do not load**: the policy blocks the scripts they need from unpkg. The HTML preview works.
- **One shared password.** There are no accounts and no record of who signed in.
