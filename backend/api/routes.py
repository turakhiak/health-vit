from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from services.drive_service import drive_service
from services.coach_service import coach_service
from services.food_agent import food_agent_service, ChatMessage, FoodAgentResponse

router = APIRouter()

class SyncRequest(BaseModel):
    files: List[dict] 

@router.post("/sync")
async def sync_data(request: Request):
    try:
        data = await request.json()
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(status_code=401, detail="Missing Token")
            
        token = auth_header.split(" ")[1]
        
        # Save to Drive
        file_id = drive_service.upload_file(token, "me.json", data)
        return {"status": "success", "fileId": file_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CoachRequest(BaseModel):
    context: str

@router.post("/coach")
async def ask_coach(req: CoachRequest):
    response = coach_service.get_daily_advice(req.context)
    return {"message": response}

class ChatRequest(BaseModel):
    history: List[ChatMessage]

@router.post("/chat/food", response_model=FoodAgentResponse)
async def chat_food(request: ChatRequest):
    return food_agent_service.process_message(request.history)
