import { NumberBuilder, StringBuilder, MapBuilder, SamplePropertyKey } from "@lichtblick/suite-base/testing/builders/types";
export default class BasicBuilder {
    static date(props?: Partial<{
        year: number;
        month: string;
        day: string;
        hours: string;
        minutes: string;
        seconds: string;
    }>): string;
    static boolean(): boolean;
    static number({ min, max }?: Partial<NumberBuilder>): number;
    static float(min?: number, max?: number): number;
    static bigInt(min?: bigint, max?: bigint): bigint;
    static string({ length, charset, capitalization, }?: Partial<StringBuilder>): string;
    static stringMap({ count, length, charset, capitalization, }?: Partial<MapBuilder>): Map<string, string>;
    static genericMap<T>(valueGenerator: () => T, { count, length, charset, capitalization }?: Partial<MapBuilder>): Map<string, T>;
    static genericDictionary<T>(valueGenerator: () => T, { count, length, charset, capitalization }?: Partial<MapBuilder>): Record<string, T>;
    static multiple<T>(factory: () => T, count?: number): T[];
    static numbers(count?: number): number[];
    static strings({ count, length, charset, capitalization, }?: Partial<{
        count: number;
    } & StringBuilder>): string[];
    static sample<T>(input: T[]): T;
    static sample<T extends SamplePropertyKey, K>(input: Record<T, K> | K[], count: number): K[];
    static sample<T extends SamplePropertyKey, K>(input: Record<T, K> | K[]): K;
}
