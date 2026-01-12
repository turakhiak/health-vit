import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-900 mb-4">
                KetoVital
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-sm">
                Your intelligent companion for low-carb liver health and fitness tracking.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
                <div className="p-4 bg-white shadow rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-400 mb-2">Sync Status</p>
                    <p className="font-medium text-green-600">Offline Ready</p>
                </div>

                <button className="w-full bg-brand-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-brand-500 transition-colors">
                    Log Meal
                </button>

                <button className="w-full bg-white text-brand-600 border border-brand-200 font-semibold py-3 px-4 rounded-lg hover:bg-brand-50 transition-colors">
                    Ask Coach
                </button>
            </div>

            <p className="mt-12 text-xs text-gray-400">
                Waiting for Node.js installation to hydrate...
            </p>
        </main>
    );
}
