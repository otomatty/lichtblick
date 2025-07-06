/**
 * useTopicListStyles - TopicList関連コンポーネント用スタイリングフック
 *
 * @description
 * このフックは、TopicList、TopicRow、MessagePathRowで使用される
 * 統一されたスタイリングシステムを提供します。Material-UIテーマと
 * 連動したレスポンシブデザインとインタラクション状態を管理します。
 *
 * **主要スタイル機能:**
 * - 🎨 テーマ連動の配色システム
 * - 🖱️ ホバー・選択・ドラッグ状態の視覚的フィードバック
 * - 📱 コンテナクエリによるレスポンシブデザイン
 * - 🌗 ダークモード対応
 * - 🎯 アクセシビリティ配慮
 *
 * **提供するスタイルクラス:**
 *
 * **1. row - 基本行スタイル:**
 * - フレックスレイアウト
 * - ホバー時のドラッグハンドル表示
 * - 選択状態の背景色変更
 * - ボーダー・シャドウによる境界線
 *
 * **2. selected - 選択状態:**
 * - プライマリカラーでの背景色変更
 * - ダークモードでの境界線強調
 * - 不透明度を考慮した色合成
 *
 * **3. isDragging - ドラッグ状態:**
 * - ドラッグ中の視覚的フィードバック
 * - 選択状態と同様のスタイル適用
 *
 * **4. dragHandle - ドラッグハンドル:**
 * - 通常時は非表示、ホバー時に表示
 * - 選択時はプライマリカラーで強調
 * - 狭い幅では完全に非表示（280px以下）
 *
 * **5. fieldRow - メッセージパス行:**
 * - トピック行と区別するための背景色
 * - より薄い境界線
 *
 * **6. その他のユーティリティクラス:**
 * - countBadge: 複数選択時のバッジ
 * - textContent: テキストの最大幅制御
 * - aliasedTopicName: エイリアストピック名のスタイル
 *
 * **レスポンシブ機能:**
 * - コンテナクエリ（@container）による幅ベースの表示制御
 * - 280px以下でドラッグハンドル非表示
 *
 * **色彩システム:**
 * - tinycolor2による色合成
 * - テーマの不透明度設定を考慮
 * - ダークモードでの適切なコントラスト
 *
 * **使用例:**
 * ```typescript
 * const { classes, cx } = useTopicListStyles();
 *
 * <div className={cx(classes.row, {
 *   [classes.selected]: isSelected,
 *   [classes.isDragging]: isDragging
 * })}>
 *   <div className={classes.dragHandle}>⋮</div>
 * </div>
 * ```
 *
 * **依存関係:**
 * - tss-react/mui: Material-UI統合スタイリング
 * - tinycolor2: 色操作ライブラリ
 * - Material-UI Badge: バッジコンポーネントのクラス
 *
 * @returns スタイルクラスとユーティリティ関数
 */
export declare const useTopicListStyles: (params: void, styleOverrides?: {
    props: any;
    ownerState?: Record<string, unknown> | undefined;
} | undefined) => {
    classes: Record<"row" | "selected" | "isDragging" | "dragHandle" | "fieldRow" | "countBadge" | "textContent" | "aliasedTopicName", string>;
    theme: import("@mui/material").Theme;
    css: import("tss-react").Css;
    cx: import("tss-react").Cx;
};
