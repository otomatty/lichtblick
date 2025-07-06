/// <reference types="react" />
/**
 * DataSourceInfoView - メインエクスポートコンポーネント
 *
 * MessagePipelineから必要な情報を取得し、DataSourceInfoContentに渡す。
 * 高頻度更新される時刻情報は直接DOM操作で効率的に更新する。
 */
export declare function DataSourceInfoView({ disableSource, }: {
    disableSource?: boolean;
}): React.JSX.Element;
