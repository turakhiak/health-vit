import os
import json
from openai import OpenAI
from ..models import CoachContext

class CoachService:
    def __init__(self):
        # Lazily init or allow None for dev
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None

    def generate_daily_advice(self, context: dict) -> dict:
        """
        Generates daily coaching advice based on the user's logs and profile.
        """
        if not self.client:
             return {
                 "todayStatus": "Coach Mode: Offline (No API Key)",
                 "adjustments": [{"title":"Setup Required","why":"API Key missing","do":"Add OPENAI_API_KEY to .env"}]
             }

        system_prompt = """
You are "Keto Liver Coach", a supportive, practical nutrition and training assistant. 
Constraints: Vegetarian+Eggs, IF 14-16h, Net Carbs <50g.
Goal: Waist reduction, muscle preservation.
Output: STRICT JSON only.
        """
        
        user_message = f"Here is my data for today: {json.dumps(context)}"

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo", # Cost effective
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                response_format={"type": "json_object"},
                temperature=0.7
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"Coach Error: {e}")
            return {"error": "Coach is sleeping. Try again later."}

coach_service = CoachService()
