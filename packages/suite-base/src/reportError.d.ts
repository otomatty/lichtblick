/**
 * @fileoverview アプリケーション全体のエラーレポート機能を提供するモジュール
 *
 * 【主な役割】
 * - アプリケーションで発生した予期しないエラーを中央集約してレポートする
 * - エラーハンドリングの統一的な仕組みを提供
 * - エラーレポートハンドラーの設定・管理
 *
 * 【使用箇所】
 * - ErrorBoundary.tsx: React Error Boundaryでキャッチしたエラーのレポート
 * - PanelErrorBoundary.tsx: パネル固有のエラーレポート
 * - sendNotification.ts: アプリケーションレベルのエラー通知
 * - util/layout.ts: レイアウト関連のエラーレポート
 * - 各種Worker: Web Worker内でのエラーレポート
 *
 * 【処理の流れ】
 * 1. reportError()でエラーを受け取る
 * 2. グローバルに設定されたハンドラー関数を呼び出す
 * 3. ハンドラーが未設定の場合は何もしない（no-op）
 *
 * 【特徴】
 * - グローバルオブジェクトを利用してハンドラーを管理
 * - 複数のプラットフォーム（Web/Desktop）で共通利用可能
 * - エラーレポートの送信先は実装側で決定（Sentry等）
 */
type ReportErrorHandler = (error: Error) => void;
/**
 * アプリケーションの通常のエラーハンドリングフローを逸脱したエラーをレポートする
 *
 * このエラーは開発者によるトリアージと診断が必要なものとして扱われる
 *
 * @param error レポートするエラーオブジェクト
 *
 * @example
 * ```typescript
 * try {
 *   // 何らかの処理
 * } catch (error) {
 *   reportError(new AppError(error, "追加のコンテキスト情報"));
 * }
 * ```
 */
export declare function reportError(error: Error): void;
/**
 * エラーがreportError()に渡された際に呼び出されるハンドラー関数を設定する
 *
 * デフォルトでは何もしない（no-op）ハンドラーが設定されている
 *
 * @param fn エラーを受け取って処理するハンドラー関数
 *
 * @example
 * ```typescript
 * // アプリケーション初期化時にSentryなどのエラーレポートサービスを設定
 * setReportErrorHandler((error) => {
 *   Sentry.captureException(error);
 * });
 * ```
 */
export declare function setReportErrorHandler(fn: ReportErrorHandler): void;
export {};
