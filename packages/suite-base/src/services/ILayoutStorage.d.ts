import { LayoutID } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { LayoutData } from "@lichtblick/suite-base/context/CurrentLayoutContext/actions";
export type ISO8601Timestamp = string & {
    __brand: "ISO8601Timestamp";
};
export type LayoutPermission = "CREATOR_WRITE" | "ORG_READ" | "ORG_WRITE";
export type LayoutSyncStatus = "new" | "updated" | "tracked" | "locally-deleted" | "remotely-deleted";
export type LayoutBaseline = {
    data: LayoutData;
    savedAt: ISO8601Timestamp | undefined;
};
export type LayoutSyncInfo = {
    status: LayoutSyncStatus;
    lastRemoteSavedAt: ISO8601Timestamp | undefined;
};
export type Layout = {
    id: LayoutID;
    name: string;
    from?: string;
    permission: LayoutPermission;
    /** @deprecated old field name, migrated to working/baseline */
    data?: LayoutData;
    /** @deprecated old field name, migrated to working/baseline */
    state?: LayoutData;
    /** The last explicitly saved version of this layout. */
    baseline: LayoutBaseline;
    /**
     * The working copy of this layout, if it has been edited since the last explicit save.
     */
    working: LayoutBaseline | undefined;
    /** Info about this layout from remote storage. */
    syncInfo: LayoutSyncInfo | undefined;
};
export interface ILayoutStorage {
    list(namespace: string): Promise<readonly Layout[]>;
    get(namespace: string, id: LayoutID): Promise<Layout | undefined>;
    put(namespace: string, layout: Layout): Promise<Layout>;
    delete(namespace: string, id: LayoutID): Promise<void>;
    /**
     * If applicable, the layout manager will call this method to migrate any old existing local
     * layouts into the new namespace used for local layouts.
     */
    migrateUnnamespacedLayouts?(namespace: string): Promise<void>;
    /**
     * The layout manager will call this method to convert any local layouts to personal layouts when logging in.
     */
    importLayouts(params: {
        fromNamespace: string;
        toNamespace: string;
    }): Promise<void>;
}
export declare function layoutPermissionIsShared(permission: LayoutPermission): permission is Exclude<LayoutPermission, "CREATOR_WRITE">;
export declare function layoutIsShared(layout: Layout): layout is Layout & {
    permission: Exclude<LayoutPermission, "CREATOR_WRITE">;
};
export declare function layoutAppearsDeleted(layout: Layout): boolean;
