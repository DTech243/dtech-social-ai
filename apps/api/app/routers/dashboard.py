from fastapi import APIRouter
router=APIRouter()
@router.get('/summary')
def summary():
    return {'posts':{'total':0,'drafts':0,'scheduled':0,'published':0},'engagement':{'rate':0,'likes':0,'comments':0,'shares':0},'campaigns':0,'media':0,'meta_connected':False}
