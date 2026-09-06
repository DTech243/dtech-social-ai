from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import health, posts, ai, meta, dashboard, brand

app = FastAPI(title="DTech Social AI API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=[x.strip() for x in settings.cors_origins.split(',') if x.strip()], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
for router, prefix, tags in [(health.router,'/api','health'),(dashboard.router,'/api/dashboard','dashboard'),(posts.router,'/api/posts','posts'),(ai.router,'/api/ai','ai'),(meta.router,'/api/meta','meta'),(brand.router,'/api/brand','brand')]: app.include_router(router,prefix=prefix,tags=[tags])
