import { signIn } from "@/auth"

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("google")
            }}
        >
            <button
                type="submit"
                className="w-full bg-brand-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-brand-500 transition-colors flex items-center justify-center gap-2"
            >
                <span>Sign in with Google</span>
            </button>
        </form>
    )
}
