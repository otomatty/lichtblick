/*
 * Dot-product of two vectors.
 */
export function dot(vec1, vec2) {
    let ret = 0.0;
    for (let i = 0; i < vec1.length && i < vec2.length; ++i) {
        ret += vec1[i] * vec2[i];
    }
    return ret;
}
/*
 * Cross-product of two vectors.
 */
export function cross(vec1, vec2) {
    const [ax, ay, az] = vec1;
    const [bx, by, bz] = vec2;
    return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}
/*
 * Performs a rotation transformation on a point.
 */
export function rotate(rotation, point) {
    const v = [point.x, point.y, point.z];
    // Extract the vector part of the quaternion
    const u = [rotation.x, rotation.y, rotation.z];
    // Extract the scalar part of the quaternion
    const s = -1 * rotation.w;
    // Do the math
    const t1 = scalarMultiply(u, 2.0 * dot(u, v));
    const t2 = scalarMultiply(v, s * s - dot(u, u));
    const t3 = scalarMultiply(cross(u, v), 2 * s);
    const d = vectorAddition([t1, t2, t3]);
    return {
        x: d[0],
        y: d[1],
        z: d[2],
    };
}
/*
 * Scales a vector.
 */
export function scalarMultiply(vector, scalar) {
    const ret = vector.slice();
    let i;
    for (i = 0; i < ret.length; ++i) {
        ret[i] *= scalar;
    }
    return ret;
}
/*
 * Sums an array of vectors.
 * NOTE: all the vector arrays must be at least the length of the first vector
 */
export function vectorAddition(vectors) {
    const first = vectors[0];
    if (!first) {
        throw new Error("vectorAddition requires vectors");
    }
    const ret = first.slice();
    for (let i = 1; i < vectors.length; ++i) {
        for (let j = 0; j < ret.length; ++j) {
            ret[j] = (ret[j] ?? 0) + vectors[i][j];
        }
    }
    return ret;
}
