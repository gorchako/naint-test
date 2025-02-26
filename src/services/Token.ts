import { CookieManager, CookieOptions } from "@/services/Cookie";

interface Token {
    accessToken?: string;
    refreshToken?: string;
}

export class TokenManager {
    static getToken(): Token {
        return {
            accessToken: CookieManager.getCookie('accessToken'),
            refreshToken: CookieManager.getCookie('refreshToken'),
        }
    }

    static saveToken(value: Token, expires_in?: number) {
        if (value.accessToken) {
            const options: CookieOptions = {}
            if (expires_in !== undefined) {
                options['max-age'] = expires_in
            }
            CookieManager.setCookie('accessToken', value.accessToken, options)
        }

        if (value.refreshToken) {
            CookieManager.setCookie('refreshToken', value.refreshToken)
        }
    }

    static removeToken() {
        CookieManager.removeCookie('accessToken')
        CookieManager.removeCookie('refreshToken')
    }
}