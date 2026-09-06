# Cloudflare deployment
Recommended production split:
- Web: Cloudflare Pages/Workers static frontend.
- API: a container-compatible backend host or Cloudflare Workers-compatible API rewrite.
- DNS/HTTPS: Cloudflare.
- Secrets: deployment environment, never Git.

Before production, configure `DTECH_API`/frontend API URL and the Meta OAuth callback to the public API domain.
