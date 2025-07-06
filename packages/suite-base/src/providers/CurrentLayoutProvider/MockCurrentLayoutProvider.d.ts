/// <reference types="react" />
import { LayoutData, PanelsActions } from "@lichtblick/suite-base/context/CurrentLayoutContext/actions";
/**
 * テスト・開発用モックレイアウトプロバイダー
 *
 * CurrentLayoutProviderの軽量版モック実装です。実際のレイアウト管理機能を
 * 簡略化し、テスト環境や開発時のプロトタイピングで使用されます。
 *
 * ## 主な機能
 * - 基本的なレイアウト状態管理
 * - パネル操作アクション（追加、削除、設定保存等）
 * - インメモリでの状態保持
 * - レイアウト永続化機能の無効化
 *
 * ## 本家との違い
 * - **永続化なし**: レイアウトの保存・読み込み機能なし
 * - **簡略化**: 複雑な非同期処理や外部依存関係を除去
 * - **テスト特化**: 予測可能な動作でテストを容易に
 * - **軽量**: 最小限の機能のみ実装
 * - **同期処理**: 全アクションを同期的に実行
 *
 * ## 使用場面
 * - **ユニットテスト**: パネル機能の単体テスト
 * - **統合テスト**: レイアウト関連機能のテスト
 * - **Storybook**: UIコンポーネントの表示確認
 * - **開発プロトタイプ**: 新機能の検証
 *
 * ## 状態管理
 * - `useState`による基本的な状態管理
 * - `useRef`による状態参照の最適化
 * - reducerパターンによるアクション処理
 * - リスナーパターンによる状態変更通知
 *
 * ## パフォーマンス最適化
 * - `useCallback`による関数メモ化
 * - `useMemo`による計算結果キャッシュ
 * - `useShallowMemo`による浅い比較最適化
 * - 不要な再レンダリングの防止
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @param props.initialState - 初期レイアウト状態の部分データ
 * @param props.onAction - アクション実行時のコールバック関数
 * @returns React.JSX.Element - モックプロバイダーコンポーネント
 *
 * @example
 * ```typescript
 * // テストでの基本的な使用
 * <MockCurrentLayoutProvider>
 *   <PanelComponent />
 * </MockCurrentLayoutProvider>
 *
 * // カスタム初期状態での使用
 * const initialState = {
 *   configById: { "3D!test": { cameraState: {...} } },
 *   layout: { first: "3D!test", second: undefined, direction: "row" }
 * };
 *
 * <MockCurrentLayoutProvider
 *   initialState={initialState}
 *   onAction={(action) => console.log('Action:', action)}
 * >
 *   <TestComponent />
 * </MockCurrentLayoutProvider>
 * ```
 *
 * @see CurrentLayoutProvider - 本家プロバイダー実装
 * @see panelsReducer - パネル操作処理
 * @see ICurrentLayout - レイアウトコンテキストインターフェース
 */
export default function MockCurrentLayoutProvider({ children, initialState, onAction, }: React.PropsWithChildren<{
    initialState?: Partial<LayoutData>;
    onAction?: (action: PanelsActions) => void;
}>): React.JSX.Element;
