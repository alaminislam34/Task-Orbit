const ENDPOINT = {
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REFRESH_TOKEN: "/auth/refresh-token",
        CHANGE_PASSWORD: "/auth/change-password",
        LOGOUT_ALL_DEVICES: "/auth/logout-all-devices",
        VERIFY_EMAIL: "/auth/verify-email",
        RESEND_OTP: "/auth/resend-otp",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
        GOOGLE_LOGIN: "/auth/login/google",
        GOOGLE_LOGIN_SUCCESS: "/auth/google/success",
        OAUTH_AUTH: "/auth/oauth/auth",
    },
    USER: {
        ME: "/user/me",
    }
}

export default ENDPOINT