from fastapi import APIRouter
from pydantic import BaseModel
router=APIRouter()
brand={'name':'DTech','slogan':'Former - Innover - Transformer','description':'Technologie, informatique, entrepreneuriat et formation.','primary_color':'#0B0F19','accent_color':'#00D4FF'}
class BrandUpdate(BaseModel): slogan:str; description:str; primary_color:str; accent_color:str
@router.get('')
def get_brand(): return brand
@router.put('')
def update_brand(data:BrandUpdate): brand.update(data.model_dump()); return brand
