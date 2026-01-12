import { db } from './db';
import { Component, MealCategory } from './types';
import { v4 as uuidv4 } from 'uuid';

export const COMPONENT_SEEDS: Component[] = [
    // Protein Base
    { id: uuidv4(), name: "SuperYou Protein Shake", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 25, netCarbs: 2, fat: 2, calories: 120 }, tags: ["anchor"] },
    { id: uuidv4(), name: "Whey Isolate Shake", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 25, netCarbs: 2, fat: 1, calories: 110 } },
    { id: uuidv4(), name: "Soy/Pea Isolate Shake", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 25, netCarbs: 2, fat: 2, calories: 120 } },
    { id: uuidv4(), name: "Hung Curd Bowl (250g)", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 20, netCarbs: 10, fat: 6, calories: 200 }, tags: ["probiotic"] },
    { id: uuidv4(), name: "Protein Yogurt Bowl", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 35, netCarbs: 11, fat: 7, calories: 310 }, tags: ["sweet"] },
    { id: uuidv4(), name: "Savory Yogurt Bowl", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 22, netCarbs: 10, fat: 6, calories: 220 }, tags: ["savory"] },
    { id: uuidv4(), name: "Omelette (3 eggs)", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 18, netCarbs: 2, fat: 15, calories: 220 } },
    { id: uuidv4(), name: "Turkish Eggs (3 eggs)", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 25, netCarbs: 6, fat: 18, calories: 320 } },
    { id: uuidv4(), name: "Paneer (150g)", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 28, netCarbs: 4, fat: 22, calories: 330 } },
    { id: uuidv4(), name: "Tofu (200g)", category: MealCategory.enum.ProteinBase, defaultMacros: { protein: 24, netCarbs: 6, fat: 14, calories: 260 } },
    // Meals
    { id: uuidv4(), name: "Paneer Sabzi Plate", category: MealCategory.enum.Meal, defaultMacros: { protein: 30, netCarbs: 12, fat: 18, calories: 380 } },
    { id: uuidv4(), name: "Tofu Stir-fry", category: MealCategory.enum.Meal, defaultMacros: { protein: 28, netCarbs: 14, fat: 16, calories: 360 } },
    { id: uuidv4(), name: "Soup + Protein Add-in", category: MealCategory.enum.Meal, defaultMacros: { protein: 25, netCarbs: 14, fat: 15, calories: 320 } },
    { id: uuidv4(), name: "Wrap: Egg Bhurji", category: MealCategory.enum.Meal, defaultMacros: { protein: 20, netCarbs: 6, fat: 14, calories: 260 } },
    { id: uuidv4(), name: "Wrap: Paneer", category: MealCategory.enum.Meal, defaultMacros: { protein: 22, netCarbs: 7, fat: 16, calories: 290 } },
    { id: uuidv4(), name: "Controlled Comfort: Papad/Curd", category: MealCategory.enum.Meal, defaultMacros: { protein: 10, netCarbs: 12, fat: 12, calories: 220 }, tags: ["limit"] },
    // Wraps/Soups
    { id: uuidv4(), name: "Low-carb Tortilla Wrap", category: MealCategory.enum.Wrap, defaultMacros: { protein: 5, netCarbs: 5, fat: 4, calories: 80 } },
    { id: uuidv4(), name: "Soup Base (Veg)", category: MealCategory.enum.Soup, defaultMacros: { protein: 5, netCarbs: 10, fat: 5, calories: 100 } },
    // Desserts
    { id: uuidv4(), name: "Get-A-Whey Ice Cream", category: MealCategory.enum.Dessert, defaultMacros: { protein: 15, netCarbs: 10, fat: 8, calories: 180 }, tags: ["sweetHit"] },
    { id: uuidv4(), name: "Yogurt Shrikhand", category: MealCategory.enum.Dessert, defaultMacros: { protein: 20, netCarbs: 12, fat: 8, calories: 210 }, tags: ["sweetHit"] },
    // Beverages
    { id: uuidv4(), name: "Black Coffee", category: MealCategory.enum.Beverage, defaultMacros: { protein: 0, netCarbs: 0, fat: 0, calories: 0 } },
    { id: uuidv4(), name: "Diet Coke", category: MealCategory.enum.Beverage, defaultMacros: { protein: 0, netCarbs: 0, fat: 0, calories: 0 }, tags: ["caffeine"] },
    { id: uuidv4(), name: "Salted Lime Soda", category: MealCategory.enum.Beverage, defaultMacros: { protein: 0, netCarbs: 1, fat: 0, calories: 5 }, tags: ["electrolytes"] },
    // AddOns
    { id: uuidv4(), name: "Nuts (20g)", category: MealCategory.enum.AddOn, defaultMacros: { protein: 4, netCarbs: 3, fat: 10, calories: 120 }, tags: ["limit"] }
];

export async function seedDatabase() {
    const count = await db.components.count();
    if (count === 0) {
        await db.components.bulkAdd(COMPONENT_SEEDS);
        console.log("Database seeded with default components");
    }
}
