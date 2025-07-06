import { PropsWithChildren } from "react";
/**
 * Studioログ設定プロバイダーコンポーネント
 *
 * アプリケーション全体のログ設定を管理するProviderコンポーネントです。
 * Zustandベースの状態管理とLocalStorageによる永続化を組み合わせ、
 * 動的なログチャンネル管理と設定の自動保存を実現します。
 *
 * ## 主な機能
 * - **永続化対応**: LocalStorageによる設定の自動保存・復元
 * - **動的チャンネル管理**: 実行時に追加されるログチャンネルの自動検出
 * - **リアルタイム同期**: ログ設定の変更を即座にLocalStorageに反映
 * - **チャンネル監視**: 1秒間隔でのログチャンネル数変化の監視
 * - **状態管理**: Zustandストアによる効率的な状態管理
 *
 * ## 永続化の仕組み
 * - LocalStorageキー: "blick.logs-settings"
 * - 保存内容: グローバルログレベル + 無効化チャンネル一覧
 * - 自動保存: ログ設定変更時に即座に保存
 * - 復元: コンポーネント初期化時に自動復元
 *
 * ## 動的チャンネル管理
 * - 定期監視: 1秒間隔でLog.channels()の数をチェック
 * - 自動再初期化: チャンネル数変化時にストアを再作成
 * - 設定保持: 既存設定を保持したまま新チャンネルを追加
 *
 * ## パフォーマンス最適化
 * - useRef: LocalStorage状態の参照を最適化
 * - 条件付き再初期化: チャンネル数変化時のみストア再作成
 * - 効率的な購読: Zustandの選択的購読による無駄な再レンダリング防止
 *
 * ## 使用場面
 * - 開発時のデバッグログ制御
 * - 本番環境でのログレベル調整
 * - 特定機能のログ有効/無効切り替え
 * - パフォーマンス分析用のログ制御
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * // アプリケーションでの使用
 * <StudioLogsSettingsProvider>
 *   <App />
 * </StudioLogsSettingsProvider>
 *
 * // 子コンポーネントでのログ設定使用
 * const logsSettings = useContext(StudioLogsSettingsContext);
 * const state = logsSettings.getState();
 *
 * // ログレベル変更
 * state.setGlobalLevel("debug");
 *
 * // 特定チャンネルの制御
 * state.enableChannel("network");
 * state.disableChannel("verbose");
 * ```
 */
declare function StudioLogsSettingsProvider(props: PropsWithChildren): React.JSX.Element;
export { StudioLogsSettingsProvider };
