import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Usuario", type: "text" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                // Validación hardcodeada para demo
                if (credentials?.username === "docente" && credentials?.password === "docente123") {
                    return { id: "1", name: "Docente Principal", role: "docente" }
                }
                if (credentials?.username === "alumno" && credentials?.password === "alumno123") {
                    return { id: "2", name: "Alumno Ejemplar", role: "alumno" }
                }
                return null
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user }: any) => {
            if (user) {
                token.role = user.role
            }
            return token
        },
        session: async ({ session, token }: any) => {
            if (session?.user) {
                session.user.role = token.role
            }
            return session
        }
    },
    pages: {
        signIn: '/login', // Redirigiremos acá
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
