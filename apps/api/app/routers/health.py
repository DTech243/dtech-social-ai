from fastapi import APIRouter
router=APIRouter()
@router.get('/health')
def health(): return {'status':'ok','service':'dtech-social-ai','meta_configured':bool(__import__('app.config',fromlist=['settings']).settings.meta_app_id)}
