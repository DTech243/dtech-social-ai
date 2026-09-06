# Cloudflare production setup

## Workers Builds
- Git repository: `dtech-social-ai`
- Production branch: `main`
- Root directory: `/`
- Build command: `npm ci && npm run typecheck`
- Deploy command: `npx wrangler deploy`
- Preview deploy command: `npx wrangler versions upload`

Do not use the old `dtech-website build token`. It belongs to another project. This project uses Wrangler and Worker secrets.

## Required Cloudflare resources
1. Workers AI binding `AI`.
2. R2 bucket `optional-media-storage`.
3. Hyperdrive configuration bound as `HYPERDRIVE` and pointing to a PostgreSQL database.
4. Custom domain, for example `social.dtech.cd`.

## Secrets
Set with Wrangler or the Cloudflare dashboard:
- `META_APP_ID`
- `META_APP_SECRET`
- `SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`

## Hyperdrive
Create a Hyperdrive configuration from the PostgreSQL connection string, then replace `REPLACE_WITH_HYPERDRIVE_ID` in `wrangler.jsonc` with the returned ID.
