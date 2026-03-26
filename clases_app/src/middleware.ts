import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isDocenteRoute =
            req.nextUrl.pathname.startsWith("/clases/nueva") ||
            req.nextUrl.pathname.includes("/editar") ||
            (req.nextUrl.pathname.startsWith("/api/clases") && req.method !== "GET");

        // Protección de rutas exclusivas para docentes (crear, editar, borrar)
        if (isDocenteRoute && token?.role !== "docente") {
            // Redirigir al alumno al HOME si intenta acceder a rutas prohibidas
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: [
        "/((?!login|api/auth|_next/static|_next/image|favicon.ico|uploads).*)",
    ],
};
