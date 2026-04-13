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
};

