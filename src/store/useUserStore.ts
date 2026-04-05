import { create } from 'zustand';

interface UserState {
    user: any | null;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: async () => set({ user: null }),
}));