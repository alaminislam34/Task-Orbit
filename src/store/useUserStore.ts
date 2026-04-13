import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { UserProfileResponse } from '@/types/api.types';

export type UserType = Partial<UserProfileResponse["data"]> & { 
    id: string; 
    email: string; 
    name: string; 
    role: UserProfileResponse["data"]["role"]; 
    accountType: UserProfileResponse["data"]["accountType"];
};

export interface AuthTokens {
    sessionToken: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    tokenExpiresAt: string | null;
}

export interface AuthSessionPayload extends Partial<AuthTokens> {
    user?: UserType | null;
}

interface UserState {
    user: UserType | null;
    sessionToken: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    tokenExpiresAt: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface UserActions {
    setUser: (user: UserType | null) => void;
    setSessionToken: (token: string | null) => void;
    setAuthTokens: (tokens: Partial<AuthTokens>) => void;
    setAuthSession: (payload: AuthSessionPayload) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
    persist(
        (set) => ({
            user: null,
            sessionToken: null,
            accessToken: null,
            refreshToken: null,
            tokenExpiresAt: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) =>
                set((state) => ({
                    user,
                    isAuthenticated: Boolean(user || state.sessionToken),
                })),
            setSessionToken: (sessionToken) =>
                set((state) => ({
                    sessionToken,
                    isAuthenticated: Boolean(state.user || sessionToken),
                })),
            setAuthTokens: (tokens) =>
                set((state) => {
                    const nextSessionToken = tokens.sessionToken ?? state.sessionToken;

                    return {
                        sessionToken: nextSessionToken,
                        accessToken: tokens.accessToken ?? state.accessToken,
                        refreshToken: tokens.refreshToken ?? state.refreshToken,
                        tokenExpiresAt: tokens.tokenExpiresAt ?? state.tokenExpiresAt,
                        isAuthenticated: Boolean(state.user || nextSessionToken),
                    };
                }),
            setAuthSession: (payload) =>
                set((state) => {
                    const nextUser = payload.user ?? state.user;
                    const nextSessionToken = payload.sessionToken ?? state.sessionToken;

                    return {
                        user: nextUser,
                        sessionToken: nextSessionToken,
                        accessToken: payload.accessToken ?? state.accessToken,
                        refreshToken: payload.refreshToken ?? state.refreshToken,
                        tokenExpiresAt: payload.tokenExpiresAt ?? state.tokenExpiresAt,
                        isAuthenticated: Boolean(nextUser || nextSessionToken),
                        error: null,
                    };
                }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            logout: () =>
                set({
                    user: null,
                    sessionToken: null,
                    accessToken: null,
                    refreshToken: null,
                    tokenExpiresAt: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                }),
        }),
        {
            name: 'task-orbit-user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                sessionToken: state.sessionToken,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                tokenExpiresAt: state.tokenExpiresAt,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

// Selectors for optimized rendering
export const useUser = () => useUserStore((state) => state.user);
export const useSessionToken = () => useUserStore((state) => state.sessionToken);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useAuthStatus = () =>
    useUserStore(
        useShallow((state) => ({
            isLoading: state.isLoading,
            error: state.error,
            isAuthenticated: state.isAuthenticated,
        }))
    );
export const useAuthTokens = () =>
    useUserStore(
        useShallow((state) => ({
            sessionToken: state.sessionToken,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            tokenExpiresAt: state.tokenExpiresAt,
        }))
    );
export const useUserActions = () =>
    useUserStore(
        useShallow((state) => ({
            setUser: state.setUser,
            setSessionToken: state.setSessionToken,
            setAuthTokens: state.setAuthTokens,
            setAuthSession: state.setAuthSession,
            setLoading: state.setLoading,
            setError: state.setError,
            logout: state.logout,
        }))
    );
