import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BatchJob } from "./types";

interface TranscriptState {
    recentJobs: BatchJob[];
    addJob: (job: BatchJob) => void;
    updateJob: (id: string, updates: Partial<BatchJob>) => void;

    // Settings
    rememberCredentials: boolean;
    setRememberCredentials: (val: boolean) => void;

    // Could hold Spotify metadata tokens here, etc.
    clearCredentials: () => void;
}

export const useStore = create<TranscriptState>()(
    persist(
        (set) => ({
            recentJobs: [],
            addJob: (job) => set((state) => ({ recentJobs: [...state.recentJobs, job] })),
            updateJob: (id, updates) =>
                set((state) => ({
                    recentJobs: state.recentJobs.map((job) =>
                        job.id === id ? { ...job, ...updates } : job
                    ),
                })),

            rememberCredentials: true,
            setRememberCredentials: (val) => set({ rememberCredentials: val }),

            clearCredentials: () => set({ rememberCredentials: false }), // Add credential clearing logic here
        }),
        {
            name: "transcript-storage",
            // Only keep settings in localStorage by default, jobs could be too large
            partialize: (state) => ({
                rememberCredentials: state.rememberCredentials,
                // Uncomment to persist jobs:
                // recentJobs: state.recentJobs 
            }),
        }
    )
);
