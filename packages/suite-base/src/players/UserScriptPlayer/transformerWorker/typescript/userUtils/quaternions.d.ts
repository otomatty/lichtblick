export type Quaternion = {
    x: number;
    y: number;
    z: number;
    w: number;
};
export type Euler = {
    roll: number;
    pitch: number;
    yaw: number;
};
/**
 * Converts a quaternion to a Euler roll, pitch, yaw representation, in degrees.
 *
 * @param quaternion Input quaternion.
 * @returns Converted Euler angle roll, pitch, yaw representation, in degrees.
 */
export declare function quaternionToEuler(quaternion: Quaternion): Euler;
