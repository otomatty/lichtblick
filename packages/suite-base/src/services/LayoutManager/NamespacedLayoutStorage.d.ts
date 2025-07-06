import { LayoutID } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { ILayoutStorage, Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
/**
 * A wrapper around ILayoutStorage for a particular namespace.
 */
export declare class NamespacedLayoutStorage {
    #private;
    private storage;
    private namespace;
    constructor(storage: ILayoutStorage, namespace: string, { migrateUnnamespacedLayouts, importFromNamespace, }: {
        migrateUnnamespacedLayouts: boolean;
        importFromNamespace: string | undefined;
    });
    list(): Promise<readonly Layout[]>;
    get(id: LayoutID): Promise<Layout | undefined>;
    put(layout: Layout): Promise<Layout>;
    delete(id: LayoutID): Promise<void>;
}
