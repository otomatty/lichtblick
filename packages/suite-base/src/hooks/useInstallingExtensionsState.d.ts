type UseInstallingExtensionsState = {
    installFoxeExtensions: (extensionsData: Uint8Array[]) => Promise<void>;
};
type UseInstallingExtensionsStateProps = {
    isPlaying: boolean;
    playerEvents: {
        play: (() => void) | undefined;
    };
};
export declare function useInstallingExtensionsState({ isPlaying, playerEvents: { play }, }: UseInstallingExtensionsStateProps): UseInstallingExtensionsState;
export {};
