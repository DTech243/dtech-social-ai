# DTech Social AI — Production Foundation

Production-oriented monorepo for DTech Social AI: dashboard, API, PostgreSQL, AI, media storage, and Meta OAuth integration points.

## Important
This archive contains **no real Meta credentials**. Set secrets through the deployment environment. Meta account connection requires a Meta Developer app, OAuth configuration, approved permissions where required, and the user's authorization.

## Structure
- `apps/web` — dashboard frontend
- `apps/api` — FastAPI backend
- `packages/database` — database notes/schema foundation
- `packages/ai` — AI provider abstraction
- `packages/meta` — Meta OAuth/Graph API abstraction
- `packages/storage` — media storage abstraction
- `packages/shared` — shared configuration/types
- `infrastructure/cloudflare` — Cloudflare deployment notes
- `infrastructure/docker` — production containers

## Local API
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Windows PowerShell activation: `.venv\\Scripts\\Activate.ps1`

## Environment
Copy `.env.example` to `.env` and configure secrets. Never commit `.env`.

## Meta setup later
Configure the Meta Developer App with the production callback URL exposed by the API. Do not paste the App Secret into source control.
