import { WorkspaceContextStore } from "@lichtblick/suite-base/context/Workspace/WorkspaceContext";
/**
 * ワークスペース状態をバージョン0から現在のバージョンにマイグレーション
 *
 * アプリケーションの更新時に、既存のユーザー設定を新しい構造に
 * 自動的に変換するためのマイグレーション関数。
 *
 * マイグレーション内容:
 * - サイドバー状態を個別プロパティから構造化オブジェクトに変換
 * - ダイアログ状態を新しい構造に再編成
 * - 新機能（syncInstances）のデフォルト値を設定
 * - 表示済みツアーリストを保持
 *
 * @param oldState 旧バージョンの状態データ
 * @param _version バージョン番号（現在は未使用）
 * @returns 新しい構造に変換された状態データ
 *
 * 使用例:
 * ```typescript
 * // Zustandの永続化機能で自動的に呼び出される
 * const store = create<WorkspaceContextStore>(
 *   persist(
 *     (set, get) => ({ ... }),
 *     {
 *       name: 'workspace-state',
 *       migrate: migrateV0WorkspaceState,
 *     }
 *   )
 * );
 * ```
 */
export declare function migrateV0WorkspaceState(oldState: unknown, _version: number): WorkspaceContextStore;
