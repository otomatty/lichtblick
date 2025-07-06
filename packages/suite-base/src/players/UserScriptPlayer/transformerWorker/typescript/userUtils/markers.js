/**
 * buildRosMarker builds a complete Marker message from an optional set of args.
 *
 * See https://foxglove.dev/docs/panels/3d for a list of supported Marker types
 *
 * @param args override any defaults in the marker fields
 * @returns an IRosMarker instance with default values for any omitted args
 */
export function buildRosMarker(args) {
    const { header, ns, id, type, action, pose, scale, color, lifetime, frame_locked, points, colors, text, mesh_resource, mesh_use_embedded_materials, } = args ?? {};
    return {
        header: header ?? {
            frame_id: "",
            stamp: {
                sec: 0,
                nsec: 0,
            },
            seq: 0,
        },
        ns: ns ?? "",
        id: id ?? 0,
        type: type ?? 0,
        action: action ?? 0,
        pose: pose ?? {
            position: {
                x: 0,
                y: 0,
                z: 0,
            },
            orientation: {
                x: 0,
                y: 0,
                z: 0,
                w: 0,
            },
        },
        scale: scale ?? { x: 0, y: 0, z: 0 },
        color: color ?? { r: 0, g: 0, b: 0, a: 0 },
        lifetime: lifetime ?? { sec: 0, nsec: 0 },
        frame_locked: frame_locked ?? false,
        points: points ?? [],
        colors: colors ?? [],
        text: text ?? "",
        mesh_resource: mesh_resource ?? "",
        mesh_use_embedded_materials: mesh_use_embedded_materials ?? false,
    };
}
/**
 * buildImageMarker builds a complete Marker message from an optional set of args.
 *
 * See https://foxglove.dev/docs/studio/panels/image for a list of supported Marker types
 *
 * @param args override any defaults in the marker fields
 * @returns an ImageMarker instance with default values for any omitted args
 */
export function buildImageMarker(args) {
    const { header, ns, id, type, action, lifetime, points, outline_color, outline_colors, filled, fill_color, position, scale, } = args ?? {};
    return {
        header: header ?? {
            frame_id: "",
            stamp: {
                sec: 0,
                nsec: 0,
            },
            seq: 0,
        },
        ns: ns ?? "",
        id: id ?? 0,
        type: type ?? 0,
        action: action ?? 0,
        position: position ?? {
            x: 0,
            y: 0,
            z: 0,
        },
        scale: scale ?? 1,
        outline_color: outline_color ?? { r: 0, g: 0, b: 0, a: 0 },
        lifetime: lifetime ?? { sec: 0, nsec: 0 },
        points: points ?? [],
        outline_colors: outline_colors ?? [],
        filled: filled ?? false,
        fill_color: fill_color ?? { r: 0, g: 0, b: 0, a: 0 },
    };
}
/**
 * Use this class to instantiate marker-like objects with defaulted values.
 *
 * @deprecated prefer `buildRosMarker({ ... })` instead
 */
export class Marker {
    header = {
        frame_id: "",
        stamp: {
            sec: 0,
            nsec: 0,
        },
        seq: 0,
    };
    ns = "";
    id = 0;
    type = 0;
    action = 0;
    pose = {
        position: {
            x: 0,
            y: 0,
            z: 0,
        },
        orientation: {
            x: 0,
            y: 0,
            z: 0,
            w: 0,
        },
    };
    scale = {
        x: 0,
        y: 0,
        z: 0,
    };
    color = { r: 0, g: 0, b: 0, a: 0 };
    lifetime = { sec: 0, nsec: 0 };
    frame_locked = false;
    points = [];
    colors = [];
    text = "";
    mesh_resource = "";
    mesh_use_embedded_materials = false;
    constructor({ header, ns, id, type, action, pose, scale, color, lifetime, frame_locked, points, colors, text, mesh_resource, mesh_use_embedded_materials, }) {
        this.header = header ?? {
            frame_id: "",
            stamp: {
                sec: 0,
                nsec: 0,
            },
            seq: 0,
        };
        this.ns = ns ?? "";
        this.id = id ?? 0;
        this.type = type ?? 0;
        this.action = action ?? 0;
        this.pose = pose ?? {
            position: {
                x: 0,
                y: 0,
                z: 0,
            },
            orientation: {
                x: 0,
                y: 0,
                z: 0,
                w: 0,
            },
        };
        this.scale = scale ?? { x: 0, y: 0, z: 0 };
        this.color = color ?? { r: 0, g: 0, b: 0, a: 0 };
        this.lifetime = lifetime ?? { sec: 0, nsec: 0 };
        this.frame_locked = frame_locked ?? false;
        this.points = points ?? [];
        this.colors = colors ?? [];
        this.text = text ?? "";
        this.mesh_resource = mesh_resource ?? "";
        this.mesh_use_embedded_materials = mesh_use_embedded_materials ?? false;
    }
}
/**
 * Corresponds to the 'type' field of a marker.
 */
export var MarkerTypes;
(function (MarkerTypes) {
    MarkerTypes[MarkerTypes["ARROW"] = 0] = "ARROW";
    MarkerTypes[MarkerTypes["CUBE"] = 1] = "CUBE";
    MarkerTypes[MarkerTypes["SPHERE"] = 2] = "SPHERE";
    MarkerTypes[MarkerTypes["CYLINDER"] = 3] = "CYLINDER";
    MarkerTypes[MarkerTypes["LINE_STRIP"] = 4] = "LINE_STRIP";
    MarkerTypes[MarkerTypes["LINE_LIST"] = 5] = "LINE_LIST";
    MarkerTypes[MarkerTypes["CUBE_LIST"] = 6] = "CUBE_LIST";
    MarkerTypes[MarkerTypes["SPHERE_LIST"] = 7] = "SPHERE_LIST";
    MarkerTypes[MarkerTypes["POINTS"] = 8] = "POINTS";
    MarkerTypes[MarkerTypes["TEXT"] = 9] = "TEXT";
    MarkerTypes[MarkerTypes["MESH"] = 10] = "MESH";
    MarkerTypes[MarkerTypes["TRIANGLE_LIST"] = 11] = "TRIANGLE_LIST";
})(MarkerTypes || (MarkerTypes = {}));
