# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a pnpm monorepo ("Echo") managed with Turborepo. It contains a voice AI dashboard (web) and an embeddable voice widget, both built with Next.js 15 and backed by Convex (serverless BaaS) with Clerk authentication.

### Monorepo structure

| Package | Purpose | Dev port |
|---|---|---|
| `apps/web` | Main Next.js dashboard with Clerk auth | 5090 |
| `apps/widget` | Embeddable Vapi voice call widget | 5091 |
| `packages/backend` | Convex schema, queries, mutations | N/A (cloud) |
| `packages/ui` | Shared shadcn/ui component library | N/A |
| `packages/eslint-config` | Shared ESLint configuration | N/A |
| `packages/typescript-config` | Shared TypeScript configuration | N/A |

### Running services

- `pnpm dev` starts all services via Turborepo (web + widget + convex dev).
- `pnpm --filter web dev` / `pnpm --filter widget dev` to run individual apps.
- Standard commands for lint/build/typecheck are in each `package.json`; see `turbo.json` for orchestration.

### Required environment variables

Both apps need `.env.local` files (gitignored). These are populated automatically from Cursor Cloud secrets:

- `apps/web/.env.local`: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `apps/widget/.env.local`: `NEXT_PUBLIC_CONVEX_URL`
- Convex backend also needs `CLERK_JWT_ISSUER_DOMAIN` (set in Convex dashboard)
- **Clerk mode**: Production keys start with `pk_live_`/`sk_live_`; dev keys start with `pk_test_`/`sk_test_`. The "Development mode" badge on sign-in only disappears with production keys. When switching Clerk instances, update keys in Cursor Cloud secrets, Vercel project env vars, and the Convex `CLERK_JWT_ISSUER_DOMAIN` (the issuer domain changes between dev/prod instances).

To create `.env.local` files from environment variables:
```bash
printf 'NEXT_PUBLIC_CONVEX_URL=%s\nNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=%s\nCLERK_SECRET_KEY=%s\n' \
  "$NEXT_PUBLIC_CONVEX_URL" "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "$CLERK_SECRET_KEY" \
  > apps/web/.env.local
printf 'NEXT_PUBLIC_CONVEX_URL=%s\n' "$NEXT_PUBLIC_CONVEX_URL" > apps/widget/.env.local
```

### Gotchas

- **pnpm build approvals**: The `pnpm.onlyBuiltDependencies` field in root `package.json` whitelists native build scripts (`@tailwindcss/oxide`, `esbuild`, `sharp`, etc.). Without this, `pnpm install` will skip these builds and Tailwind/image processing will not work.
- **`@workspace/ui` lint**: The UI package runs `eslint .` directly, but `eslint` is only a transitive devDependency (via `@workspace/eslint-config`). In strict pnpm isolation, `eslint` is not on `@workspace/ui`'s PATH. Running `pnpm --filter web lint` and `pnpm --filter widget lint` (which use `next lint`) works correctly.
- **Web app requires valid Clerk keys**: The web app's Clerk middleware validates the publishable key on every request. Without real Clerk credentials, even dev mode returns 500. The widget app does not require Clerk.
- **Production build requires Clerk**: `next build` for web fails during static generation without valid Clerk keys (needed at build time for pages using `ClerkProvider`).
- **Convex backend**: `convex dev` requires a Convex project connection. Use `npx convex dev` to set up a new project or link to an existing one. Deploying new Convex functions to the cloud requires either interactive `npx convex dev` (browser login) or a `CONVEX_DEPLOY_KEY` from the Convex dashboard (Settings → Deploy Keys). Without deploying, the web app will show "Could not find public function" errors for new queries/mutations.
- **Convex local development**: You can run Convex locally without authentication by selecting "Start without an account" when prompted by `npx convex dev`. This creates an anonymous local deployment at `http://127.0.0.1:3210`. Update `NEXT_PUBLIC_CONVEX_URL` in `apps/web/.env.local` to point to the local backend. Note: `auth.config.ts` references `process.env.CLERK_JWT_ISSUER_DOMAIN` — Convex CLI validates that all `process.env` references in auth config are set as deployment environment variables. For local development, either hardcode the domain or set it via `npx convex env set`.
- **Root URL redirects**: The web app's Clerk middleware protects all routes except `/sign-in` and `/sign-up`. Unauthenticated requests to `/` redirect to `/sign-in`.
- **Sentry build warning**: The web build may warn about missing `SENTRY_AUTH_TOKEN` for source map uploads. This is non-blocking; set `SENTRY_AUTH_TOKEN=""` to suppress if needed.
- **Stale `.next` cache after builds**: Running `pnpm --filter web build` (production build) then `pnpm --filter web dev` can cause `Cannot find module './vendor-chunks/...'` errors because the dev server picks up stale production webpack chunks. Fix: `rm -rf apps/web/.next` before restarting the dev server.
- **Shell env overrides `.env.local`**: Next.js resolves `NEXT_PUBLIC_*` env vars with shell env taking precedence over `.env.local`. When Cursor Cloud secrets inject `NEXT_PUBLIC_CONVEX_URL` (pointing to cloud), use `env -u NEXT_PUBLIC_CONVEX_URL pnpm --filter web dev` to unset it and let `.env.local` take effect for local Convex development.

### Vercel deployment

- **Production URL**: `https://echo-web-gamma.vercel.app`
- **Auto-deploys**: The `echo-web` and `echo-widget` projects auto-deploy from GitHub pushes (preview on branches, production on main merge).
- **Promote preview to production**: `vercel promote <preview-url> --yes --token "$VERCEL_TOKEN" --scope kyrinzhous-projects`
- **Required env vars on Vercel**: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (already configured on the existing project).
- **Widget build on Vercel**: The root `turbo build` builds both web and widget. The widget requires `NEXT_PUBLIC_CONVEX_URL` at build time. Ensure this env var is set in the Vercel project settings for both apps.
