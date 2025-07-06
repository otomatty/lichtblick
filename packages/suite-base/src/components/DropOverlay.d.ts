import { PropsWithChildren } from "react";
/**
 * DropOverlayコンポーネント
 *
 * ファイルのドラッグ&ドロップ操作時に画面全体を覆う
 * オーバーレイを表示し、ユーザーに視覚的なフィードバックを提供する。
 *
 * ## 主な責任
 *
 * ### 1. 視覚的フィードバック提供
 * - フルスクリーンオーバーレイによるドロップエリアの明示
 * - 点線ボーダーによる境界の視覚化
 * - 中央配置されたメッセージ表示
 *
 * ### 2. ユーザーエクスペリエンス向上
 * - 直感的なドラッグ&ドロップ操作の誘導
 * - 明確な視覚的階層による理解促進
 * - 適切なタイミングでの表示/非表示制御
 *
 * ### 3. デザインシステム統合
 * - Material-UIテーマとの完全統合
 * - 一貫したカラーパレットの使用
 * - レスポンシブデザインの実現
 *
 * ### 4. パフォーマンス最適化
 * - 軽量なDOM構造
 * - 効率的なスタイル適用
 * - 不要なイベント処理の回避
 *
 * ## 使用例
 *
 * ```typescript
 * // 基本的な使用
 * <DropOverlay open={isDragging}>
 *   ファイルをここにドロップしてください
 * </DropOverlay>
 *
 * // 条件付きメッセージ
 * <DropOverlay open={isDragging && isValidFile}>
 *   {getDropMessage(fileType)}
 * </DropOverlay>
 *
 * // 動的表示制御
 * <DropOverlay open={dragState.isActive}>
 *   {dragState.message}
 * </DropOverlay>
 * ```
 *
 * ## 技術的詳細
 *
 * - **Dialog**: Material-UIのフルスクリーンダイアログを基盤
 * - **z-index**: 最高レベル（10000000）で最前面表示
 * - **ポインターイベント**: 無効化によりドラッグ操作を妨げない
 * - **透明度**: alpha関数による精密な透明度制御
 * - **レスポンシブ**: テーマのspacingシステムによる統一的な間隔
 *
 * @param props - コンポーネントプロパティ
 * @param props.open - オーバーレイの表示状態
 * @param props.children - 表示するメッセージ内容
 * @returns フルスクリーンオーバーレイ要素
 *
 * @author Lichtblick Team
 * @since 2018
 * @version 2.0
 */
declare function DropOverlay(props: PropsWithChildren<{
    open: boolean;
}>): React.JSX.Element;
export default DropOverlay;
