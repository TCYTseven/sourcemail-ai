# LassoMail — AI that drafts your email replies

LassoMail is a focused AI email tool: it pre-drafts replies to your Gmail, guided by a **master prompt** your admin controls. You review and send — LassoMail never sends on its own.

> LassoMail is a fork of the open-source [Inbox Zero](https://github.com/elie222/inbox-zero) project (AGPL-3.0). See [LICENSE](LICENSE).

## Features

- **AI reply drafting** — pre-drafts replies in your tone and style.
- **Master prompt** — one admin-controlled instruction that shapes every draft, org-wide.
- **AI rules** — describe in plain English how your assistant should handle your inbox.
- **Reply tracking** — surfaces the emails still waiting on a reply from you.
- **Gmail integration** — OAuth sign-in, reading, and draft creation.

## Built with

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Turborepo](https://turbo.build/)

## Local Development

> **Prerequisites**: [Docker](https://docs.docker.com/engine/install/), [Node.js](https://nodejs.org/) v24+, and [pnpm](https://pnpm.io/) v10+

```bash
docker compose -f docker-compose.dev.yml up -d   # Postgres + Redis
pnpm install
npm run setup                                     # Interactive env setup
cd apps/web && pnpm prisma migrate dev && cd ../..
pnpm dev
```

Open http://localhost:3000

To use the local Google emulator:

```bash
docker compose -f docker-compose.dev.yml --profile google-emulator up -d
```

Then point `apps/web/.env` at it with:

```bash
GOOGLE_BASE_URL=http://localhost:4002
GOOGLE_CLIENT_ID=emulate-google-client.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=emulate-google-secret
```
