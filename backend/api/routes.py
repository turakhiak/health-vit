from fastapi import APIRouter, Header, HTTPException, Body
from typing import Optional
from ..services.drive_service import drive_service
from ..services.coach_service import coach_service
from ..models import SyncRequest

router = APIRouter()

@router.post("/sync")
async def sync_data(
    payload: SyncRequest, 
    x_google_token: Optional[str] = Header(None, alias="X-Google-Token")
):
    """
    Syncs local data with Google Drive.
    Requires a valid Google Access Token passed in the header.
    """
    if not x_google_token:
        # In dev mode without real auth, we might mock this or return error
        # For now, return error to enforce security
        raise HTTPException(status_code=401, detail="Missing Google Token")

    try:
        service = drive_service.get_service(token=x_google_token)
        folder_id = drive_service.find_or_create_folder(service, "KetoVital_Data")
        file_id = drive_service.find_file_in_folder(service, folder_id, "keto_vital_backup.json")
        
        # Simple Logic: Overwrite with latest sync for now (Merge logic can be complex)
        # In a real app: Read remote, merge lists, write back.
        # Here we just dump the payload as backup.
        data_to_store = payload.dict()
        
        if file_id:
            drive_service.update_file(service, file_id, data_to_store)
        else:
            file_id = drive_service.create_file(service, folder_id, "keto_vital_backup.json", data_to_store)
            
        return {"status": "synced", "file_id": file_id}
        
    except Exception as e:
        print(f"Sync Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/coach")
async def ask_coach(context: dict = Body(...)):
    """
    Get AI coaching advice.
    """
    return coach_service.generate_daily_advice(context)
