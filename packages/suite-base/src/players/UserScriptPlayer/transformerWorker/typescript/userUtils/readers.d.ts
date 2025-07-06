export declare const DATATYPE: {
    uint8: number;
    uint16: number;
    int16: number;
    int32: number;
    float32: number;
};
export interface FieldReader {
    read(data: Uint8Array, index: number): number;
}
export declare class Float32Reader implements FieldReader {
    #private;
    constructor(offset: number);
    read(data: Uint8Array, index: number): number;
}
export declare class Int32Reader implements FieldReader {
    #private;
    constructor(offset: number);
    read(data: Uint8Array, index: number): number;
}
export declare class Uint16Reader implements FieldReader {
    #private;
    constructor(offset: number);
    read(data: Uint8Array, index: number): number;
}
export declare class Uint8Reader implements FieldReader {
    #private;
    constructor(offset: number);
    read(data: Uint8Array, index: number): number;
}
export declare class Int16Reader implements FieldReader {
    #private;
    constructor(offset: number);
    read(data: Uint8Array, index: number): number;
}
export declare function getReader(datatype: number, offset: number): FieldReader;
