import { Immutable } from "@lichtblick/suite";
import { PlayerState } from "@lichtblick/suite-base/players/types";
import { CsvDataset, GetViewportDatasetsResult, HandlePlayerStateResult, IDatasetsBuilder, SeriesItem } from "./IDatasetsBuilder";
export declare class IndexDatasetsBuilder implements IDatasetsBuilder {
    #private;
    handlePlayerState(state: Immutable<PlayerState>): HandlePlayerStateResult | undefined;
    setSeries(series: Immutable<SeriesItem[]>): void;
    getViewportDatasets(): Promise<GetViewportDatasetsResult>;
    getCsvData(): Promise<CsvDataset[]>;
}
