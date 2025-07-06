import { DataSourceArgs, IDataSourceFactory } from "@lichtblick/suite-base/context/PlayerSelectionContext";
type UseHandleFiles = {
    handleFiles: (files: File[]) => Promise<void>;
};
type UseHandleFilesProps = {
    availableSources: readonly IDataSourceFactory[];
    selectSource: (sourceId: string, args?: DataSourceArgs) => void;
    isPlaying: boolean;
    playerEvents: {
        play: (() => void) | undefined;
        pause: (() => void) | undefined;
    };
};
export declare function useHandleFiles({ availableSources, selectSource, isPlaying, playerEvents: { play, pause }, }: UseHandleFilesProps): UseHandleFiles;
export {};
