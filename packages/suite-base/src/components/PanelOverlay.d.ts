/**
 * @fileoverview PanelOverlay - パネル操作用オーバーレイコンポーネント
 *
 * このファイルは、パネル上に表示されるインタラクティブなオーバーレイを
 * 実装している。ドラッグ&ドロップ操作、パネルアクション、視覚的フィードバック
 * を提供する重要なUIコンポーネント。
 *
 * ## 主要機能
 *
 * ### 1. ドラッグ&ドロップ対応
 * - 有効/無効なドロップターゲットの視覚化
 * - ドロップ時のメッセージ表示
 * - 半透明オーバーレイによる状態表示
 * - 色分けによる直感的なフィードバック
 *
 * ### 2. パネルアクション
 * - カスタマイズ可能なアクションボタン群
 * - アイコンとテキストによる操作説明
 * - レスポンシブなボタン配置
 * - コンテナクエリによる適応的レイアウト
 *
 * ### 3. 選択状態表示
 * - 選択されたパネルの視覚的強調
 * - グラデーション背景による状態表示
 * - ホバー時の表示制御
 *
 * ### 4. レスポンシブデザイン
 * - コンテナクエリによる動的レイアウト調整
 * - 画面サイズに応じたボタン配置変更
 * - テキスト表示の適応的制御
 *
 * ## オーバーレイバリエーション
 *
 * ### validDropTarget（有効ドロップターゲット）
 * - プライマリカラーの半透明背景
 * - ドロップメッセージの表示
 * - 下端揃えのレイアウト
 * - ユーザーにドロップ可能であることを示す
 *
 * ### invalidDropTarget（無効ドロップターゲット）
 * - グレー系の半透明背景
 * - ドロップ不可を示す視覚的フィードバック
 * - アクションボタンは表示されない
 *
 * ### selected（選択状態）
 * - グラデーション背景による強調表示
 * - アクションボタンの表示
 * - パネル操作メニューの提供
 *
 * ## ハイライトモード
 *
 * ### active（アクティブモード）
 * - ホバー時のみオーバーレイ表示
 * - 通常時は非表示
 * - 軽量なインタラクション
 *
 * ### all（全表示モード）
 * - 常時オーバーレイ表示
 * - ホバー時のみボタン群表示
 * - より積極的な操作誘導
 *
 * ## コンテナクエリによる適応的レイアウト
 *
 * ```css
 * // 高さ80px以下：横並びレイアウト
 * @container backdrop (max-height: 80px) {
 *   flexDirection: row;
 * }
 *
 * // 高さ120px以上：ツールバー分のマージン
 * @container backdrop (min-height: 120px) {
 *   marginTop: PANEL_TOOLBAR_MIN_HEIGHT;
 * }
 *
 * // 幅240px以上：横並びレイアウト
 * @container backdrop (min-width: 240px) {
 *   flexDirection: row;
 * }
 *
 * // 幅120px以下：テキスト非表示
 * @container backdrop (max-width: 120px) {
 *   .buttonText { display: none; }
 * }
 * ```
 *
 * ## 使用例
 *
 * ```typescript
 * // ドラッグ&ドロップ用オーバーレイ
 * <PanelOverlay
 *   open={isDragOver}
 *   variant="validDropTarget"
 *   dropMessage="Drop here to add panel"
 * />
 *
 * // パネル選択時のアクション表示
 * <PanelOverlay
 *   open={isSelected}
 *   variant="selected"
 *   highlightMode="active"
 *   actions={[
 *     {
 *       key: "fullscreen",
 *       text: "Fullscreen",
 *       icon: <FullscreenIcon />,
 *       onClick: handleFullscreen,
 *       color: "primary"
 *     },
 *     {
 *       key: "settings",
 *       text: "Settings",
 *       icon: <SettingsIcon />,
 *       onClick: handleSettings
 *     }
 *   ]}
 *   onClickAway={handleClickAway}
 * />
 * ```
 *
 * ## 技術的特徴
 *
 * - **Material-UI統合**: BackdropとButtonコンポーネントの活用
 * - **CSS-in-JS**: tss-react/muiによる動的スタイル生成
 * - **色彩計算**: tinycolor2による透明度とホバー色の計算
 * - **コンテナクエリ**: 最新のCSS機能による適応的レイアウト
 * - **アクセシビリティ**: ClickAwayListenerによる適切なフォーカス管理
 *
 * @author Lichtblick Team
 * @since 2023
 */
import { ButtonProps } from "@mui/material";
import { ReactElement } from "react";
/**
 * PanelOverlayコンポーネントのプロパティ型定義
 */
export type PanelOverlayProps = {
    /** 表示するアクションボタンの配列 */
    actions?: {
        /** アクションの一意識別子 */
        key: string;
        /** ボタンに表示するテキスト */
        text: string;
        /** ボタンに表示するアイコン要素 */
        icon: ReactElement;
        /** クリック時のコールバック関数 */
        onClick?: () => void;
        /** ボタンの色テーマ（Material-UIのcolor prop） */
        color?: ButtonProps["color"];
    }[];
    /** ドロップ時に表示するメッセージ */
    dropMessage?: string;
    /** ハイライト表示モード */
    highlightMode?: "active" | "all";
    /** オーバーレイの表示状態 */
    open: boolean;
    /** オーバーレイの表示バリエーション */
    variant?: "validDropTarget" | "invalidDropTarget" | "selected";
    /** オーバーレイ外クリック時のコールバック */
    onClickAway?: () => void;
};
/**
 * PanelOverlayコンポーネント
 *
 * パネル上に表示されるインタラクティブなオーバーレイ。
 * ドラッグ&ドロップ操作、パネルアクション、視覚的フィードバックを提供する。
 *
 * ## 主要な責任
 *
 * ### 1. ドラッグ&ドロップフィードバック
 * - 有効/無効なドロップターゲットの視覚化
 * - ドロップメッセージの表示
 * - 色分けによる直感的な状態表示
 *
 * ### 2. パネルアクション提供
 * - カスタマイズ可能なアクションボタン群
 * - レスポンシブなボタン配置
 * - アイコンとテキストによる操作説明
 *
 * ### 3. 選択状態の視覚化
 * - 選択されたパネルの強調表示
 * - グラデーション背景による状態表示
 * - ホバー時の適切な表示制御
 *
 * ### 4. ユーザビリティ向上
 * - ClickAwayListenerによる適切なフォーカス管理
 * - コンテナクエリによる適応的レイアウト
 * - アクセシビリティを考慮したインタラクション
 *
 * ## 使用例
 *
 * ```typescript
 * // ドラッグ&ドロップ用オーバーレイ
 * <PanelOverlay
 *   open={isDragOver}
 *   variant="validDropTarget"
 *   dropMessage="パネルをここにドロップ"
 * />
 *
 * // パネル選択時のアクション表示
 * <PanelOverlay
 *   open={isSelected}
 *   variant="selected"
 *   highlightMode="active"
 *   actions={panelActions}
 *   onClickAway={handleDeselect}
 * />
 *
 * // 無効ドロップターゲット
 * <PanelOverlay
 *   open={isDragOver}
 *   variant="invalidDropTarget"
 * />
 * ```
 *
 * ## 技術的詳細
 *
 * - **forwardRef**: 親コンポーネントからのref転送対応
 * - **Backdrop**: Material-UIのBackdropによるオーバーレイ実装
 * - **ClickAwayListener**: 外部クリック検知による適切な状態管理
 * - **コンテナクエリ**: 最新のCSS機能による適応的レイアウト
 * - **色彩計算**: tinycolor2による精密な色調整
 *
 * @param props - コンポーネントプロパティ
 * @param ref - 転送されるDOM要素への参照
 * @returns レンダリングされたオーバーレイ要素、または非表示時はnull
 *
 * @author Lichtblick Team
 * @since 2023
 */
export declare const PanelOverlay: import("react").ForwardRefExoticComponent<PanelOverlayProps & import("react").RefAttributes<HTMLDivElement>>;
