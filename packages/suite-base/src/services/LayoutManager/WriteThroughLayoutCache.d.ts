import { LayoutID } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { ILayoutStorage, Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
/**
 * A view of ILayoutCache which only calls the underlying list() once per namespace, and implements
 * all operations on the cached data in memory as well as writing through to the underlying storage.
 *
 * For this to be useful, we must assume nothing else is accessing the same underlying storage.
 */
export default class WriteThroughLayoutCache implements ILayoutStorage {
    #private;
    private storage;
    constructor(storage: ILayoutStorage);
    importLayouts(params: {
        fromNamespace: string;
        toNamespace: string;
    }): Promise<void>;
    migrateUnnamespacedLayouts(namespace: string): Promise<void>;
    list(namespace: string): Promise<readonly Layout[]>;
    get(namespace: string, id: LayoutID): Promise<Layout | undefined>;
    put(namespace: string, layout: Layout): Promise<Layout>;
    delete(namespace: string, id: LayoutID): Promise<void>;
}
