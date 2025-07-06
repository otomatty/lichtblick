import React from "react";
import { MosaicNode } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
/**
 * UnconnectedPanelLayoutコンポーネントのプロパティ型定義
 */
type Props = {
    /** Mosaicレイアウトの構造定義（undefinedの場合は空レイアウト） */
    layout?: MosaicNode<string>;
    /** レイアウト変更時のコールバック関数 */
    onChange: (panels: MosaicNode<string> | undefined) => void;
    /** 読み込み中に表示するコンポーネント（拡張機能インストール時等） */
    loadingComponent?: React.JSX.Element;
    /** 所属するタブのID（タブ内レイアウトの場合） */
    tabId?: string;
};
/**
 * 未接続パネルレイアウトコンポーネント
 *
 * レイアウト状態に直接接続されていない、純粋なレイアウトコンポーネント。
 * テストやタブ内レイアウトなど、外部から状態を注入したい場合に使用。
 *
 * ## 主要機能
 *
 * ### パネル管理
 * - パネルカタログからの動的コンポーネント読み込み
 * - React.lazyによる遅延ローディング
 * - 未知のパネルタイプに対するフォールバック
 *
 * ### レイアウト制御
 * - Mosaicによる分割可能なレイアウト
 * - 最小パネルサイズ2%の制約
 * - ドラッグ&ドロップによる動的配置変更
 *
 * ### エラーハンドリング
 * - Suspenseによる読み込み中の適切な表示
 * - ErrorBoundaryによる障害分離
 * - PanelRemounterによる安全な再マウント
 *
 * @param props - コンポーネントプロパティ
 * @returns レンダリングされたパネルレイアウト
 */
export declare function UnconnectedPanelLayout(props: Readonly<Props>): React.ReactElement;
/**
 * パネルレイアウトメインコンポーネント
 *
 * Lichtblickアプリケーションのメインレイアウトシステム。
 * CurrentLayoutContextと連携し、アプリケーション全体の
 * パネル配置とレイアウト管理を担当する。
 *
 * ## 機能概要
 *
 * ### 状態管理統合
 * - CurrentLayoutContextからレイアウト状態を取得
 * - レイアウト変更の自動永続化
 * - 拡張機能の読み込み状態監視
 *
 * ### 条件分岐レンダリング
 * - 拡張機能未読み込み時：ExtensionsLoadingState
 * - 拡張機能インストール中：オーバーレイ表示
 * - レイアウト存在時：UnconnectedPanelLayout
 * - レイアウト未設定時：カスタム空状態またはデフォルト
 *
 * ### パフォーマンス最適化
 * - useCallbackによるコールバック最適化
 * - セレクターによる必要な状態のみの購読
 * - 条件分岐による不要なレンダリング回避
 *
 * ## 使用方法
 *
 * ```typescript
 * // アプリケーションのメインレイアウトとして
 * function App() {
 *   return (
 *     <CurrentLayoutProvider>
 *       <PanelLayout />
 *     </CurrentLayoutProvider>
 *   );
 * }
 * ```
 *
 * @returns メインパネルレイアウトコンポーネント
 *
 * @author Lichtblick Team
 * @since 2023
 */
export default function PanelLayout(): React.JSX.Element;
export {};
