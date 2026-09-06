from fastapi import APIRouter
from pydantic import BaseModel
router=APIRouter()
class GenerateRequest(BaseModel):
    topic:str
    platform:str='instagram'
    tone:str='professional'
@router.post('/generate')
def generate(data:GenerateRequest):
    return {'title':f'{data.topic} — DTech','content':f'Découvrez {data.topic} avec DTech. Former - Innover - Transformer.','hashtags':['#DTech','#Technologie','#Innovation','#Formation'],'provider':'adapter-not-configured'}
