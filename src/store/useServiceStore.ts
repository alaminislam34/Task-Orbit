import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { Service } from '@/types/services.types';

interface ServiceState {
    services: Service[];
    sellerServices: Service[];
    currentService: Service | null;
    hasLoaded: boolean;
    lastSyncedAt: number | null;
    isLoading: boolean;
    error: string | null;
}

interface ServiceActions {
    setServices: (services: Service[]) => void;
    setSellerServices: (services: Service[]) => void;
    setCurrentService: (service: Service | null) => void;
    upsertService: (service: Service) => void;
    removeService: (serviceId: string) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearServiceData: () => void;
}

export const useServiceStore = create<ServiceState & ServiceActions>()(
    persist(
        (set) => ({
            services: [],
            sellerServices: [],
            currentService: null,
            hasLoaded: false,
            lastSyncedAt: null,
            isLoading: false,
            error: null,

            setServices: (services) =>
                set({
                    services,
                    hasLoaded: true,
                    lastSyncedAt: Date.now(),
                    error: null,
                }),
            setSellerServices: (sellerServices) =>
                set({
                    sellerServices,
                    hasLoaded: true,
                    lastSyncedAt: Date.now(),
                    error: null,
                }),
            setCurrentService: (currentService) =>
                set({
                    currentService,
                    hasLoaded: true,
                    lastSyncedAt: Date.now(),
                    error: null,
                }),
            upsertService: (service) =>
                set((state) => {
                    const nextServices = state.services.some((item) => item.id === service.id)
                        ? state.services.map((item) => (item.id === service.id ? service : item))
                        : [service, ...state.services];

                    const nextSellerServices = state.sellerServices.some((item) => item.id === service.id)
                        ? state.sellerServices.map((item) => (item.id === service.id ? service : item))
                        : state.sellerServices;

                    return {
                        services: nextServices,
                        sellerServices: nextSellerServices,
                        currentService:
                            state.currentService?.id === service.id ? service : state.currentService,
                        lastSyncedAt: Date.now(),
                        error: null,
                    };
                }),
            removeService: (serviceId) =>
                set((state) => ({
                    services: state.services.filter((service) => service.id !== serviceId),
                    sellerServices: state.sellerServices.filter((service) => service.id !== serviceId),
                    currentService:
                        state.currentService?.id === serviceId ? null : state.currentService,
                    lastSyncedAt: Date.now(),
                })),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearServiceData: () =>
                set({
                    services: [],
                    sellerServices: [],
                    currentService: null,
                    hasLoaded: false,
                    lastSyncedAt: null,
                    isLoading: false,
                    error: null,
                }),
        }),
        {
            name: 'task-orbit-service-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                services: state.services,
                sellerServices: state.sellerServices,
                currentService: state.currentService,
                hasLoaded: state.hasLoaded,
                lastSyncedAt: state.lastSyncedAt,
            }),
        }
    )
);

// Selectors
export const useServicesList = () => useServiceStore((state) => state.services);
export const useSellerServicesList = () => useServiceStore((state) => state.sellerServices);
export const useCurrentService = () => useServiceStore((state) => state.currentService);
export const useServiceStatus = () =>
    useServiceStore(
        useShallow((state) => ({
            isLoading: state.isLoading,
            error: state.error,
            hasLoaded: state.hasLoaded,
            lastSyncedAt: state.lastSyncedAt,
        }))
    );
export const useServiceActions = () =>
    useServiceStore(
        useShallow((state) => ({
            setServices: state.setServices,
            setSellerServices: state.setSellerServices,
            setCurrentService: state.setCurrentService,
            upsertService: state.upsertService,
            removeService: state.removeService,
            setLoading: state.setLoading,
            setError: state.setError,
            clearServiceData: state.clearServiceData,
        }))
    );
