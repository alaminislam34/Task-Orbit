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
  },
  USER: {
    ME: "/user/me",
    LIST: "/admin/users",
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
    UPDATE_ORDER_STATUS: (ORDER_ID: string) =>
      `/orders/${ORDER_ID}/admin/status`,
  },
  REVIEW: {},
  JOBS: {
    GET_JOBS: "/jobs",
    GET_JOB: (JOB_ID: string) => `/jobs/${JOB_ID}`,
    APPLY_JOB: (JOB_ID: string) => `/applications/${JOB_ID}/apply`,
    CREATE_JOB: "/recruiter/jobs",
    UPDATE_JOB: (JOB_ID: string) => `/recruiter/jobs/${JOB_ID}`,
    DELETE_JOB: (JOB_ID: string) => `/recruiter/jobs/${JOB_ID}`,
    SAVED_JOB: (JOB_ID: string) => `/applications/saved-jobs/${JOB_ID}/toggle`,
  },
  APPLICATION: {
    GET_APPLICATIONS: "/applications/my-applications",
    GET_SAVED_JOBS: "/applications/saved-jobs",
    DOWNLOAD_RESUME: (APPLICATION_ID: string) =>
      `/applications/${APPLICATION_ID}/resume/`,
    GET_APPLICANTS: (JOB_ID: string) => `/recruiter/jobs/${JOB_ID}/applicants`,
    UPDATE_APPLICATION_STATUS: (APPLICATION_ID: string) =>
      `/recruiter/applications/${APPLICATION_ID}/status`,
    BULK_ACTION: "/recruiter/applications/bulk-status",
  },
  CHAT: {
    CONVERSATIONS: "/conversations",
    MESSAGES: "/messages",
    MESSAGES_BY_CONVERSATION: (CONVERSATION_ID: string) =>
      `/messages/${CONVERSATION_ID}`,
    MARK_SEEN: "/messages/seen",
  },
  EXTENSION: {
    CREATE_EXTENSION: "/extensions",
    GET_EXTENSIONS: "/services/extensions",
    UPDATE_EXTENSION: (EXTENSION_ID: string) => `/extensions/${EXTENSION_ID}`,
    DELETE_EXTENSION: (EXTENSION_ID: string) => `/extensions/${EXTENSION_ID}`,
  },

  SELLER_ORDER: {
    CREATE_OFFER: "/orders/create-offer",
    ACCEPT_OFFER: (OFFER_ID: string) => `/orders/${OFFER_ID}/accept`,
    REJECT_OFFER: (OFFER_ID: string) => `/orders/${OFFER_ID}/reject`,
    GET_OFFERS: "/orders/offers",
    UPDATE_OFFER_LIMITED: (OFFER_ID: string) => `/orders/${OFFER_ID}`,
    PHASE_START_OFFER: (OFFER_ID: string) => `/orders/${OFFER_ID}/phases/start`, // SELLER SEND PHASE OFFER TO CLIENT
    PHASE_COMPLETE: (OFFER_ID: string) => `/orders/${OFFER_ID}/phases/complete`, // SELLER MARK PHASE AS COMPLETE
    DELIVERABLES_OFFER: (OFFER_ID: string) => `/orders/${OFFER_ID}/deliverables`,
    DELIVERABLE_FEEDBACK: (OFFER_ID: string, DELIVERABLE_ID: string) =>
      `/orders/${OFFER_ID}/deliverables/${DELIVERABLE_ID}/review`,
    
  },
};

export default ENDPOINT;
