/// <reference types="react" />
/**
 * ユーザープロファイルをlocalStorageで管理するProvider
 *
 * @description
 * このProviderは以下の機能を提供します：
 * - ユーザープロファイル情報のlocalStorageへの永続化
 * - プロファイルデータの非同期読み込み・書き込み
 * - 初回起動時のタイムスタンプ記録
 * - プロファイルデータの部分更新とマージ機能
 *
 * @features
 * - **永続化**: ブラウザのlocalStorageを使用してデータを保存
 * - **初回起動検出**: firstSeenTimeとfirstSeenTimeIsFirstLoadフラグで初回起動を判定
 * - **部分更新**: 既存データを保持しながら新しいデータをマージ
 * - **型安全性**: TypeScriptによる型チェックでデータの整合性を保証
 *
 * @usage
 * ```tsx
 * <UserProfileLocalStorageProvider>
 *   <App />
 * </UserProfileLocalStorageProvider>
 * ```
 *
 * @context UserProfileStorageContext - ユーザープロファイルの読み書き機能を提供
 */
export default function UserProfileLocalStorageProvider({ children, }: React.PropsWithChildren): React.JSX.Element;
