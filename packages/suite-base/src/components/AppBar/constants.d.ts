/**
 * AppBar Constants - アプリケーションバー定数定義
 *
 * AppBarコンポーネント群で使用される定数値を定義します。
 * レイアウト計算、スタイリング、位置決めなどで使用されます。
 */
/**
 * APP_BAR_HEIGHT - アプリケーションバーの高さ（ピクセル）
 *
 * アプリケーション上部に表示されるAppBarコンポーネントの固定高さ。
 * この値は以下の用途で使用されます：
 * - AppBarコンテナの高さ設定
 * - メインコンテンツエリアの上部マージン計算
 * - レイアウト計算での垂直位置調整
 * - z-indexやposition設定でのオフセット計算
 *
 * @constant {number} 44 - 高さ44ピクセル（Material Design推奨値に基づく）
 *
 * @example
 * ```typescript
 * // スタイルでの使用例
 * const useStyles = makeStyles((theme) => ({
 *   content: {
 *     marginTop: APP_BAR_HEIGHT,
 *     height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
 *   },
 * }));
 * ```
 */
export declare const APP_BAR_HEIGHT = 44;
