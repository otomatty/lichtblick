import { ILayoutStorage, Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
export default class MockLayoutStorage implements ILayoutStorage {
    #private;
    constructor(namespace: string, layouts?: Layout[]);
    list(namespace: string): Promise<readonly Layout[]>;
    get(namespace: string, id: string): Promise<Layout | undefined>;
    put(namespace: string, layout: Layout): Promise<Layout>;
    delete(namespace: string, id: string): Promise<void>;
    importLayouts(): Promise<void>;
}
