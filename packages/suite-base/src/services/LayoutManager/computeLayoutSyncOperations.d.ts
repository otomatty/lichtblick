import { Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
import { RemoteLayout } from "@lichtblick/suite-base/services/IRemoteLayoutStorage";
export type SyncOperation = {
    local: true;
    type: "add-to-cache";
    remoteLayout: RemoteLayout;
} | {
    local: true;
    type: "delete-local";
    localLayout: Layout;
} | {
    local: true;
    type: "mark-deleted";
    localLayout: Layout;
} | {
    local: false;
    type: "delete-remote";
    localLayout: Layout;
} | {
    local: false;
    type: "upload-new";
    localLayout: Layout;
} | {
    local: false;
    type: "upload-updated";
    localLayout: Layout;
} | {
    local: true;
    type: "update-baseline";
    localLayout: Layout & {
        syncInfo: NonNullable<Layout["syncInfo"]>;
    };
    remoteLayout: RemoteLayout;
};
export default function computeLayoutSyncOperations(localLayouts: readonly Layout[], remoteLayouts: readonly RemoteLayout[]): SyncOperation[];
