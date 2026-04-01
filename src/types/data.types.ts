export interface Career {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Freelance";
  level: "Entry" | "Mid" | "Expert";
  salary: string;
  category: string;
  tags: string[];
  description: string;
  postedAt: string;
}
// --- Types ---
export interface ClientUser {
  id: string;
  role: "CLIENT" | "SELLER" | "ADMIN";
  createdAt?: string;
  base: {
    name: string;
    username: string;
    email: string;
    avatar?: string;
    status: "ONLINE" | "OFFLINE";
    isVerified: boolean;
  };
  profile?: {
    company?: {
      name: string;
      website: string;
      size: string;
      industry: string;
    };
    bio?: string;
    totalSpent?: number;
    activeOrders?: number;
    completedOrders?: number;
    avgRating?: number;
    paymentVerified?: boolean;
    preferredCategories?: string[];
    budgetPreference?: "LOW" | "MID" | "HIGH" | "MID_TO_HIGH";
    country?: string;
    timezone?: string;
  };
  history?: {
    lastHired?: string;
    topSellersHired?: string[];
    reviewLeft?: number;
  };
  crmData: {
    lastActive: string;
    accountHealth: number;
    clientTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
    matchingSellers?: string[];
    isSpam?: boolean;
  };
}
