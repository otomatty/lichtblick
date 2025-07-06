import IAnalytics from "@lichtblick/suite-base/services/IAnalytics";
export default class NullAnalytics implements IAnalytics {
    logEvent(): void | Promise<void>;
}
