import { Point, Rotation } from "./types";
type vec3 = [number, number, number];
export declare function dot(vec1: number[], vec2: number[]): number;
export declare function cross(vec1: vec3, vec2: vec3): vec3;
export declare function rotate(rotation: Rotation, point: Point): Point;
export declare function scalarMultiply(vector: number[], scalar: number): number[];
export declare function vectorAddition(vectors: number[][]): number[];
export {};
