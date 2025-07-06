export type InstallingProgress = {
    installed: number;
    total: number;
    inProgress: boolean;
};
export type InstallingExtensionsState = {
    installingProgress: InstallingProgress;
    setInstallingProgress: (progress: (lastState: InstallingProgress) => InstallingProgress) => void;
    startInstallingProgress: (extensionsNumber: number) => void;
    resetInstallingProgress: () => void;
};
export declare const useInstallingExtensionsStore: import("zustand").UseBoundStore<import("zustand").StoreApi<InstallingExtensionsState>>;
