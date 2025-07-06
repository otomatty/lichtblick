import { Immutable } from "@lichtblick/suite";
import { CsvDataset } from "@lichtblick/suite-base/panels/Plot/builders/IDatasetsBuilder";
import { PlotXAxisVal } from "./config";
declare function generateCSV(datasets: Immutable<CsvDataset[]>, xAxisVal: PlotXAxisVal): string;
declare function downloadCSV(filename: string, datasets: Immutable<CsvDataset[]>, xAxisVal: PlotXAxisVal): void;
export { downloadCSV, generateCSV };
