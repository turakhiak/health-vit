"use client";
import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Component, MealCategory, MealEntry } from '@/lib/types';
import { Plus, Minus, Calculator, Save, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { syncData } from '@/lib/sync';
import { useSession } from 'next-auth/react';

export function MealLogger() {
    const { data: session } = useSession();
    const [selectedCategory, setSelectedCategory] = useState<string>(MealCategory.enum.ProteinBase);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentMeal, setCurrentMeal] = useState<{ component: Component, multiplier: number }[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);

    // Fetch components for category
    const components = useLiveQuery(
        () => db.components
            .where('category').equals(selectedCategory)
            .toArray()
        , [selectedCategory]);

    const filteredComponents = components?.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToMeal = (component: Component) => {
        setCurrentMeal(prev => {
            const existing = prev.find(p => p.component.id === component.id);
            if (existing) {
                return prev.map(p => p.component.id === component.id ? { ...p, multiplier: p.multiplier + 0.5 } : p);
            }
            return [...prev, { component, multiplier: 1 }];
        });
    };

    const removeFromMeal = (id: string) => {
        setCurrentMeal(prev => prev.filter(p => p.component.id !== id));
    };

    const updateMultiplier = (id: string, delta: number) => {
        setCurrentMeal(prev => prev.map(p => {
            if (p.component.id !== id) return p;
            const newMult = Math.max(0.5, p.multiplier + delta);
            return { ...p, multiplier: newMult };
        }));
    };

    const computedTotals = currentMeal.reduce((acc, item) => {
        const { defaultMacros } = item.component;
        return {
            protein: acc.protein + (defaultMacros.protein * item.multiplier),
            netCarbs: acc.netCarbs + (defaultMacros.netCarbs * item.multiplier),
            fat: acc.fat + (defaultMacros.fat * item.multiplier),
            calories: acc.calories + (defaultMacros.calories * item.multiplier),
        };
    }, { protein: 0, netCarbs: 0, fat: 0, calories: 0 });

    const handleSave = async () => {
        const entry: MealEntry = {
            id: uuidv4(),
            ts: new Date().toISOString(),
            components: currentMeal.map(i => ({
                componentId: i.component.id,
                portionMultiplier: i.multiplier
            })),
            computedTotals,
            synced: false
        };

        await db.meals.add(entry);
        setCurrentMeal([]);
        setShowConfirm(false);
        alert("Meal Logged!");

        // Trigger Sync if online and logged in
        if (session && (session as any).accessToken) {
            try {
                await syncData((session as any).accessToken);
                console.log("Auto-sync triggered");
            } catch (err) {
                console.error("Auto-sync failed", err);
            }
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 p-2 border-b bg-white scrollbar-hide">
                {Object.values(MealCategory.enum).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                            selectedCategory === cat
                                ? "bg-brand-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        {cat.replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                ))}
            </div>

            {/* Component List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${selectedCategory}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border-gray-200 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {filteredComponents?.map(comp => (
                        <button
                            key={comp.id}
                            onClick={() => addToMeal(comp)}
                            className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-brand-300 text-left"
                        >
                            <div>
                                <p className="font-medium text-gray-900">{comp.name}</p>
                                <p className="text-xs text-gray-500">
                                    P{comp.defaultMacros.protein} C{comp.defaultMacros.netCarbs} F{comp.defaultMacros.fat} • {comp.defaultMacros.calories} kcal
                                </p>
                            </div>
                            <Plus className="h-5 w-5 text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Floating Summary / Cart */}
            {currentMeal.length > 0 && (
                <div className="bg-white border-t p-4 shadow-lg animate-in slide-in-from-bottom">
                    <div className="mb-4 max-h-32 overflow-y-auto space-y-2">
                        {currentMeal.map((item) => (
                            <div key={item.component.id} className="flex justify-between items-center text-sm">
                                <div className="flex-1 truncate pr-2">{item.component.name}</div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateMultiplier(item.component.id, -0.5)} className="p-1 hover:bg-gray-100 rounded">
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center font-mono">{item.multiplier}x</span>
                                    <button onClick={() => updateMultiplier(item.component.id, 0.5)} className="p-1 hover:bg-gray-100 rounded">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center border-t pt-3 mb-3">
                        <div>
                            <p className="text-xs text-gray-500">Total Macros</p>
                            <div className="font-bold text-gray-800">
                                P{Math.round(computedTotals.protein)} • C{Math.round(computedTotals.netCarbs)} • {Math.round(computedTotals.calories)} cal
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-brand-700"
                        >
                            <Save size={16} /> Log Meal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
