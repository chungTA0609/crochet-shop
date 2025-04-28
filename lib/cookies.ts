// Cookie utility functions

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(
    name: string,
    value: string,
    options: {
        days?: number
        path?: string
        domain?: string
        secure?: boolean
        sameSite?: "strict" | "lax" | "none"
    } = {},
): void {
    const { days = 7, path = "/", domain, secure, sameSite = "lax" } = options

    // Calculate expiration date
    const expires = days ? new Date(Date.now() + days * 864e5) : undefined

    // Build cookie string
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (expires) {
        cookieString += `; expires=${expires.toUTCString()}`
    }

    cookieString += `; path=${path}`

    if (domain) {
        cookieString += `; domain=${domain}`
    }

    if (secure) {
        cookieString += "; secure"
    }

    cookieString += `; samesite=${sameSite}`

    // Set the cookie
    document.cookie = cookieString
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
    if (typeof document === "undefined") {
        return null
    }

    const cookies = document.cookie.split(";")

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()

        // Check if this cookie starts with the name we're looking for
        if (cookie.startsWith(`${encodeURIComponent(name)}=`)) {
            return decodeURIComponent(cookie.substring(name.length + 1))
        }
    }

    return null
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path = "/"): void {
    // Set expiration to past date to delete
    setCookie(name, "", { days: -1, path })
}

/**
 * Check if cookies are enabled in the browser
 */
export function areCookiesEnabled(): boolean {
    if (typeof document === "undefined") {
        return false
    }

    // Try to set a test cookie
    setCookie("_cookie_test", "1", { days: 1 })
    const enabled = getCookie("_cookie_test") === "1"

    // Clean up the test cookie
    deleteCookie("_cookie_test")

    return enabled
}
