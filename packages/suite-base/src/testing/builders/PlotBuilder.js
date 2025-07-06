import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class PlotBuilder {
    static datum(props = {}) {
        return defaults(props, {
            x: BasicBuilder.number(),
            y: BasicBuilder.number(),
            value: undefined,
        });
    }
    static hoverElement(props = {}) {
        return defaults(props, {
            configIndex: BasicBuilder.number(),
            data: PlotBuilder.datum(),
        });
    }
    static hoverElements(count = 3) {
        return BasicBuilder.multiple(PlotBuilder.hoverElement, count);
    }
    static path(props = {}) {
        return defaults(props, {
            enabled: BasicBuilder.boolean(),
            timestampMethod: BasicBuilder.sample(["headerStamp", "receiveTime"]),
            value: BasicBuilder.string(),
        });
    }
    static paths(count = 3) {
        return BasicBuilder.multiple(PlotBuilder.path, count);
    }
    static basePlotPath(props = {}) {
        return defaults(props, {
            value: BasicBuilder.string(),
            enabled: BasicBuilder.boolean(),
        });
    }
    static config(props = {}) {
        return defaults(props, {
            followingViewWidth: BasicBuilder.number(),
            lichtblickPanelTitle: BasicBuilder.string(),
            isSynced: BasicBuilder.boolean(),
            legendDisplay: "floating",
            maxXValue: BasicBuilder.number(),
            maxYValue: BasicBuilder.number(),
            minXValue: BasicBuilder.number(),
            minYValue: BasicBuilder.number(),
            paths: PlotBuilder.paths(),
            showLegend: BasicBuilder.boolean(),
            showPlotValuesInLegend: BasicBuilder.boolean(),
            showSidebar: BasicBuilder.boolean(),
            showXAxisLabels: BasicBuilder.boolean(),
            showYAxisLabels: BasicBuilder.boolean(),
            sidebarDimension: BasicBuilder.number(),
            sidebarWidth: BasicBuilder.number(),
            xAxisPath: PlotBuilder.basePlotPath(),
            xAxisVal: BasicBuilder.sample([
                "timestamp",
                "index",
                "custom",
                "currentCustom",
            ]),
        });
    }
}
