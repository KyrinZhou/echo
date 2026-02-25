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
- **Convex backend**: `convex dev` requires a Convex project connection. Use `npx convex dev` to set up a new project or link to an existing one.
- **Root URL redirects**: The web app's Clerk middleware protects all routes except `/sign-in` and `/sign-up`. Unauthenticated requests to `/` redirect to `/sign-in`.
- **Sentry build warning**: The web build may warn about missing `SENTRY_AUTH_TOKEN` for source map uploads. This is non-blocking; set `SENTRY_AUTH_TOKEN=""` to suppress if needed.
