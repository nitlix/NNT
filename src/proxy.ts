import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "de"];
const defaultLocale = "en";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
    // Get the locale from the request headers or use a default
    const acceptLanguage =
        request.headers.get("accept-language") || defaultLocale;

    const languages = acceptLanguage.split(",").map((lang) => {
        const [locale] = lang.split(";");
        return locale.split("-")[0].toLowerCase();
    });

    const matchedLocale =
        languages.find((lang) => locales.includes(lang)) || defaultLocale;

    return matchedLocale || defaultLocale;
}

export default function (request: NextRequest) {
    // =================================
    // Create a response object
    // =================================
    let response = NextResponse.next({
        request: {
            // Apply old headers
            headers: request.headers,
        },
    });

    // =================================
    // Define interaction functions
    // =================================
    function setHeader(name: string, value: string) {
        response.headers.set(name, value);
        request.headers.set(name, value);
    }

    //==================================================
    // Allow server components to access the URL
    //==================================================
    setHeader("x-url", request.url);

    //====================
    // Language setting
    //====================
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return response;

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    // matcher solution for public, api, assets and _next exclusion
    matcher: ["/((?!_next|assets|favicon\\.ico|api/).*)"],
};
