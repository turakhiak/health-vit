from pydantic import BaseModel, Field
from typing import List, Optional, Any
from enum import Enum
from datetime import datetime
import uuid

# --- Enums ---
class MealCategory(str, Enum):
    ProteinBase = "ProteinBase"
    VegBase = "VegBase"
    Wrap = "Wrap"
    Soup = "Soup"
    Dessert = "Dessert"
    Beverage = "Beverage"
    AddOn = "AddOn"
    Meal = "Meal"

class CardioType(str, Enum):
    Walk = "Walk"
    Pickleball = "Pickleball"
    Golf = "Golf"
    Jogging = "Jogging"
    BeepTest = "BeepTest"
    Cycling = "Cycling"
    Swimming = "Swimming"
    Other = "Other"

class BeverageType(str, Enum):
    BlackCoffee = "BlackCoffee"
    DietCoke = "DietCoke"
    SaltedLimeSoda = "SaltedLimeSoda"
    Water = "Water"
    Other = "Other"

# --- Models ---

class Macros(BaseModel):
    protein: float = 0
    netCarbs: float = 0
    fat: float = 0
    calories: float = 0

class Component(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: MealCategory
    defaultMacros: Macros
    defaultPortion: Optional[str] = None
    tags: List[str] = []
    isUserDefined: bool = False

class MealComponentUsage(BaseModel):
    componentId: str
    portionMultiplier: float = 1.0
    macroOverride: Optional[Macros] = None

class PhotoMeta(BaseModel):
    fileId: Optional[str] = None
    visionResult: Optional[Any] = None

class MealEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ts: datetime
    components: List[MealComponentUsage]
    computedTotals: Macros
    photoMeta: Optional[PhotoMeta] = None
    notes: Optional[str] = None

class ExerciseSet(BaseModel):
    name: str
    sets: int
    reps: int
    weightKg: Optional[float] = None
    notes: Optional[str] = None

class ExerciseEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ts: datetime
    mode: str = "Strength" # Strength, Cardio, Mixed
    routineId: Optional[str] = None
    exercises: Optional[List[ExerciseSet]] = None
    cardioType: Optional[CardioType] = None
    minutes: Optional[int] = None
    distanceKm: Optional[float] = None
    beepTestLevel: Optional[str] = None
    steps: Optional[int] = None
    notes: Optional[str] = None

class MetricEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ts: datetime
    weightKg: Optional[float] = None
    waistCm: Optional[float] = None
    sleepHours: Optional[float] = None
    stressLevel: Optional[int] = None

class FastingEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ts: datetime
    startTime: datetime
    endTime: Optional[datetime] = None
    durationHours: Optional[float] = None

class BeverageEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ts: datetime
    type: BeverageType
    volumeMl: Optional[float] = None

# --- Sync Payloads ---
class SyncRequest(BaseModel):
    """Payload sent from Frontend to Backend for Drive Sync"""
    meals: List[MealEntry] = []
    exercises: List[ExerciseEntry] = []
    metrics: List[MetricEntry] = []
    fasting: List[FastingEntry] = []
    beverages: List[BeverageEntry] = []
    lastSyncTimestamp: Optional[datetime] = None

class CoachContext(BaseModel):
    """Payload sent to /coach/daily"""
    user_profile: Any # Define stricter if needed
    today_summary: Any
    recent_history: Any
