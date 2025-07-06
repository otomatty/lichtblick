/// <reference types="react" />
import { User } from "@lichtblick/suite-base/context/CurrentUserContext";
/**
 * AccountInfoコンポーネントのProps型定義
 * @interface Props
 * @property {User} [currentUser] - 現在ログインしているユーザー情報（オプショナル）
 */
export interface Props {
    currentUser?: User;
}
/**
 * ログイン済みユーザーのアカウント情報表示コンポーネント
 *
 * 主な機能:
 * - ユーザー情報の表示（メールアドレス、組織名）
 * - アカウント設定ページへのリンク
 * - サインアウト機能（確認ダイアログ付き）
 * - 非同期処理のローディング状態管理
 * - エラーハンドリングとユーザー通知
 *
 * @param props - コンポーネントのプロパティ
 * @returns ログイン済みユーザーのアカウント情報UI
 */
export default function AccountInfo(props: Props): React.JSX.Element;
