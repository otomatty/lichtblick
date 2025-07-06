/**
 * @fileoverview ホバー値の型定義
 *
 * このファイルは、UIコンポーネントでのホバー操作時に表示される
 * 値の情報を定義します。主にタイムライン、チャート、プロットなどで
 * マウスホバー時の詳細情報表示に使用されます。
 */
/**
 * ホバー時に表示される値の情報
 *
 * @description マウスホバー時に表示される値とその関連情報を定義します。
 *
 * 主な用途:
 * - タイムライン上でのホバー情報
 * - チャート/グラフでのデータポイント詳細
 * - プロット上での値表示
 * - 時系列データの詳細表示
 *
 * @example
 * ```typescript
 * // 再生時間のホバー値
 * const playbackHover: HoverValue = {
 *   value: 123.456,
 *   componentId: "timeline-scrubber",
 *   type: "PLAYBACK_SECONDS"
 * };
 *
 * // その他の値のホバー値
 * const customHover: HoverValue = {
 *   value: 42.0,
 *   componentId: "custom-chart",
 *   type: "OTHER"
 * };
 * ```
 */
export type HoverValue = {
    /** ホバー対象の数値 */
    value: number;
    /** ホバー値を提供するコンポーネントの識別子 */
    componentId: string;
    /** ホバー値の種類 */
    type: "PLAYBACK_SECONDS" | "OTHER";
};
