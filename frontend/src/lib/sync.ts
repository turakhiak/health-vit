import { db } from "./db";
import { MealEntry } from "./types";
import { useSession } from "next-auth/react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function syncData(accessToken: string) {
    if (!BACKEND_URL) {
        console.error("Backend URL not configured");
        return;
    }

    try {
        // 1. Get unsynced meals
        // Dexie boolean indices can be tricky, iterating is safer for small datasets or use explicit 0/1 if mapped
        const unsyncedMeals = await db.meals.filter(m => m.synced === false).toArray();

        if (unsyncedMeals.length === 0) {
            console.log("No data to sync");
            return;
        }

        // 2. Prepare payload
        const payload = {
            meals: unsyncedMeals
            // Add other types here later: exercises, metrics, etc.
        };

        // 3. Send to Backend
        const response = await fetch(`${BACKEND_URL}/api/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Sync failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Sync success:", result);

        // 4. Mark as synced locally
        // We use bulkPut to update the 'synced' field to true
        const updatedMeals = unsyncedMeals.map(m => ({ ...m, synced: true }));
        await db.meals.bulkPut(updatedMeals);

        return result;

    } catch (error) {
        console.error("Sync error:", error);
        throw error;
    }
}
