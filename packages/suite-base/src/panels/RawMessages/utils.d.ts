import { MessagePathDataItem } from "@lichtblick/suite-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems";
import { diffLabels, DiffObject } from "@lichtblick/suite-base/panels/RawMessages/getDiff";
import type { NodeExpansion } from "./types";
export declare const DATA_ARRAY_PREVIEW_LIMIT = 20;
export declare function toggleExpansion(state: NodeExpansion, paths: Set<string>, key: string): NodeExpansion;
/**
 * Recursively traverses all keypaths in obj, for use in JSON tree expansion.
 */
export declare function generateDeepKeyPaths(obj: unknown): Set<string>;
export declare function getChangeCounts(data: DiffObject, startingCounts: {
    -readonly [K in (typeof diffLabels)["ADDED" | "CHANGED" | "DELETED"]["labelText"]]: number;
}): {
    [key: string]: number;
};
export declare function getMessageDocumentationLink(datatype: string): string | undefined;
export declare function getConstantNameByKeyPath(keyPath: (string | number)[], queriedData: MessagePathDataItem[]): string | undefined;
