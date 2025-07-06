/// <reference types="react" />
import { LayoutLoader } from "@lichtblick/suite-base/services/ILayoutLoader";
/**
 * CurrentLayoutProvider
 *
 * Lichtblick Suiteの中核となるレイアウト管理システムのメインProviderです。
 * レイアウトの永続化、状態管理、パネル操作、ドラッグ&ドロップなど、
 * アプリケーションのUI構成に関するすべての機能を統合管理します。
 *
 * ## 主要機能
 *
 * ### 1. レイアウト管理
 * - **自動復元**: ユーザープロファイルからの前回レイアウト復元
 * - **永続化**: レイアウト変更の自動保存
 * - **バージョン管理**: レイアウトの後方互換性保証
 * - **デフォルトレイアウト**: 初回起動時の標準レイアウト提供
 *
 * ### 2. パネル操作
 * - **CRUD操作**: パネルの追加・削除・更新・交換
 * - **分割・統合**: パネルの分割とタブ化
 * - **ドラッグ&ドロップ**: 直感的なパネル配置
 * - **設定管理**: パネル個別設定の保存・復元
 *
 * ### 3. 状態管理
 * - **選択状態**: パネル選択状態の追跡
 * - **共有状態**: パネル間での状態共有
 * - **グローバル変数**: アプリケーション全体の変数管理
 * - **ユーザースクリプト**: カスタムスクリプトの管理
 *
 * ### 4. 高度な機能
 * - **タブパネル**: 複数パネルのタブ切り替え
 * - **ネストレイアウト**: 複雑な階層構造のサポート
 * - **アナリティクス**: ユーザー操作の追跡・分析
 * - **エラーハンドリング**: 堅牢なエラー処理と復旧
 *
 * ## アーキテクチャ
 *
 * ### React Mosaic基盤
 * - 分割可能なレイアウトシステム
 * - ドラッグ&ドロップサポート
 * - 動的リサイズ機能
 *
 * ### 関数型状態管理
 * - Reducerパターンによる予測可能な状態更新
 * - Immutable更新による最適化
 * - 型安全な操作保証
 *
 * ### 非同期処理
 * - レイアウトの非同期読み込み
 * - エラー時の適切なフォールバック
 * - ユーザー体験の向上
 *
 * ## パフォーマンス最適化
 * - **メモ化**: 重い計算の結果キャッシュ
 * - **参照等価性**: 不要な再レンダリング防止
 * - **遅延評価**: 必要時のみ処理実行
 * - **バッチ更新**: 複数操作の一括処理
 *
 * ## 使用例
 * ```typescript
 * // アプリケーションルートでの使用
 * <CurrentLayoutProvider loaders={[customLoader]}>
 *   <MainApplication />
 * </CurrentLayoutProvider>
 *
 * // 子コンポーネントでの使用
 * const layout = useCurrentLayoutActions();
 * layout.addPanel({ id: "panel1", config: {} });
 * ```
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @param props.loaders - カスタムレイアウトローダー
 * @returns React.JSX.Element
 *
 * @see CurrentLayoutContext - 提供されるコンテキスト
 * @see panelsReducer - 状態更新ロジック
 * @see LayoutManager - レイアウト永続化
 */
export default function CurrentLayoutProvider({ children, loaders, }: React.PropsWithChildren<{
    loaders?: readonly LayoutLoader[];
}>): React.JSX.Element;
