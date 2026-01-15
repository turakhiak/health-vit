import os
import json
import uuid
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from openai import OpenAI

class ChatMessage(BaseModel):
    role: str
    content: str

class FoodAgentResponse(BaseModel):
    content: str
    logging_data: Optional[Dict[str, Any]] = None

class FoodAgentService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None

    def process_message(self, history: List[ChatMessage]) -> FoodAgentResponse:
        if not self.client:
            return FoodAgentResponse(content="Error: OpenAI API Key not configured on backend.")

        # System Prompt construction
        system_prompt = """
        You are 'KetoCoach', an expert nutritionist assistant for a detailed keto tracking app.
        
        GOAL: Help the user log their meal by extracting precise ingredients and portion sizes. 
        You must ask clarifying questions if the input is vague (e.g., "I had eggs" -> "How many? Fried or boiled?").
        
        MACRO ESTIMATION:
        - You MUST estimate protein (g), net carbs (g), fat (g), and calories (kcal) for every item.
        - Be conservative but realistic.
        
        OUTPUT FORMAT:
        1. If you need more info, just return plain text asking for it.
        2. If the user has confirmed the meal and you have enough info, verify it with them:
           "I'll log: 2 Fried Eggs (14g P, 1g C, 10g F) and 1 slice Keto Toast. Total: ~350 kcal. Is this correct?"
        3. If the user confirms (e.g. "yes", "looks good"), you MUST return a strict JSON object **at the end** of your response in a special block.
        
        The JSON block should be formatted as:
        ```json
        {
          "final_confirmation_text": "Great! Meal logged.",
          "logging_data": {
            "components": [
               { "name": "Fried Egg", "portion": "2 large", "macros": { "protein": 12, "netCarbs": 1, "fat": 14, "calories": 180 } },
               ...
            ],
            "totals": { "protein": ..., "netCarbs": ..., "fat": ..., "calories": ... }
           }
        }
        ```
        
        If you are outputting the JSON, do not output any other text after it.
        """

        # Convert Pydantic history to OpenAI format
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o", # Or gpt-3.5-turbo if cost is a concern, but 4o is better for JSON
                messages=messages,
                temperature=0.7
            )
            
            ai_text = response.choices[0].message.content
            
            # Post-process for JSON extraction
            logging_data = None
            clean_text = ai_text

            if "```json" in ai_text:
                try:
                    # Extract JSON block
                    start = ai_text.find("```json") + 7
                    end = ai_text.find("```", start)
                    json_str = ai_text[start:end].strip()
                    parsed = json.loads(json_str)
                    
                    if "logging_data" in parsed:
                        logging_data = parsed["logging_data"]
                        clean_text = parsed.get("final_confirmation_text", "Meal logged successfully.")
                except Exception as e:
                    print(f"JSON Parse Error: {e}")
                    # Fallback: keep text, no logging data
            
            return FoodAgentResponse(content=clean_text, logging_data=logging_data)

        except Exception as e:
            print(f"OpenAI Error: {e}")
            return FoodAgentResponse(content="Sorry, I'm having trouble connecting to my brain rights now. Please try again.")

food_agent_service = FoodAgentService()
