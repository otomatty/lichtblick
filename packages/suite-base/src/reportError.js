// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// グローバルオブジェクトにエラーハンドラーを追加する型定義
// デスクトップ版とWeb版で共通のエラーレポート機能を提供するため
const globalWithHandler = global;
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
export function reportError(error) {
    globalWithHandler.foxgloveStudioReportErrorFn?.(error);
}
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
export function setReportErrorHandler(fn) {
    globalWithHandler.foxgloveStudioReportErrorFn = fn;
}
