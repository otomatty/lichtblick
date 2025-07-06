import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import AutoSizingCanvas from ".";
/**
 * AutoSizingCanvasのテスト用サンプルコンポーネント
 *
 * 様々なシナリオでのAutoSizingCanvasの動作を確認するためのラッパーコンポーネントです。
 *
 * @param changeSize - サイズ変更をシミュレートするかどうか
 * @param changePixelRatio - ピクセル比変更をシミュレートするかどうか
 * @param devicePixelRatio - 固定のデバイスピクセル比（テスト用）
 */
function Example({ changeSize = false, changePixelRatio = false, devicePixelRatio, }) {
    const [width, setWidth] = useState(300);
    const [pixelRatio, setPixelRatio] = useState(devicePixelRatio);
    // 動的な変更をシミュレート
    useEffect(() => {
        const timeOutID = setTimeout(() => {
            if (changeSize) {
                setWidth(150);
            }
            if (changePixelRatio) {
                setPixelRatio(2);
            }
        }, 10);
        return () => {
            clearTimeout(timeOutID);
        };
    }, [changePixelRatio, changeSize]);
    return (_jsx("div", { style: { width, height: 100, backgroundColor: "green" }, children: _jsx(AutoSizingCanvas, { overrideDevicePixelRatioForTest: pixelRatio, draw: (ctx, drawWidth, drawHeight) => {
                // 白い背景を描画
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, drawWidth, drawHeight);
                // 赤い枠線を描画
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.font = "24px Arial";
                ctx.strokeRect(0, 0, drawWidth, drawHeight);
                // 現在のピクセル比を表示するテキストを描画
                const text = `hello ${ctx.getTransform().a}`;
                const size = ctx.measureText(text);
                ctx.fillStyle = "black";
                ctx.textBaseline = "middle";
                ctx.fillText(text, drawWidth / 2 - size.width / 2, drawHeight / 2);
            } }) }));
}
export default {
    title: "components/AutoSizingCanvas",
};
/**
 * 基本的な静的表示のストーリー
 *
 * AutoSizingCanvasの基本的な動作を確認できます。
 * 緑色の親要素内に白い背景のCanvasが表示され、
 * 赤い枠線と現在のピクセル比を示すテキストが描画されます。
 */
export const Static = {
    render: () => _jsx(Example, {}),
    name: "static",
};
/**
 * サイズ変更のストーリー
 *
 * 親要素のサイズが動的に変更される場合の動作を確認できます。
 * 初期表示後、短時間でサイズが300pxから150pxに変更されます。
 * Canvas要素が適切にリサイズされることを確認できます。
 */
export const ChangingSize = {
    render: () => _jsx(Example, { changeSize: true }),
    name: "changing size",
};
/**
 * 高解像度ディスプレイ対応のストーリー
 *
 * デバイスピクセル比が2.0の環境での表示を確認できます。
 * 高解像度ディスプレイ（Retina等）での表示品質を検証できます。
 * テキストに表示される数値が2.0になることを確認できます。
 */
export const PixelRatio2 = {
    render: () => _jsx(Example, { devicePixelRatio: 2 }),
    name: "pixel ratio 2",
};
/**
 * ピクセル比変更のストーリー
 *
 * デバイスピクセル比が動的に変更される場合の動作を確認できます。
 * 初期表示後、短時間でピクセル比が2.0に変更されます。
 * Canvas要素が適切に再描画されることを確認できます。
 */
export const ChangingPixelRatio = {
    render: () => _jsx(Example, { changePixelRatio: true }),
    name: "changing pixel ratio",
};
