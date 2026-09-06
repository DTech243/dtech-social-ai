# DTech Social AI — Production Cloudflare Edition

Production-ready project foundation for DTech's social media management platform.

## Included
- Cloudflare Worker with Hono
- Dashboard served by Cloudflare Workers Static Assets
- Workers AI integration
- R2 media storage binding
- PostgreSQL through Cloudflare Hyperdrive
- Meta OAuth start/callback + webhook endpoints
- PostgreSQL schema for users, social accounts, posts, targets, media, campaigns, analytics, AI generations and audit logs
- GitHub Actions checks
- Production secrets template

## Cloudflare configuration
Because `wrangler.jsonc` is at repository root, set Cloudflare Workers Builds **Root directory** to `/`.

Use:
- Build command: `npm ci && npm run typecheck`
- Deploy command: `npx wrangler deploy`
- Non-production deploy command: `npx wrangler versions upload`

Do not use the old `dtech-website build token`.

## Before real Meta publishing
You must create/configure the Meta Developer App, set the exact OAuth redirect URI, request the permissions required by your use case, complete Meta review requirements when applicable, and authorize the DTech Facebook Page / Instagram professional account. The repository intentionally contains no real Meta secret or access token.

## Local
```bash
npm install
npx wrangler dev
```

## Production resources
- Cloudflare Worker
- R2 bucket `optional-media-storage`
- PostgreSQL database + Hyperdrive
- Workers AI
- Custom domain
- Meta Developer App
