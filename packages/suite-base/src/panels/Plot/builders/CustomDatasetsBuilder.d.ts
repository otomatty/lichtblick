import { MessagePath } from "@lichtblick/message-path";
import { Immutable } from "@lichtblick/suite";
import { PlayerState } from "@lichtblick/suite-base/players/types";
import { CsvDataset, GetViewportDatasetsResult, HandlePlayerStateResult, IDatasetsBuilder, SeriesItem, Viewport } from "./IDatasetsBuilder";
export declare class CustomDatasetsBuilder implements IDatasetsBuilder {
    #private;
    constructor();
    handlePlayerState(state: Immutable<PlayerState>): HandlePlayerStateResult | undefined;
    setXPath(path: Immutable<MessagePath> | undefined): void;
    setSeries(series: Immutable<SeriesItem[]>): void;
    getViewportDatasets(viewport: Immutable<Viewport>): Promise<GetViewportDatasetsResult>;
    getCsvData(): Promise<CsvDataset[]>;
}
