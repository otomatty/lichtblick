import { HTMLAttributes } from "react";
import { TransitionStatus } from "react-transition-group";
/** PanelRootコンポーネントのCSSクラス名定数 */
export declare const PANEL_ROOT_CLASS_NAME = "LichtblickPanelRoot-root";
/**
 * PanelRootコンポーネント
 *
 * Lichtblickアプリケーションの各パネルを包むルートコンテナ。
 * パネルの基本的な表示、選択状態、フルスクリーン遷移を管理する。
 *
 * ## 主要な責任
 *
 * ### 1. フルスクリーン遷移管理
 * - react-transition-groupとの連携
 * - 4段階の遷移状態に応じたスタイル適用
 * - 元の位置からフルスクリーンへのスムーズなアニメーション
 *
 * ### 2. 選択状態の視覚化
 * - 選択されたパネルの境界線表示
 * - プライマリカラーによる一貫したデザイン
 * - スムーズな遷移アニメーション
 *
 * ### 3. レイアウト基盤の提供
 * - flexboxベースの柔軟なレイアウト
 * - 子要素の完全な描画領域確保
 * - オーバーフロー制御
 *
 * ### 4. ドラッグ&ドロップ対応
 * - 適切なz-index管理
 * - フルスクリーン子要素との重ね順調整
 * - 信頼性の高いドラッグ操作
 *
 * ## 使用例
 *
 * ```typescript
 * // Panel HOC内での基本的な使用
 * <PanelRoot
 *   fullscreenState="exited"
 *   selected={false}
 *   sourceRect={undefined}
 *   hasFullscreenDescendant={false}
 * >
 *   <MyPanelContent />
 * </PanelRoot>
 *
 * // フルスクリーン遷移時の使用
 * <PanelRoot
 *   fullscreenState="entered"
 *   selected={true}
 *   sourceRect={originalRect}
 *   hasFullscreenDescendant={false}
 * >
 *   <FullscreenPanelContent />
 * </PanelRoot>
 * ```
 *
 * ## 技術的詳細
 *
 * - **forwardRef**: 親コンポーネントからのref転送対応
 * - **HTMLAttributes**: 標準的なHTML属性の継承
 * - **PropsWithChildren**: 子要素の型安全な受け渡し
 * - **CSS-in-JS**: tss-react/muiによる動的スタイル生成
 * - **クラス名結合**: clsxによる条件付きクラス名適用
 *
 * @param props - コンポーネントプロパティ
 * @param ref - 転送されるDOM要素への参照
 * @returns レンダリングされたパネルルート要素
 *
 * @author Lichtblick Team
 * @since 2023
 */
export declare const PanelRoot: import("react").ForwardRefExoticComponent<{
    /** フルスクリーン遷移の現在の状態 */
    fullscreenState: TransitionStatus;
    /** パネルが選択されているかどうか */
    selected: boolean;
    /** フルスクリーン遷移時の元の位置情報 */
    sourceRect: DOMRectReadOnly | undefined;
    /** 子要素にフルスクリーン状態のものがあるかどうか */
    hasFullscreenDescendant: boolean;
} & HTMLAttributes<HTMLDivElement> & {
    children?: import("react").ReactNode;
} & import("react").RefAttributes<HTMLDivElement>>;
