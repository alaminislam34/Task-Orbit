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
  },
  SELLER: {
    SERVICES: "/seller/services",
  },
  ORDER: {
    CREATE_ORDER_OFFER: "/orders/create-offer",
    GET_ORDERS: "/orders",
    ACCEPTED: (ORDER_ID: string) => `/orders/${ORDER_ID}/accept`,
    REJECTED: (ORDER_ID: string) => `/orders/${ORDER_ID}/reject`,
    UPDATE_ORDER_LIMITED: (ORDER_ID: string) => `/orders/${ORDER_ID}`,
    SEND_PHASE_OFFER: (ORDER_ID: string) => `/orders/${ORDER_ID}/phases/start`, // SELLER SEND PHASE OFFER TO CLIENT
    COMPLETE_PHASE: (ORDER_ID: string) => `/orders/${ORDER_ID}/phases/complete`, // SELLER MARK PHASE AS COMPLETE
    CANCEL_ORDER: (ORDER_ID: string) => `/orders/${ORDER_ID}/cancel`, // CLIENT CANCEL ORDER
    ORDER_DELIVERABLE: (ORDER_ID: string) => `/orders/${ORDER_ID}/deliverables`, 
    DELIVERABLE_FEEDBACK: (ORDER_ID: string, DELIVERABLE_ID: string) =>
      `/orders/${ORDER_ID}/deliverables/${DELIVERABLE_ID}/review`,
    SOFT_DELETE_ORDER: (ORDER_ID: string) => `/orders/${ORDER_ID}/admin/delete`,
    UPDATE_ORDER_STATUS: (ORDER_ID: string) => `/orders/${ORDER_ID}/admin/status`,
  },
  REVIEW: {},
};

export default ENDPOINT;
