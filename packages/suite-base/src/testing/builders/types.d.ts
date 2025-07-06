export type NumberBuilder = {
    min: number;
    max: number;
};
export type StringBuilder = {
    capitalization?: Capitalization;
    charset: "alphanumeric" | "alphabetic" | "numeric";
    count?: number;
    length: number;
};
export type MapBuilder = StringBuilder & {
    count?: number;
};
export declare enum Capitalization {
    LOWERCASE = "lowercase",
    UPPERCASE = "uppercase"
}
export type SamplePropertyKey = string | symbol | number;
