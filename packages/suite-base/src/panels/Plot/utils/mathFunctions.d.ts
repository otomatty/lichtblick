export type MathFunction = (arg: number) => number;
interface PlotMathFunctions {
    [key: string]: (value: number) => number;
    negative: (value: number) => number;
    deg2rad: (value: number) => number;
    rad2deg: (value: number) => number;
}
export declare const mathFunctions: PlotMathFunctions;
export {};
