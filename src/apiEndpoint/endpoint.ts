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
    UPDATE_ME: "/user/me",
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
    GET_RECRUITER_JOBS: "/recruiter/jobs",
    GET_JOB: (JOB_ID: string) => `/jobs/${JOB_ID}`,
    SEARCH_SUGGESTIONS: "/jobs/search-suggestions",
    APPLY_JOB: (JOB_ID: string) => `/applications/${JOB_ID}/apply`,
    CREATE_JOB: "/recruiter/jobs",
    UPDATE_JOB: (JOB_ID: string) => `/recruiter/jobs/${JOB_ID}`,
    DELETE_JOB: (JOB_ID: string) => `/recruiter/jobs/${JOB_ID}`,
    SAVED_JOB: (JOB_ID: string) => `/applications/saved-jobs/${JOB_ID}/toggle`,
  },
  APPLICATION: {
    GET_APPLICATIONS: "/applications/my-applications",
    GET_APPLICATION_DETAIL: (APPLICATION_ID: string) => `/applications/${APPLICATION_ID}`,
    WITHDRAW_APPLICATION: (APPLICATION_ID: string) => `/applications/${APPLICATION_ID}/withdraw`,
    GET_SAVED_JOBS: "/applications/saved-jobs",
    TOGGLE_SAVED_JOB: (JOB_ID: string) => `/applications/saved-jobs/${JOB_ID}/toggle`,
    APPLY_TO_JOB: (JOB_ID: string) => `/applications/${JOB_ID}/apply`,
    DOWNLOAD_RESUME: (APPLICATION_ID: string) =>
      `/applications/${APPLICATION_ID}/resume`,
    GET_APPLICANTS: (JOB_ID: string) => `/applications/recruiter/jobs/${JOB_ID}/applicants`,
    UPDATE_APPLICATION_STATUS: (APPLICATION_ID: string) =>
      `/applications/recruiter/applications/${APPLICATION_ID}/status`,
    BULK_ACTION: "/applications/recruiter/applications/bulk-status",
  },
  JOB_SEEKER: {
    PROFILE: "/job-seeker/profile",
    SETTINGS: "/job-seeker/settings",
    RECENTLY_VIEWED: "/job-seeker/recently-viewed",
    RECENTLY_VIEWED_BY_ID: (JOB_ID: string) => `/job-seeker/recently-viewed/${JOB_ID}`,
    RECOMMENDATIONS: "/job-seeker/recommendations",
  },
  CLIENT: {
    DASHBOARD_SUMMARY: "/client/dashboard/summary",
    ORDERS: "/client/orders",
    ORDER_DETAIL: (ORDER_ID: string) => `/client/orders/${ORDER_ID}`,
    QUERIES: "/client/queries",
    QUERY_DETAIL: (QUERY_ID: string) => `/client/queries/${QUERY_ID}`,
    QUERY_REPLIES: (QUERY_ID: string) => `/client/queries/${QUERY_ID}/replies`,
    QUERY_CLOSE: (QUERY_ID: string) => `/client/queries/${QUERY_ID}/close`,
    QUERY_REOPEN: (QUERY_ID: string) => `/client/queries/${QUERY_ID}/reopen`,
    SETTINGS: "/client/settings",
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
    GET_OFFER_DETAIL: (OFFER_ID: string) => `/orders/${OFFER_ID}`,
    UPDATE_OFFER_LIMITED: (OFFER_ID: string) => `/orders/${OFFER_ID}`,
    PHASE_START_OFFER: (OFFER_ID: string) => `/orders/${OFFER_ID}/phases/start`,
    PHASE_COMPLETE: (OFFER_ID: string) => `/orders/${OFFER_ID}/phases/complete`,
    DELIVERABLES_OFFER: (OFFER_ID: string) => `/orders/${OFFER_ID}/deliverables`,
    DELIVERABLE_FEEDBACK: (OFFER_ID: string, DELIVERABLE_ID: string) =>
      `/orders/${OFFER_ID}/deliverables/${DELIVERABLE_ID}/review`,
    SEND_MESSAGE: "/orders/communications",
    MARK_MESSAGE_READ: (MESSAGE_ID: string) =>
      `/orders/communications/${MESSAGE_ID}/read`,
    GET_MESSAGES: (ORDER_ID: string) => `/orders/${ORDER_ID}/communications`,
  },

  NOTIFICATION: {
    GET_NOTIFICATIONS: "/notifications",
    GET_NOTIFICATION: (NOTIFICATION_ID: string) => `/notifications/${NOTIFICATION_ID}`,
    MARK_AS_READ: (NOTIFICATION_ID: string) => `/notifications/${NOTIFICATION_ID}/read`,
    MARK_ALL_AS_READ: "/notifications/read-all",
    BULK_MARK_READ: "/notifications/bulk-read",
    DELETE_NOTIFICATION: (NOTIFICATION_ID: string) => `/notifications/${NOTIFICATION_ID}`,
    GET_UNREAD_COUNT: "/notifications/unread-count",
    GET_PREFERENCES: "/notifications/preferences",
    UPDATE_PREFERENCES: "/notifications/preferences",
  },
};

export default ENDPOINT;
