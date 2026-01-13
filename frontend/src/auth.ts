import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            if (token.accessToken) {
                // Pass Google Access Token to client so we can use it for Drive API
                // @ts-ignore
                session.accessToken = token.accessToken
            }
            return session
        }
    }
})
