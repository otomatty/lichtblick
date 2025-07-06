import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";
/**
 * PanelErrorBoundaryコンポーネントのプロパティ型
 */
type Props = {
    /** エラーの技術的詳細を表示するかどうか（開発時のみ推奨） */
    showErrorDetails?: boolean;
    /** エラーのソースコード位置情報を隠すかどうか（本番環境推奨） */
    hideErrorSourceLocations?: boolean;
    /** パネルをリセットする際のコールバック関数 */
    onResetPanel: () => void;
    /** パネルを削除する際のコールバック関数 */
    onRemovePanel: () => void;
};
/**
 * PanelErrorBoundaryコンポーネントの状態型
 */
type State = {
    /** 現在のエラー情報（エラーがない場合はundefined） */
    currentError: {
        error: Error;
        errorInfo: ErrorInfo;
    } | undefined;
};
/**
 * PanelErrorBoundaryコンポーネント
 *
 * 個別のパネル内で発生したエラーをキャッチし、アプリケーション全体の
 * クラッシュを防ぐエラーバウンダリー。パネル固有のエラー復旧機能を提供。
 *
 * ## 主要な責任
 *
 * ### 1. エラーキャッチ
 * - パネル内のJavaScriptエラーをキャッチ
 * - React Error Boundaryパターンの実装
 * - エラー発生時のコンポーネントツリーの分離
 *
 * ### 2. エラー報告
 * - エラー情報の自動収集と報告
 * - AppErrorによるエラーの構造化
 * - デバッグ情報の保持
 *
 * ### 3. ユーザーインターフェース
 * - 分かりやすいエラーメッセージ表示
 * - 復旧オプションの提供
 * - 段階的な復旧アクション
 *
 * ### 4. 状態管理
 * - エラー状態の追跡
 * - 復旧後の状態リセット
 * - エラー情報の保持
 *
 * ## エラーハンドリングの仕組み
 *
 * React Error Boundaryは以下の場合にエラーをキャッチする：
 * - レンダリング中のエラー
 * - ライフサイクルメソッド内のエラー
 * - コンストラクタ内のエラー
 *
 * ただし、以下の場合はキャッチしない：
 * - イベントハンドラ内のエラー
 * - 非同期コード内のエラー
 * - サーバーサイドレンダリング中のエラー
 * - Error Boundary自身のエラー
 *
 * ## 使用例
 *
 * ```typescript
 * // 基本的な使用
 * <PanelErrorBoundary
 *   onResetPanel={handleResetPanel}
 *   onRemovePanel={handleRemovePanel}
 * >
 *   <MyPanelComponent />
 * </PanelErrorBoundary>
 *
 * // 開発環境での詳細表示
 * <PanelErrorBoundary
 *   showErrorDetails={process.env.NODE_ENV === 'development'}
 *   hideErrorSourceLocations={process.env.NODE_ENV === 'production'}
 *   onResetPanel={handleResetPanel}
 *   onRemovePanel={handleRemovePanel}
 * >
 *   <MyPanelComponent />
 * </PanelErrorBoundary>
 * ```
 *
 * @author Lichtblick Team
 * @since 2023
 */
export default class PanelErrorBoundary extends Component<PropsWithChildren<Props>, State> {
    /**
     * コンポーネントの初期状態
     *
     * エラーが発生していない正常な状態で初期化される。
     */
    state: State;
    /**
     * エラーキャッチ時に呼び出されるライフサイクルメソッド
     *
     * パネル内でエラーが発生した際に自動的に呼び出される。
     * エラー情報を収集し、報告システムに送信した後、
     * コンポーネントの状態を更新してエラー表示に切り替える。
     *
     * ## 処理フロー
     *
     * 1. **エラー報告**: reportError()でエラー情報を送信
     * 2. **状態更新**: エラー情報をstateに保存
     * 3. **再レンダリング**: エラー表示UIに切り替え
     *
     * @param error - キャッチされたエラーオブジェクト
     * @param errorInfo - React固有のエラー情報（コンポーネントスタック等）
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    /**
     * コンポーネントのレンダリング処理
     *
     * エラー状態に応じて、通常のコンテンツまたはエラー表示を
     * 切り替える。エラー発生時は、ユーザーフレンドリーな
     * エラー表示と復旧オプションを提供する。
     *
     * ## レンダリング分岐
     *
     * ### エラー状態の場合
     * - ErrorDisplayコンポーネントによるエラー表示
     * - 分かりやすいエラーメッセージ
     * - 3つの復旧オプション（Dismiss、Reset、Remove）
     * - エラー詳細の表示/非表示制御
     *
     * ### 正常状態の場合
     * - 子コンポーネントをそのまま表示
     * - 通常のパネル機能を提供
     *
     * @returns レンダリングされるReactノード
     */
    render(): ReactNode;
}
export {};
