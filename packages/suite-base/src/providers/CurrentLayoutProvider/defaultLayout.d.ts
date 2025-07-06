import { LayoutData } from "@lichtblick/suite-base/context/CurrentLayoutContext/actions";
/**
 * アプリケーション起動時のデフォルトレイアウト設定
 *
 * ユーザーがレイアウトを選択していない状態でアプリケーションが起動された際に
 * 表示される初期レイアウトです。空白画面を避けるために提供されています。
 *
 * ## レイアウト構成
 * ```
 * ┌─────────────────┬─────────────────┐
 * │                 │     Image       │
 * │       3D        │                 │
 * │                 ├─────────────────┤
 * │                 │  RawMessages    │
 * └─────────────────┴─────────────────┘
 * ```
 *
 * ## 含まれるパネル
 * - **3D Panel** (`3D!18i6zy7`): 3Dビジュアライゼーション
 *   - グリッドレイヤー付き（10x10、青色、1px線幅）
 * - **Image Panel** (`Image!3mnp456`): 画像表示パネル
 * - **RawMessages Panel** (`RawMessages!os6rgs`): 生メッセージ表示
 *
 * ## レイアウト分割
 * - 水平分割: 70%（3D） : 30%（右側）
 * - 右側は垂直分割: 70%（Image） : 30%（RawMessages）
 *
 * ## 設定項目
 * - `configById`: 各パネルの個別設定
 * - `globalVariables`: グローバル変数（空）
 * - `userNodes`: ユーザー定義ノード（空）
 * - `playbackConfig`: 再生設定（デフォルト速度1.0）
 * - `layout`: React Mosaicレイアウト構造
 *
 * ## 優先順位
 * 1. `staticDefaultLayout`（Docker等で注入）
 * 2. ハードコードされたデフォルトレイアウト
 *
 * @type {LayoutData}
 * @see LayoutData - レイアウトデータの型定義
 * @see defaultPlaybackConfig - デフォルト再生設定
 */
export declare const defaultLayout: LayoutData;
