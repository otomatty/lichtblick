// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
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
export function migrateV0WorkspaceState(oldState, _version) {
    // 現在はv0のみが廃止されたバージョン
    // 今後のマイグレーションではバージョン番号を考慮する必要がある
    const v0State = oldState;
    // 新しい構造に変換
    const migrated = {
        // ダイアログ状態を新構造に再編成
        dialogs: {
            dataSource: {
                activeDataSource: undefined,
                item: undefined,
                open: false,
            },
            preferences: {
                initialTab: undefined,
                open: false,
            },
        },
        // 機能ツアー状態（表示済みリストのみ保持）
        featureTours: {
            active: undefined,
            shown: v0State.featureTours.shown,
        },
        // サイドバー状態を構造化オブジェクトに変換
        sidebars: {
            left: {
                item: v0State.leftSidebarItem,
                open: v0State.leftSidebarOpen,
                size: v0State.leftSidebarSize,
            },
            right: {
                item: v0State.rightSidebarItem,
                open: v0State.rightSidebarOpen,
                size: v0State.rightSidebarSize,
            },
        },
        // 再生コントロール設定（新機能のデフォルト値を追加）
        playbackControls: {
            repeat: v0State.playbackControls.repeat,
            syncInstances: false, // 新機能のデフォルト値
        },
    };
    return migrated;
}
