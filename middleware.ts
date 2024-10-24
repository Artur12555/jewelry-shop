import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    const isAdminRoute = pathname.startsWith('/admin');
    const isLocalizedAdminRoute = /^\/(de|en|pl)\/admin/.test(pathname);

    // Apply internationalization middleware first
    const intlResponse = await intlMiddleware(req);

    // Block access to admin routes for non-admin users
    if (isAdminRoute || isLocalizedAdminRoute) {
        if (!token) {
            // If no token is present, redirect to login
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Check if the user is not an admin and redirect them if necessary
        if (token.role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url)); // Redirect non-admin users to home
        }
    }

    // Return the internationalization response or the next response
    return intlResponse || NextResponse.next();
}

// Configuration for the matcher
export const config = {
    matcher: [
        '/', 
        '/(de|en|pl)/:path*',  // Matches all paths with locales
        '/admin/:path*',        // Admin paths without locale
    ],
};
