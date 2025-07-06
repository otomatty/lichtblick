import { Time } from "@lichtblick/suite";
import { TimeDisplayMethod } from "@lichtblick/suite-base/types/panels";
export interface IAppTimeFormat {
    formatDate: (date: Time) => string;
    formatTime: (stamp: Time) => string;
    formatDuration: (duration: Time) => string;
    timeFormat: TimeDisplayMethod;
    setTimeFormat: (format: TimeDisplayMethod) => Promise<void>;
    timeZone: string | undefined;
}
export declare function useAppTimeFormat(): IAppTimeFormat;
