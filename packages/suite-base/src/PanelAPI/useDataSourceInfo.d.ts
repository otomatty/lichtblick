import { Immutable, Time } from "@lichtblick/suite";
import { Topic } from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
export type DataSourceInfo = {
    topics: readonly Topic[];
    datatypes: RosDatatypes;
    capabilities: string[];
    startTime?: Time;
    playerId: string;
};
/**
 * Data source info" encapsulates **rarely-changing** metadata about the source from which
 * Lichtblick Suite is loading data.
 *
 * A data source might be a local file, a remote file, or a streaming source.
 */
export declare function useDataSourceInfo(): Immutable<DataSourceInfo>;
