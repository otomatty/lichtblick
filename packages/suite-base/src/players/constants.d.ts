/**
 * Values of the contants below are a (more or less) informed guesses and not guaranteed to be accurate.
 */
export declare const COMPRESSED_POINTER_SIZE = 4;
export declare const OBJECT_BASE_SIZE: number;
export declare const ARRAY_BASE_SIZE: number;
export declare const TYPED_ARRAY_BASE_SIZE: number;
export declare const SMALL_INTEGER_SIZE = 4;
export declare const HEAP_NUMBER_SIZE: number;
export declare const FIELD_SIZE_BY_PRIMITIVE: Record<string, number>;
export declare const MAX_NUM_FAST_PROPERTIES = 1020;
export declare const PLAYER_CAPABILITIES: {
    advertise: string;
    assets: string;
    callServices: string;
    setSpeed: string;
    playbackControl: string;
    getParameters: string;
    setParameters: string;
};
