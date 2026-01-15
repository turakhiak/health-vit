import { z } from "zod";

// --- Enums ---
export const MealCategory = z.enum(["ProteinBase", "VegBase", "Wrap", "Soup", "Dessert", "Beverage", "AddOn", "Meal"]);
export const CardioType = z.enum(["Walk", "Pickleball", "Golf", "Jogging", "BeepTest", "Cycling", "Swimming", "Other"]);
export const BeverageType = z.enum(["BlackCoffee", "DietCoke", "SaltedLimeSoda", "Water", "Other"]);

// --- Components (Ingredients/Parts of a meal) ---
export const ComponentSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    category: MealCategory,
    defaultMacros: z.object({
        protein: z.number().default(0),
        netCarbs: z.number().default(0),
        fat: z.number().default(0),
        calories: z.number().default(0),
    }),
    defaultPortion: z.string().optional(), // e.g. "1 scoop"
    tags: z.array(z.string()).optional(),
    // ... (previous code)
    isUserDefined: z.boolean().default(false),
});
export type Component = z.infer<typeof ComponentSchema>;
export type ComponentInput = z.input<typeof ComponentSchema>;

// --- Meal Entry ---
export const MealComponentUsageSchema = z.object({
    componentId: z.string(),
    portionMultiplier: z.number().default(1), // 1.0 = default portion
    macroOverride: z.object({
        protein: z.number(),
        netCarbs: z.number(),
        fat: z.number(),
        calories: z.number(),
    }).optional(), // If user manually adjusted the result
});

export const MealEntrySchema = z.object({
    id: z.string().uuid(),
    ts: z.string().datetime(), // ISO string
    components: z.array(MealComponentUsageSchema),
    computedTotals: z.object({
        protein: z.number(),
        netCarbs: z.number(),
        fat: z.number(),
        calories: z.number(),
    }),
    photoMeta: z.object({
        fileId: z.string().optional(),
        visionResult: z.any().optional(),
    }).optional(),
    notes: z.string().optional(),
    synced: z.boolean().default(false), // Local sync state
});
export type MealEntry = z.infer<typeof MealEntrySchema>;

// --- Exercise Entry ---
export const ExerciseSetSchema = z.object({
    name: z.string(),
    sets: z.number(),
    reps: z.number(),
    weightKg: z.number().optional(),
    notes: z.string().optional(),
});

export const ExerciseEntrySchema = z.object({
    id: z.string().uuid(),
    ts: z.string().datetime(),
    mode: z.enum(["Strength", "Cardio", "Mixed"]),
    // Detailed Strength
    routineId: z.string().optional(),
    exercises: z.array(ExerciseSetSchema).optional(),
    // Cardio
    cardioType: CardioType.optional(),
    minutes: z.number().optional(),
    distanceKm: z.number().optional(),
    beepTestLevel: z.string().optional(),
    steps: z.number().optional(), // From Fit or Manual
    notes: z.string().optional(),
    synced: z.boolean().default(false),
});
export type ExerciseEntry = z.infer<typeof ExerciseEntrySchema>;

// --- Metrics & Fasting ---
export const MetricEntrySchema = z.object({
    id: z.string().uuid(),
    ts: z.string().datetime(),
    weightKg: z.number().optional(),
    waistCm: z.number().optional(),
    sleepHours: z.number().optional(),
    stressLevel: z.number().min(1).max(10).optional(),
    synced: z.boolean().default(false),
});
export type MetricEntry = z.infer<typeof MetricEntrySchema>;

export const FastingEntrySchema = z.object({
    id: z.string().uuid(),
    ts: z.string().datetime(), // Log time
    startTime: z.string().datetime(),
    endTime: z.string().datetime().optional(), // Null if ongoing
    durationHours: z.number().optional(), // Computed on finish
    synced: z.boolean().default(false),
});
export type FastingEntry = z.infer<typeof FastingEntrySchema>;

export const BeverageEntrySchema = z.object({
    id: z.string().uuid(),
    ts: z.string().datetime(),
    type: BeverageType,
    volumeMl: z.number().optional(),
    synced: z.boolean().default(false),
});
export type BeverageEntry = z.infer<typeof BeverageEntrySchema>;

// --- User Profile & Settings ---
export const UserProfileSchema = z.object({
    name: z.string(),
    dob: z.string(), // YYYY-MM-DD
    heightCm: z.number(),
    startWeightKg: z.number(),
    targetWeightKg: z.number(),
    dietType: z.enum(["Vegetarian", "Eggetarian", "NonVeg", "Vegan"]),
    targets: z.object({
        proteinG: z.number(),
        netCarbsG: z.number(),
        sweetHitsMax: z.number(),
        fastingHours: z.number(),
    }),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;
