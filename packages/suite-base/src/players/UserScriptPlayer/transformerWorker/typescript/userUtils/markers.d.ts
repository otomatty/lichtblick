import { Header, Point, Pose, RGBA, Time } from "./types";
export interface IMarker {
    header: Header;
    ns: string;
    id: number;
    type: number;
    action: number;
    pose: Pose;
    scale: Point;
    color: RGBA;
    lifetime: Time;
    frame_locked: boolean;
    points: Point[];
    colors: RGBA[];
    text: string;
    mesh_resource: string;
    mesh_use_embedded_materials: boolean;
}
export type IRosMarker = IMarker;
export interface ImageMarker {
    header: Header;
    ns: string;
    id: number;
    type: number;
    action: number;
    position: Point;
    scale: number;
    outline_color: RGBA;
    filled: boolean;
    fill_color: RGBA;
    lifetime: Time;
    points: Point[];
    outline_colors: RGBA[];
}
/**
 * buildRosMarker builds a complete Marker message from an optional set of args.
 *
 * See https://foxglove.dev/docs/panels/3d for a list of supported Marker types
 *
 * @param args override any defaults in the marker fields
 * @returns an IRosMarker instance with default values for any omitted args
 */
export declare function buildRosMarker(args?: Partial<IRosMarker>): IRosMarker;
/**
 * buildImageMarker builds a complete Marker message from an optional set of args.
 *
 * See https://foxglove.dev/docs/studio/panels/image for a list of supported Marker types
 *
 * @param args override any defaults in the marker fields
 * @returns an ImageMarker instance with default values for any omitted args
 */
export declare function buildImageMarker(args?: Partial<ImageMarker>): ImageMarker;
/**
 * Use this class to instantiate marker-like objects with defaulted values.
 *
 * @deprecated prefer `buildRosMarker({ ... })` instead
 */
export declare class Marker implements IMarker {
    header: Header;
    ns: string;
    id: number;
    type: number;
    action: number;
    pose: Pose;
    scale: Point;
    color: RGBA;
    lifetime: Time;
    frame_locked: boolean;
    points: Point[];
    colors: RGBA[];
    text: string;
    mesh_resource: string;
    mesh_use_embedded_materials: boolean;
    constructor({ header, ns, id, type, action, pose, scale, color, lifetime, frame_locked, points, colors, text, mesh_resource, mesh_use_embedded_materials, }: Partial<IMarker>);
}
/**
 * Corresponds to the 'type' field of a marker.
 */
export declare enum MarkerTypes {
    ARROW = 0,
    CUBE = 1,
    SPHERE = 2,
    CYLINDER = 3,
    LINE_STRIP = 4,
    LINE_LIST = 5,
    CUBE_LIST = 6,
    SPHERE_LIST = 7,
    POINTS = 8,
    TEXT = 9,
    MESH = 10,
    TRIANGLE_LIST = 11
}
