import { Hono } from 'hono'
import { setCookie, getCookie } from 'hono/cookie'

interface Env {
  ASSETS: Fetcher
  AI: Ai
  MEDIA: R2Bucket
  HYPERDRIVE: { connectionString: string }
  META_APP_ID?: string
  META_APP_SECRET?: string
  SESSION_SECRET?: string
  ADMIN_EMAIL?: string
  ADMIN_PASSWORD_HASH?: string
  FRONTEND_URL: string
  META_API_VERSION: string
  META_REDIRECT_URI: string
}

const app = new Hono<{ Bindings: Env }>()

const json = (c: any, data: unknown, status = 200) => c.json(data, status)

app.get('/api/health', (c) => json(c, {
  status: 'ok',
  service: 'dtech-social-ai',
  database: Boolean(c.env.HYPERDRIVE?.connectionString),
  media: Boolean(c.env.MEDIA),
  ai: Boolean(c.env.AI),
  metaConfigured: Boolean(c.env.META_APP_ID && c.env.META_APP_SECRET)
}))

app.get('/api/dashboard/summary', (c) => json(c, {
  posts: { total: 0, drafts: 0, scheduled: 0, published: 0 },
  engagement: { rate: 0, likes: 0, comments: 0, shares: 0 },
  campaigns: 0,
  media: 0,
  aiGenerations: 0,
  metaConnected: false
}))

app.get('/api/posts', (c) => json(c, []))
app.post('/api/posts', async (c) => {
  const body = await c.req.json()
  if (!body.title || !body.content) return json(c, { error: 'title and content are required' }, 400)
  // Persistence is intentionally isolated behind Hyperdrive; schema is in colis/db/schema.sql.
  return json(c, { id: crypto.randomUUID(), ...body, status: body.status ?? 'DRAFT' }, 201)
})
app.delete('/api/posts/:id', (c) => json(c, { deleted: c.req.param('id') }))

app.post('/api/ai/generate', async (c) => {
  const body = await c.req.json()
  const topic = String(body.topic || '').trim()
  if (!topic) return json(c, { error: 'topic is required' }, 400)
  try {
    const result = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'Tu es l’assistant éditorial officiel de DTech. Ton style est professionnel, clair et accessible. Slogan: Former - Innover - Transformer.' },
        { role: 'user', content: `Crée une publication ${body.platform || 'Instagram'} sur: ${topic}. Ton: ${body.tone || 'professionnel'}. Donne un texte court, un CTA et 5 hashtags.` }
      ]
    }) as any
    return json(c, { provider: 'cloudflare-workers-ai', result })
  } catch {
    return json(c, { provider: 'fallback', title: `${topic} — DTech`, content: `Découvrez ${topic} avec DTech. Former - Innover - Transformer.`, hashtags: ['#DTech','#Technologie','#Innovation','#Formation','#RDC'] })
  }
})

app.get('/api/meta/status', (c) => json(c, {
  configured: Boolean(c.env.META_APP_ID && c.env.META_APP_SECRET),
  connected: false,
  provider: 'meta'
}))

app.get('/api/meta/oauth/start', (c) => {
  if (!c.env.META_APP_ID) return json(c, { error: 'META_APP_ID is not configured' }, 503)
  const state = crypto.randomUUID()
  setCookie(c, 'meta_oauth_state', state, { httpOnly: true, secure: true, sameSite: 'Lax', maxAge: 600, path: '/' })
  const scopes = [
    'public_profile',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_insights'
  ].join(',')
  const url = new URL(`https://www.facebook.com/${c.env.META_API_VERSION}/dialog/oauth`)
  url.searchParams.set('client_id', c.env.META_APP_ID)
  url.searchParams.set('redirect_uri', c.env.META_REDIRECT_URI)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('state', state)
  url.searchParams.set('scope', scopes)
  return c.redirect(url.toString())
})

app.get('/api/meta/oauth/callback', async (c) => {
  const code = c.req.query('code')
  const state = c.req.query('state')
  const expected = getCookie(c, 'meta_oauth_state')
  if (!code || !state || !expected || state !== expected) return json(c, { error: 'Invalid OAuth state or missing code' }, 400)
  if (!c.env.META_APP_ID || !c.env.META_APP_SECRET) return json(c, { error: 'Meta credentials are not configured' }, 503)

  const tokenUrl = new URL(`https://graph.facebook.com/${c.env.META_API_VERSION}/oauth/access_token`)
  tokenUrl.searchParams.set('client_id', c.env.META_APP_ID)
  tokenUrl.searchParams.set('client_secret', c.env.META_APP_SECRET)
  tokenUrl.searchParams.set('redirect_uri', c.env.META_REDIRECT_URI)
  tokenUrl.searchParams.set('code', code)
  const tokenResponse = await fetch(tokenUrl)
  const tokenData = await tokenResponse.json()
  if (!tokenResponse.ok) return json(c, { error: 'Meta token exchange failed', details: tokenData }, 400)
  // TODO: encrypt/persist token and fetch authorized Pages/Instagram accounts using PostgreSQL.
  return c.redirect(`${c.env.FRONTEND_URL}/?meta=connected`)
})

app.get('/api/meta/webhook', (c) => {
  const mode = c.req.query('hub.mode')
  const token = c.req.query('hub.verify_token')
  const challenge = c.req.query('hub.challenge')
  if (mode === 'subscribe' && token && challenge && token === c.env.SESSION_SECRET) return c.text(challenge)
  return c.text('forbidden', 403)
})
app.post('/api/meta/webhook', async (c) => {
  const payload = await c.req.json().catch(() => ({}))
  console.log('Meta webhook', JSON.stringify(payload))
  return c.json({ received: true })
})

app.get('/api/brand', (c) => json(c, {
  name: 'DTech', slogan: 'Former - Innover - Transformer',
  description: 'Technologie, informatique, entrepreneuriat et formation.',
  primaryColor: '#0B0F19', accentColor: '#00D4FF'
}))

app.get('*', async (c) => {
  const url = new URL(c.req.url)
  return c.env.ASSETS.fetch(new Request(url, c.req.raw))
})

export default app
