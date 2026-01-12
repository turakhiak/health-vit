# KetoVital

Mobile-first PWA for tracking keto/liver health goals with AI coaching.

## Project Structure

- `/frontend`: Next.js 14 App Router, TypeScript, Tailwind CSS.
- `/backend`: FastAPI (Python 3.9+), OpenAI integration, Google Drive Sync.

## Setup Instructions

### Prerequisites
1.  **Python 3.9+** (Installed)
2.  **Node.js 18+** (Required for frontend, currently missing)
3.  **Google Cloud Credentials** (For Drive/Fit sync)

### Backend Setup
1.  Navigate to `backend`:
    ```bash
    cd backend
    ```
2.  Create virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run server:
    ```bash
    uvicorn main:app --reload
    ```
    API will be at `http://localhost:8000`.

### Frontend Setup (Requires Node.js)
1.  Navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run dev server:
    ```bash
    npm run dev
    ```
    App will be at `http://localhost:3000`.

## Features
- **Offline First**: Logs meals/exercise even without internet.
- **Drive Sync**: Backs up JSON data to your personal Google Drive.
- **AI Coach**: Daily personalized feedback via OpenAI.

