export default function SettingsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="space-y-4">
                <button className="w-full p-4 bg-white border rounded text-left">
                    Profile Configuration
                </button>
                <button className="w-full p-4 bg-white border rounded text-left">
                    Manage Component Library
                </button>
                <button className="w-full p-4 bg-white border rounded text-left text-red-500">
                    Reset Database
                </button>
            </div>
        </div>
    );
}
