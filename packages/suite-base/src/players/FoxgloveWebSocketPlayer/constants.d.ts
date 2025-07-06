/** Suppress warnings about messages on unknown subscriptions if the susbscription was recently canceled. */
export declare const SUBSCRIPTION_WARNING_SUPPRESSION_MS = 2000;
export declare const ZERO_TIME: Readonly<{
    sec: 0;
    nsec: 0;
}>;
export declare const GET_ALL_PARAMS_REQUEST_ID = "get-all-params";
export declare const GET_ALL_PARAMS_PERIOD_MS = 15000;
export declare const ROS_ENCODINGS: string[];
export declare const SUPPORTED_PUBLICATION_ENCODINGS: string[];
export declare const FALLBACK_PUBLICATION_ENCODING = "json";
export declare const SUPPORTED_SERVICE_ENCODINGS: string[];
/**
 * When the tab is inactive setTimeout's are throttled to at most once per second.
 * Because the MessagePipeline listener uses timeouts to resolve its promises, it throttles our ability to
 * emit a frame more than once per second. In the websocket player this was causing
 * an accumulation of messages that were waiting to be emitted, this could keep growing
 * indefinitely if the rate at which we emit a frame is low enough.
 * 400MB
 */
export declare const CURRENT_FRAME_MAXIMUM_SIZE_BYTES: number;
