import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const isLoggedIn = !!req.nextauth.token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

        if (isAuthPage && isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
                const isBook = req.nextUrl.pathname.startsWith("/book");

                if (isDashboard || isBook) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register", "/book"],
};
