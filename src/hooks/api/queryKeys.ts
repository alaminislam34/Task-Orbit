export const queryKeys = {
  auth: {
    user: ["auth", "user"] as const,
  },
  jobs: {
    all: ["jobs"] as const,
    lists: () => [...queryKeys.jobs.all, "list"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.jobs.lists(), { filters }] as const,
    details: () => [...queryKeys.jobs.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.jobs.details(), id] as const,
    searchSuggestions: (query: string) => [...queryKeys.jobs.all, "search-suggestions", query] as const,
    applications: () => [...queryKeys.jobs.all, "applications"] as const,
    applicationDetail: (applicationId: string) =>
      [...queryKeys.jobs.applications(), "detail", applicationId] as const,
    myApplications: (filters: Record<string, any>) =>
      [...queryKeys.jobs.applications(), "my", { filters }] as const,
    savedJobs: (filters: Record<string, any>) =>
      [...queryKeys.jobs.applications(), "saved", { filters }] as const,
    recentlyViewed: (filters: Record<string, any>) =>
      [...queryKeys.jobs.all, "recently-viewed", { filters }] as const,
    recommendations: (filters: Record<string, any>) =>
      [...queryKeys.jobs.all, "recommendations", { filters }] as const,
    seekerProfile: ["job-seeker", "profile"] as const,
    seekerSettings: ["job-seeker", "settings"] as const,
    applicants: (jobId: string, filters: Record<string, any>) =>
      [...queryKeys.jobs.applications(), "applicants", jobId, { filters }] as const,
  },
  services: {
    all: ["services"] as const,
    lists: () => [...queryKeys.services.all, "list"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.services.lists(), { filters }] as const,
    details: () => [...queryKeys.services.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.categories.lists(), { filters }] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },
  extensions: {
    all: ["extensions"] as const,
    lists: () => [...queryKeys.extensions.all, "list"] as const,
  },
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.orders.lists(), { filters }] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    messages: () => [...queryKeys.orders.all, "messages"] as const,
    messageList: (orderId: string, filters: Record<string, any>) =>
      [...queryKeys.orders.messages(), orderId, { filters }] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    lists: () => [...queryKeys.reviews.all, "list"] as const,
  },
  chat: {
    all: ["chat"] as const,
    users: () => [...queryKeys.chat.all, "users"] as const,
    conversations: () => [...queryKeys.chat.all, "conversations"] as const,
    conversationList: (filters: Record<string, unknown>) =>
      [...queryKeys.chat.conversations(), { filters }] as const,
    messages: () => [...queryKeys.chat.all, "messages"] as const,
    messageList: (conversationId: string, filters: Record<string, unknown>) =>
      [...queryKeys.chat.messages(), conversationId, { filters }] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    lists: () => [...queryKeys.notifications.all, "list"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.notifications.lists(), { filters }] as const,
    detail: (id: string) => [...queryKeys.notifications.all, "detail", id] as const,
    unreadCount: ["notifications", "unread-count"] as const,
    preferences: ["notifications", "preferences"] as const,
  },
  client: {
    all: ["client"] as const,
    dashboardSummary: () => [...queryKeys.client.all, "dashboard-summary"] as const,
    orders: () => [...queryKeys.client.all, "orders"] as const,
    orderList: (filters: Record<string, unknown>) =>
      [...queryKeys.client.orders(), "list", { filters }] as const,
    orderDetail: (orderId: string) =>
      [...queryKeys.client.orders(), "detail", orderId] as const,
    queries: () => [...queryKeys.client.all, "queries"] as const,
    queryList: (filters: Record<string, unknown>) =>
      [...queryKeys.client.queries(), "list", { filters }] as const,
    queryDetail: (queryId: string) => [...queryKeys.client.queries(), "detail", queryId] as const,
    settings: () => [...queryKeys.client.all, "settings"] as const,
  },
} as const;

