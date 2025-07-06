/**
 * フレーム一時停止Promise型定義
 *
 * フレーム一時停止機能で使用されるPromiseオブジェクトの型定義。
 * 処理名とPromiseを組み合わせることで、デバッグ時の識別を容易にする。
 *
 * @property name - 一時停止の理由を示す名前（デバッグ用）
 * @property promise - 処理完了を示すPromise
 *
 * @example
 * ```ts
 * const framePromise: FramePromise = {
 *   name: "heavy-computation",
 *   promise: heavyAsyncOperation()
 * };
 * ```
 */
export type FramePromise = {
    name: string;
    promise: Promise<void>;
};
/**
 * Promise最大タイムアウト時間（ミリ秒）
 *
 * ユーザーが待機していない場合（自動実行時）は、
 * より長い時間待機してからエラーとする。
 *
 * この値は以下の考慮事項に基づいて設定：
 * - 通常のパネル処理時間の上限
 * - ユーザー体験への影響
 * - システム応答性の維持
 * - 自動化テストでの安定性
 */
export declare const MAX_PROMISE_TIMEOUT_TIME_MS = 5000;
/**
 * フレーム一時停止Promise群の待機処理
 *
 * 複数のFramePromiseを並列で待機し、全ての処理が完了するか
 * タイムアウトが発生するまで待機する。重い非同期レンダリングタスクが
 * 時間内に完了しなかった場合、一部のパネルが間違ったフレームの
 * データを表示する可能性があるが、システム全体の安定性を優先する。
 *
 * ## 処理フロー
 *
 * ### 1. 並列Promise待機
 * - 全てのFramePromiseを並列で実行
 * - Promise.all()による効率的な待機
 * - 個別Promise失敗の適切な処理
 *
 * ### 2. タイムアウト制御
 * - MAX_PROMISE_TIMEOUT_TIME_MSでの制限
 * - タイムアウト時の適切な処理停止
 * - エラー情報の詳細記録
 *
 * ### 3. エラーハンドリング
 * - タイムアウトエラーの識別
 * - 処理失敗エラーの通知
 * - ユーザーフレンドリーなメッセージ表示
 *
 * ## エラー処理戦略
 *
 * ### タイムアウトエラー
 * - 無音で処理継続（ログ記録のみ）
 * - システム応答性の維持優先
 * - デバッグ情報の保持
 *
 * ### 処理失敗エラー
 * - ユーザー通知の表示
 * - 詳細エラー情報の記録
 * - システム安定性の確保
 *
 * @param promises - 待機対象のFramePromise配列
 * @returns 全処理完了またはタイムアウト時に解決するPromise
 *
 * @example
 * ```ts
 * const promises: FramePromise[] = [
 *   { name: "panel1-render", promise: panel1.render() },
 *   { name: "panel2-compute", promise: panel2.compute() },
 * ];
 *
 * await pauseFrameForPromises(promises);
 * console.log("All panel processing completed or timed out");
 * ```
 *
 * @example エラーハンドリング
 * ```ts
 * try {
 *   await pauseFrameForPromises(promises);
 * } catch (error) {
 *   // この関数は例外を投げないため、このブロックは実行されない
 *   // エラーは内部で適切に処理される
 * }
 * ```
 */
export declare function pauseFrameForPromises(promises: FramePromise[]): Promise<void>;
