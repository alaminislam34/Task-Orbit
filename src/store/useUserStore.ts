import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
    user: any | null;
    sessionToken: string | null;
    setUser: (user: any) => void;
    setSessionToken: (sessionToken: string | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            sessionToken: null,

            setSessionToken: (token) => set({ sessionToken: token }),

            setUser: (user) => set({ user }),

            logout: () => {
                set({ user: null, sessionToken: null });
            },
        }),
        {
            name: 'task-orbit-user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);