# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Project structure

```
src/
  assets/           raw image files (jpg/png)
  content/
    assets.ts       single asset registry — swap placeholders here
    site.ts         product name, urls, team members
    app-demo.ts     all mock data inside the phone mockups
  components/apt/
    screens/        the three in-app phone screens (apt, fitting room, you)
    *.tsx           landing page sections
  lib/
    waitlist.ts             client entry for the signup form
    waitlist.functions.ts   server function (RPC)
    waitlist.server.ts      Resend delivery, env-driven
```

Swapping a placeholder image: drop the file in `src/assets/` and change the
matching import in `src/content/assets.ts`. Editing in-app copy, prices,
boards or the demo user: `src/content/app-demo.ts`.

## Environment variables

No `.env` is needed for ordinary local development. To exercise real waitlist
email delivery, copy `.env.example` to `.env`; these values are server-only.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend key; without it signups log instead of sending |
| `WAITLIST_FROM_EMAIL` | Verified sender; required when a Resend key is set |
| `WAITLIST_NOTIFY_EMAIL` | Internal inbox notified on each signup |
| `RESEND_AUDIENCE_ID` | Optional Resend audience for contacts |
| `WAITLIST_SEGMENT_ID` | Optional source segment attached to contacts and emails |

## Deploying to Vercel

Vercel requires a Pro team when this private organization repository is
connected to a team project. A Hobby project can deploy it only if the GitHub
repository is public.

1. Push this repo to GitHub and import it in Vercel.
2. `vercel.json` is already configured — Vercel runs `npm run build:vercel`
   (`NITRO_PRESET=vercel vite build`) and serves the `.vercel/output` build.
3. Add the environment variables above under Project Settings →
   Environment Variables, then redeploy.
