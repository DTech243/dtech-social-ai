from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
router=APIRouter()
posts=[]
class PostCreate(BaseModel):
    title:str=Field(min_length=1,max_length=200)
    content:str=Field(min_length=1)
    platforms:list[str]=['instagram']
    status:str='DRAFT'
    scheduled_at:Optional[str]=None
@router.get('')
def list_posts(): return posts
@router.post('',status_code=201)
def create_post(data:PostCreate):
    item={'id':len(posts)+1,**data.model_dump()}; posts.append(item); return item
@router.delete('/{post_id}')
def delete_post(post_id:int):
    global posts; posts=[p for p in posts if p['id']!=post_id]; return {'deleted':post_id}
