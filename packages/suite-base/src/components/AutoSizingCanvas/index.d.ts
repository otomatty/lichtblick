/**
 * Canvas描画関数の型定義
 * @param context - 2Dレンダリングコンテキスト
 * @param width - CSS座標系での幅（デバイスピクセル比を考慮しない）
 * @param height - CSS座標系での高さ（デバイスピクセル比を考慮しない）
 */
type Draw = (context: CanvasRenderingContext2D, width: number, height: number) => void;
/**
 * AutoSizingCanvasコンポーネントのプロパティ
 */
type AutoSizingCanvasProps = {
    /** Canvas描画処理を行う関数 */
    draw: Draw;
    /** テスト用のデバイスピクセル比のオーバーライド値 */
    overrideDevicePixelRatioForTest?: number;
};
/**
 * 自動リサイズ対応Canvas コンポーネント
 *
 * 親要素のサイズ変更に自動的に追従し、高解像度ディスプレイ（Retina等）にも対応したCanvas要素を提供します。
 *
 * ## 主な機能
 * - **自動リサイズ**: 親要素のサイズ変更を検出し、Canvas要素を自動的にリサイズ
 * - **高解像度対応**: デバイスピクセル比を考慮した適切なCanvas解像度の設定
 * - **パフォーマンス最適化**: デバウンス処理により不要なリサイズ処理を抑制
 * - **動的ピクセル比対応**: ディスプレイ設定の変更やウィンドウの移動に対応
 *
 * ## 使用例
 * ```tsx
 * <AutoSizingCanvas
 *   draw={(ctx, width, height) => {
 *     ctx.fillStyle = "blue";
 *     ctx.fillRect(0, 0, width, height);
 *   }}
 * />
 * ```
 *
 * ## 技術的詳細
 * - `react-resize-detector`を使用してサイズ変更を検出
 * - `matchMedia`APIを使用してデバイスピクセル比の変更を監視
 * - Canvas要素の内部解像度とCSS表示サイズを適切に分離
 *
 * ## 注意事項
 * - 描画関数（draw）は毎フレーム呼び出される可能性があるため、パフォーマンスを考慮した実装が必要
 * - Canvas要素は親要素のサイズに100%フィットするため、親要素でサイズを制御する必要がある
 *
 * @param props - コンポーネントのプロパティ
 * @returns 自動リサイズ対応のCanvas要素
 */
declare const AutoSizingCanvas: ({ draw, overrideDevicePixelRatioForTest, }: AutoSizingCanvasProps) => React.JSX.Element;
export default AutoSizingCanvas;
