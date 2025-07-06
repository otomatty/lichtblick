/// <reference types="react" />
/**
 * アカウント設定サイドバーのメインコンポーネント
 *
 * 機能概要:
 * - ユーザーのログイン状態に基づいて適切なコンポーネントを表示
 * - ログイン済み: AccountInfoコンポーネント（ユーザー情報とサインアウト機能）
 * - 未ログイン: SigninFormコンポーネント（サインイン促進UI）
 * - SidebarContentでラップしてサイドバーレイアウトを提供
 *
 * アーキテクチャ:
 * - 条件分岐によるコンポーネント切り替え
 * - useMemoによるレンダリング最適化
 * - CurrentUserContextとの連携
 *
 * @returns アカウント設定サイドバーのUI
 */
export default function AccountSettings(): React.JSX.Element;
