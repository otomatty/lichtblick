import { Point, Header, RGBA } from "./types";
interface sensor_msgs__PointField {
    name: string;
    offset: number;
    datatype: number;
    count: number;
}
export interface sensor_msgs__PointCloud2 {
    header: Header;
    height: number;
    width: number;
    fields: sensor_msgs__PointField[];
    is_bigendian: boolean;
    point_step: number;
    row_step: number;
    data: Uint8Array;
    is_dense: boolean;
}
type Field = number | string;
/**
 * Read points from a sensor_msgs.PointCloud2 message. Returns a nested array
 * of values whose index corresponds to that of the 'fields' value.
 */
export declare const readPoints: (message: sensor_msgs__PointCloud2) => Array<Field[]>;
export declare function norm({ x, y, z }: Point): number;
export declare function setRayDistance(pt: Point, distance: number): Point;
export declare function convertToRangeView(points: Point[], range: number, makeColors: boolean): RGBA[];
export {};
