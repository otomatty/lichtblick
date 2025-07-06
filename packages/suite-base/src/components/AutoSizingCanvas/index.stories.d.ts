import { StoryObj } from "@storybook/react";
declare const _default: {
    title: string;
};
export default _default;
/**
 * 基本的な静的表示のストーリー
 *
 * AutoSizingCanvasの基本的な動作を確認できます。
 * 緑色の親要素内に白い背景のCanvasが表示され、
 * 赤い枠線と現在のピクセル比を示すテキストが描画されます。
 */
export declare const Static: StoryObj;
/**
 * サイズ変更のストーリー
 *
 * 親要素のサイズが動的に変更される場合の動作を確認できます。
 * 初期表示後、短時間でサイズが300pxから150pxに変更されます。
 * Canvas要素が適切にリサイズされることを確認できます。
 */
export declare const ChangingSize: StoryObj;
/**
 * 高解像度ディスプレイ対応のストーリー
 *
 * デバイスピクセル比が2.0の環境での表示を確認できます。
 * 高解像度ディスプレイ（Retina等）での表示品質を検証できます。
 * テキストに表示される数値が2.0になることを確認できます。
 */
export declare const PixelRatio2: StoryObj;
/**
 * ピクセル比変更のストーリー
 *
 * デバイスピクセル比が動的に変更される場合の動作を確認できます。
 * 初期表示後、短時間でピクセル比が2.0に変更されます。
 * Canvas要素が適切に再描画されることを確認できます。
 */
export declare const ChangingPixelRatio: StoryObj;
