import json
import os
from typing import Optional, Dict, Any
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from io import BytesIO

# Scopes required for the application
SCOPES = ['https://www.googleapis.com/auth/drive.file']

class DriveService:
    def __init__(self):
        self.creds = None
        # In a real user-flow, credentials come from the session or token exchange.
        # For this MVP/Single-User setup, we might assume environment variables 
        # OR passed-in tokens from the frontend request.
        
    def get_service(self, token: str):
        """Builds the Drive Service using the provided access token."""
        creds = Credentials(token=token, scopes=SCOPES)
        return build('drive', 'v3', credentials=creds)

    def find_or_create_folder(self, service, folder_name: str) -> str:
        """Finds a folder by name or creates it. Returns ID."""
        query = f"mimeType='application/vnd.google-apps.folder' and name='{folder_name}' and trashed=false"
        results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
        files = results.get('files', [])
        
        if files:
            return files[0]['id']
        
        # Create
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        file = service.files().create(body=file_metadata, fields='id').execute()
        return file.get('id')

    def find_file_in_folder(self, service, folder_id: str, filename: str) -> Optional[str]:
        """Finds a specific JSON file in the folder."""
        query = f"name='{filename}' and '{folder_id}' in parents and trashed=false"
        results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
        files = results.get('files', [])
        return files[0]['id'] if files else None

    def read_json_file(self, service, file_id: str) -> Dict[str, Any]:
        """Downloads and parses the JSON content."""
        request = service.files().get_media(fileId=file_id)
        file_content = BytesIO()
        downloader = MediaIoBaseUpload(file_content, mimetype='application/json') 
        # Note: get_media uses MediaIoBaseDownload in full implementation but for text/json we can just execute() with alt=media
        # Simplifying:
        content = service.files().get_media(fileId=file_id).execute()
        return json.loads(content.decode('utf-8'))

    def update_file(self, service, file_id: str, content: Dict[str, Any]):
        """Updates the existing file with new JSON content."""
        media = MediaIoBaseUpload(BytesIO(json.dumps(content).encode('utf-8')), mimetype='application/json')
        service.files().update(fileId=file_id, media_body=media).execute()

    def create_file(self, service, folder_id: str, filename: str, content: Dict[str, Any]) -> str:
        """Creates a new JSON file."""
        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }
        media = MediaIoBaseUpload(BytesIO(json.dumps(content).encode('utf-8')), mimetype='application/json')
        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        return file.get('id')

drive_service = DriveService()
