from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode
from app.config import settings
router=APIRouter()
@router.get('/oauth/start')
def oauth_start():
    if not settings.meta_app_id: raise HTTPException(503,'META_APP_ID is not configured')
    # Permissions must match the exact Meta products/review status of the application.
    params={'client_id':settings.meta_app_id,'redirect_uri':settings.meta_redirect_uri,'response_type':'code','state':'REPLACE_WITH_SERVER_SIDE_STATE'}
    return RedirectResponse('https://www.facebook.com/dialog/oauth?'+urlencode(params))
@router.get('/oauth/callback')
def oauth_callback(code:str|None=None,error:str|None=None):
    if error: raise HTTPException(400,error)
    if not code: raise HTTPException(400,'Missing OAuth code')
    return {'status':'callback-received','next':'Exchange code server-side and persist encrypted token.'}
@router.get('/status')
def status(): return {'connected':False,'provider':'meta','configured':bool(settings.meta_app_id)}
