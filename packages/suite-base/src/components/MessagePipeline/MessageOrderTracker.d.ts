import { PlayerState, PlayerAlert } from "@lichtblick/suite-base/players/types";
/**
 * MessageOrderTracker - メッセージ順序と時間整合性の監視クラス
 *
 * メッセージのreceiveTimeとplayer.currentTimeの大幅な差異（DRIFT_THRESHOLD_SEC以上）、
 * またはメッセージの時間逆行を検出してログ出力する。
 * ただし、player.lastSeekTimeが変更された場合は除外する。
 * この場合、パネルは保存されたデータをクリアする必要がある。
 *
 * これは、古いメッセージを破棄する、またはplayer.lastSeekTimeの強制更新を行う
 * 他のメカニズムが適切に動作していることを確認するためのシステム。
 *
 * ## 監視対象
 *
 * ### 1. 時間ドリフト
 * - メッセージ受信時刻とPlayer現在時刻の乖離
 * - 閾値を超過した場合のアラート生成
 * - シーク後のバックフィル除外
 *
 * ### 2. 逆行メッセージ
 * - 前回より古いメッセージの検出
 * - トピック別の詳細情報提供
 * - 時刻フォーマットによる可読性向上
 *
 * ## 状態管理
 *
 * ### 内部状態
 * - `lastMessages`: 前回処理したメッセージ配列
 * - `lastCurrentTime`: 前回のPlayer現在時刻
 * - `lastMessageTime`: 前回メッセージの受信時刻
 * - `lastMessageTopic`: 前回メッセージのトピック
 * - `lastLastSeekTime`: 前回のシーク時刻
 * - `warningTimeout`: アラート遅延タイマー
 *
 * ### デバッグ機能
 * - `trackIncorrectMessages`: 不正メッセージの詳細追跡
 * - 本番環境では無効化（GC対策）
 * - 開発時の詳細ログ出力
 *
 * @example
 * ```ts
 * const tracker = new MessageOrderTracker();
 *
 * function playerListener(playerState: PlayerState) {
 *   const alerts = tracker.update(playerState);
 *   if (alerts.length > 0) {
 *     console.log("Time consistency issues detected:", alerts);
 *   }
 * }
 * ```
 */
declare class MessageOrderTracker {
    #private;
    /**
     * Player状態更新処理
     *
     * 新しいPlayer状態を受け取り、メッセージの時間整合性を検証する。
     * 問題が検出された場合、適切なPlayerAlertを生成して返す。
     *
     * ## 処理フロー
     *
     * ### 1. シーク検出処理
     * - lastSeekTimeの変更チェック
     * - シーク時の状態リセット
     * - タイムアウトのクリア
     *
     * ### 2. メッセージ処理
     * - 新しいメッセージの時間整合性チェック
     * - ドリフト検出とアラート生成
     * - 逆行メッセージの検出
     *
     * ### 3. 状態更新
     * - 内部状態の更新
     * - 次回処理のための情報保存
     *
     * ## アラート生成条件
     *
     * ### ドリフトアラート
     * - メッセージ時刻とPlayer現在時刻の差がDRIFT_THRESHOLD_SEC以上
     * - シーク直後ではない場合
     * - WAIT_FOR_SEEK_SEC後にタイムアウトで生成
     *
     * ### 逆行アラート
     * - 前回メッセージより古いメッセージを検出
     * - 即座にアラート生成
     * - 詳細な時刻情報を含む
     *
     * @param playerState - 検証対象のPlayer状態
     * @returns 検出された問題のPlayerAlert配列
     *
     * @example
     * ```ts
     * const tracker = new MessageOrderTracker();
     * const alerts = tracker.update(playerState);
     *
     * for (const alert of alerts) {
     *   console.log(`${alert.severity}: ${alert.message}`);
     *   if (alert.error) {
     *     console.error(alert.error);
     *   }
     * }
     * ```
     */
    update(playerState: PlayerState): PlayerAlert[];
}
export default MessageOrderTracker;
