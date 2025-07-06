import { RosObject } from "@lichtblick/suite-base/players/types";
import type { Annotation, PathKey } from "./types";
declare function normalizeAnnotations(message: unknown, datatype: string): Annotation[];
/** Only used for getting details to display from original message */
declare function getAnnotationAtPath(message: unknown, path: PathKey[]): RosObject;
export { normalizeAnnotations, getAnnotationAtPath };
