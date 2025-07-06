/// <reference types="react" />
/**
 * AccountSyncGraphicコンポーネントのProps型定義
 * @interface Props
 * @property {number} [width] - SVGの幅（オプショナル）
 */
type Props = {
    width?: number;
};
/**
 * アカウント同期を視覚的に表現するSVGグラフィックコンポーネント
 *
 * 機能概要:
 * - デバイス間でのデータ同期を象徴するグラフィック
 * - 2つのデバイス（左下と右上）とそれらを結ぶ同期線を表示
 * - 地球儀風の円形パターンで全体的な接続性を表現
 * - currentColorを使用してテーマカラーに対応
 *
 * 視覚的要素:
 * - 中央の地球儀風の円形グリッド
 * - 左下のデバイス（ノートパソコン風）
 * - 右上のデバイス（デスクトップ風）
 * - デバイス間を結ぶ同期曲線
 * - 装飾的な点群による接続性の表現
 *
 * @param props - コンポーネントのプロパティ
 * @returns アカウント同期グラフィックのSVG
 */
export default function AccountSyncGraphic(props: Props): React.JSX.Element;
export {};
