import { Metadata } from "@lichtblick/suite";
import { Initialization } from "@lichtblick/suite-base/players/IterablePlayer/IIterableSource";
export default class InitilizationSourceBuilder {
    static initialization(props?: Partial<Initialization>): Initialization;
    static metadata(props?: Partial<Metadata>): Metadata;
    static metadataList(count?: number): Metadata[];
}
