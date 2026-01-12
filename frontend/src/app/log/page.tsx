"use client";
import { useState, useEffect } from "react";
import { MealLogger } from "@/components/MealLogger";
import { seedDatabase } from "@/lib/seed";

export default function LogPage() {
    const [mode, setMode] = useState<"food" | "exercise" | "metrics">("food");

    useEffect(() => {
        // Ensure DB is seeded on first load of logging
        seedDatabase().catch(console.error);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header Tabs */}
            <header className="bg-white border-b px-4 py-3 flex gap-4 overflow-x-auto">
                <button
                    onClick={() => setMode("food")}
                    className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${mode === 'food' ? 'border-brand-600 text-brand-900' : 'border-transparent text-gray-500'}`}
                >
                    Food
                </button>
                <button
                    onClick={() => setMode("exercise")}
                    className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${mode === 'exercise' ? 'border-brand-600 text-brand-900' : 'border-transparent text-gray-500'}`}
                >
                    Exercise
                </button>
                <button
                    onClick={() => setMode("metrics")}
                    className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${mode === 'metrics' ? 'border-brand-600 text-brand-900' : 'border-transparent text-gray-500'}`}
                >
                    Metrics
                </button>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-hidden">
                {mode === "food" && <MealLogger />}
                {mode === "exercise" && (
                    <div className="p-8 text-center text-gray-400">
                        <p>Exercise Logging Coming Soon...</p>
                    </div>
                )}
                {mode === "metrics" && (
                    <div className="p-8 text-center text-gray-400">
                        <p>Metrics Logging Coming Soon...</p>
                    </div>
                )}
            </main>
        </div>
    );
}
