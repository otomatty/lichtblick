import EventEmitter from "eventemitter3";
import { LayoutID } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { LayoutData } from "@lichtblick/suite-base/context/CurrentLayoutContext/actions";
import { ILayoutManager, LayoutManagerEventTypes } from "@lichtblick/suite-base/services/ILayoutManager";
import { ILayoutStorage, Layout, LayoutPermission } from "@lichtblick/suite-base/services/ILayoutStorage";
import { IRemoteLayoutStorage } from "@lichtblick/suite-base/services/IRemoteLayoutStorage";
export default class LayoutManager implements ILayoutManager {
    #private;
    static readonly LOCAL_STORAGE_NAMESPACE = "local";
    static readonly REMOTE_STORAGE_NAMESPACE_PREFIX = "remote-";
    readonly supportsSharing: boolean;
    get isBusy(): boolean;
    isOnline: boolean;
    error: undefined | Error;
    setOnline(online: boolean): void;
    setError(error: undefined | Error): void;
    constructor({ local, remote, }: {
        local: ILayoutStorage;
        remote: IRemoteLayoutStorage | undefined;
    });
    on<E extends EventEmitter.EventNames<LayoutManagerEventTypes>>(name: E, listener: EventEmitter.EventListener<LayoutManagerEventTypes, E>): void;
    off<E extends EventEmitter.EventNames<LayoutManagerEventTypes>>(name: E, listener: EventEmitter.EventListener<LayoutManagerEventTypes, E>): void;
    getLayouts(): Promise<readonly Layout[]>;
    getLayout(id: LayoutID): Promise<Layout | undefined>;
    saveNewLayout({ name, data: unmigratedData, permission, from, }: {
        name: string;
        data: LayoutData;
        permission: LayoutPermission;
        from?: string;
    }): Promise<Layout>;
    updateLayout({ id, name, data, }: {
        id: LayoutID;
        name: string | undefined;
        data: LayoutData | undefined;
    }): Promise<Layout>;
    deleteLayout({ id }: {
        id: LayoutID;
    }): Promise<void>;
    overwriteLayout({ id }: {
        id: LayoutID;
    }): Promise<Layout>;
    revertLayout({ id }: {
        id: LayoutID;
    }): Promise<Layout>;
    makePersonalCopy({ id, name }: {
        id: LayoutID;
        name: string;
    }): Promise<Layout>;
    /**
     * Attempt to synchronize the local cache with remote storage. At minimum this incurs a fetch of
     * the cached and remote layout lists; it may also involve modifications to the cache, remote
     * storage, or both.
     */
    syncWithRemote(abortSignal: AbortSignal): Promise<void>;
}
