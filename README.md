# colab

**One question, several language models, one integrated answer.**

colab (short for *collaborative genAI*) sends the same prompt to one model or to a group of them through [Vercel AI Gateway](https://vercel.com/ai-gateway), shows every answer side by side, and asks one model to integrate them into a single response. It can also turn an answer into an image, and preview the HTML a model writes.

It was built in late 2025 as Pixan's first orchestrator. This repository is a clean copy of that code, published in November 2026.

## What it does

- **Single mode**: pick one of the models and chat with it.
- **Group mode**: four models answer independently, then one integrates their answers.
- **Images**: generate a schema, an infographic or a realistic image from an answer.
- **Preview**: run the HTML a model wrote in a sandboxed frame, next to its code.
- **Estimated cost**: each answer shows an estimate of what it cost in tokens.

It is one Next.js page and three API routes. No database and no accounts: the conversation lives in the browser tab.

```
browser ──► /api/chat ─────────────────► Vercel AI Gateway ──► the models
        ──► /api/generate-infographic ─►        "
        ──► /api/credits ──────────────►        "
              ▲
        password check (lib/auth.js)
```

## Run it

You need Node.js 20.9 or later and a Vercel AI Gateway key.

```bash
git clone https://github.com/pixan-ai/colab
cd colab
npm ci
cp .env.example .env.local
```

Fill in the two variables in `.env.local`:

| Variable | Purpose |
|---|---|
| `AI_GATEWAY_API_KEY` | Your Vercel AI Gateway key. Create one for this app only and give it a spending limit. |
| `AUTH_PASSWORD` | The password the app asks for. Make it long and random. Without it, the APIs let nobody in. |

```bash
npm run dev
```

Open http://localhost:3000 and enter the password.

To deploy, import the repository into Vercel (or any host that runs Next.js) and set the same two variables there.

## Models

The models on offer are in one file, [`lib/genai-models.js`](lib/genai-models.js). The interface lists them and `/api/chat` rejects any other, so that file is the only place to edit. Model ids must match the [AI Gateway catalog](https://ai-gateway.vercel.sh/v1/models), which changes over time: if a model stops answering, check its id there first.

## Security

Whoever has the password can spend your gateway credits, so the app is built to keep it safe:

- All three API routes require the password in the `x-auth-password` header, compared in constant time. With no `AUTH_PASSWORD` set, every request is denied.
- Five wrong passwords from one IP address block it for 15 minutes.
- `/api/chat` only forwards the models in the list.
- Code written by a model runs in a sandboxed frame with its own origin, so it cannot read the session.

Known limits: the attempt counter lives in the memory of each server instance, so on serverless hosts it slows brute force down but is not a global counter; there is one shared password and no record of who used it. The real protections are a long random password and a spending limit on the key. See [SECURITY.md](SECURITY.md).

## Tests

```bash
npm test
```

This builds the app and runs the acceptance scenarios in [`features/seguridad.feature`](features/seguridad.feature) against the real server (`next start`). The gateway is replaced by a local double, so the tests use no credits and no network. The scenarios are written in Spanish.

## License

[MIT](LICENSE)
