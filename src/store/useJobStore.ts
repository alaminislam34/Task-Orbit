import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { Job } from '@/types/jobs.types';

interface JobState {
    jobs: Job[];
    currentJob: Job | null;
    hasLoaded: boolean;
    lastSyncedAt: number | null;
    isLoading: boolean;
    error: string | null;
}

interface JobActions {
    setJobs: (jobs: Job[]) => void;
    setCurrentJob: (job: Job | null) => void;
    upsertJob: (job: Job) => void;
    removeJob: (jobId: string) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearJobData: () => void;
}

export const useJobStore = create<JobState & JobActions>()(
    persist(
        (set) => ({
            jobs: [],
            currentJob: null,
            hasLoaded: false,
            lastSyncedAt: null,
            isLoading: false,
            error: null,

            setJobs: (jobs) =>
                set({
                    jobs,
                    hasLoaded: true,
                    lastSyncedAt: Date.now(),
                    error: null,
                }),
            setCurrentJob: (currentJob) =>
                set({
                    currentJob,
                    hasLoaded: true,
                    lastSyncedAt: Date.now(),
                    error: null,
                }),
            upsertJob: (job) =>
                set((state) => ({
                    jobs: state.jobs.some((item) => item.id === job.id)
                        ? state.jobs.map((item) => (item.id === job.id ? job : item))
                        : [job, ...state.jobs],
                    currentJob: state.currentJob?.id === job.id ? job : state.currentJob,
                    lastSyncedAt: Date.now(),
                    error: null,
                })),
            removeJob: (jobId) =>
                set((state) => ({
                    jobs: state.jobs.filter((job) => job.id !== jobId),
                    currentJob: state.currentJob?.id === jobId ? null : state.currentJob,
                    lastSyncedAt: Date.now(),
                })),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearJobData: () =>
                set({
                    jobs: [],
                    currentJob: null,
                    hasLoaded: false,
                    lastSyncedAt: null,
                    isLoading: false,
                    error: null,
                }),
        }),
        {
            name: 'task-orbit-job-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                jobs: state.jobs,
                currentJob: state.currentJob,
                hasLoaded: state.hasLoaded,
                lastSyncedAt: state.lastSyncedAt,
            }),
        }
    )
);

// Selectors
export const useJobsList = () => useJobStore((state) => state.jobs);
export const useCurrentJob = () => useJobStore((state) => state.currentJob);
export const useJobStatus = () =>
    useJobStore(
        useShallow((state) => ({
            isLoading: state.isLoading,
            error: state.error,
            hasLoaded: state.hasLoaded,
            lastSyncedAt: state.lastSyncedAt,
        }))
    );
export const useJobActions = () =>
    useJobStore(
        useShallow((state) => ({
            setJobs: state.setJobs,
            setCurrentJob: state.setCurrentJob,
            upsertJob: state.upsertJob,
            removeJob: state.removeJob,
            setLoading: state.setLoading,
            setError: state.setError,
            clearJobData: state.clearJobData,
        }))
    );
