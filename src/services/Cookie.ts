/* eslint-disable no-useless-escape */
export interface CookieOptions {
    expires?: Date | number | string,
    'max-age'?: number | string,
    path?: string,
    domain?: string,
    secure?: boolean,
}

export class CookieManager {
    static getCookie(name: string) {
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    static setCookie(name: string, value: string, options: CookieOptions = {}) {
        options = {
            path: '/',
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (const optionKey in options) {
            updatedCookie += "; " + optionKey;
            const optionValue = options[optionKey as keyof CookieOptions];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }

    static removeCookie(name: string) {
        this.setCookie(name, '', { 'max-age': 0 });
    }
}