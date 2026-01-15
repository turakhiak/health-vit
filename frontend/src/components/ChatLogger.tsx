"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { MealEntry, MealCategory } from '@/lib/types';
import { syncData } from '@/lib/sync';
import { useSession } from 'next-auth/react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function ChatLogger({ onComplete }: { onComplete: () => void }) {
    const { data: session } = useSession();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', role: 'assistant', content: "Hi! What did you eat?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: uuidv4(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare history for backend (excluding IDs)
            const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

            const response = await fetch(`${BACKEND_URL}/api/chat/food`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history })
            });

            if (!response.ok) throw new Error("Network error");

            const data = await response.json();

            const botMsg: Message = { id: uuidv4(), role: 'assistant', content: data.content };
            setMessages(prev => [...prev, botMsg]);

            if (data.logging_data) {
                // AUTO LOG
                await saveLog(data.logging_data);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: uuidv4(), role: 'assistant', content: "Sorry, I had trouble connecting. Try again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const saveLog = async (data: any) => {
        // Map backend components to our DB schema
        // We'll treat them as ad-hoc components for now
        const componentsToCheck = data.components || [];
        const entryComponents = [];

        for (const c of componentsToCheck) {
            // Create a component record
            const newComp = {
                id: uuidv4(),
                name: c.name,
                category: MealCategory.enum.Meal, // Generic for AI
                defaultMacros: c.macros,
                defaultPortion: c.portion,
                isUserDefined: true,
                tags: ["ai-generated"]
            };
            await db.components.add(newComp);

            entryComponents.push({
                componentId: newComp.id,
                portionMultiplier: 1, // AI macros are already total
                macroOverride: c.macros // Explicitly store the macros AI gave
            });
        }

        const entry: MealEntry = {
            id: uuidv4(),
            ts: new Date().toISOString(),
            components: entryComponents,
            computedTotals: data.totals,
            synced: false,
            notes: "Logged via AI Chat"
        };

        await db.meals.add(entry);

        // Trigger Sync
        if (session && (session as any).accessToken) {
            syncData((session as any).accessToken).catch(console.error);
        }

        // Delay slightly so user sees the message
        setTimeout(() => {
            onComplete();
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map(m => (
                    <div key={m.id} className={cn(
                        "flex w-full",
                        m.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                        <div className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                            m.role === 'user'
                                ? "bg-brand-600 text-white rounded-br-none"
                                : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                        )}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="bg-white text-gray-400 border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white border-t p-3 pb-6">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2 items-center"
                >
                    <input
                        className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="Type your meal (e.g. 2 eggs...)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-brand-600 text-white p-3 rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
