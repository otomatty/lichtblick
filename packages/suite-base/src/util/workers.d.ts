export declare const inWebWorker: () => boolean;
export declare const inSharedWorker: () => boolean;
export declare const enforceFetchIsBlocked: <R, Args extends readonly unknown[]>(fn: (...args: Args) => R) => (...args: Args) => Promise<R>;
