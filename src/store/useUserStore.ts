import { create } from 'zustand';

interface UserState {
    user: any | null;
    sessionToken: string | null;
    setUser: (user: any) => void;
    setSessionToken: (sessionToken: string) => void;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    sessionToken: null,
    setSessionToken: (sessionToken: string) => set({ sessionToken }),
    setUser: (user: any) => set({ user }),
    logout: async () => set({ user: null, sessionToken: null }),
}));