import { LayoutID } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { ILayoutStorage, Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
/**
 * IndexedDBにレイアウトを保存するストレージ実装
 *
 * すべてのレイアウトは単一のオブジェクトストアに保存され、
 * プライマリキーは[namespace, id]のタプルとなる
 *
 * 【パフォーマンス特性】
 * - 読み取り: O(log n) - インデックスによる高速検索
 * - 書き込み: O(log n) - B-treeによる効率的な挿入
 * - 削除: O(log n) - キーによる直接削除
 *
 * 【容量制限】
 * - LocalStorage: ~5-10MB（ブラウザ依存）
 * - IndexedDB: ~50MB〜無制限（ユーザー許可により拡張可能）
 */
export declare class IdbLayoutStorage implements ILayoutStorage {
    #private;
    /**
     * 指定された名前空間のすべてのレイアウトを取得
     *
     * @param namespace レイアウトの名前空間
     * @returns レイアウトの配列（読み取り専用）
     *
     * @example
     * ```typescript
     * const personalLayouts = await storage.list('personal');
     * const orgLayouts = await storage.list('org:123');
     * ```
     */
    list(namespace: string): Promise<readonly Layout[]>;
    /**
     * 指定されたレイアウトを取得
     *
     * @param namespace レイアウトの名前空間
     * @param id レイアウトID
     * @returns レイアウト、存在しない場合は`undefined`
     *
     * @example
     * ```typescript
     * const layout = await storage.get('personal', 'my-layout-id');
     * if (layout) {
     *   console.log('レイアウト名:', layout.name);
     * }
     * ```
     */
    get(namespace: string, id: LayoutID): Promise<Layout | undefined>;
    /**
     * レイアウトを保存（新規作成または更新）
     *
     * @param namespace レイアウトの名前空間
     * @param layout 保存するレイアウト
     * @returns 保存されたレイアウト
     *
     * @example
     * ```typescript
     * const newLayout = {
     *   id: 'my-layout',
     *   name: 'My Layout',
     *   // ... その他のプロパティ
     * };
     * await storage.put('personal', newLayout);
     * ```
     */
    put(namespace: string, layout: Layout): Promise<Layout>;
    /**
     * レイアウトを削除
     *
     * @param namespace レイアウトの名前空間
     * @param id 削除するレイアウトID
     *
     * @example
     * ```typescript
     * await storage.delete('personal', 'unused-layout-id');
     * ```
     */
    delete(namespace: string, id: LayoutID): Promise<void>;
    /**
     * レイアウトを別の名前空間にインポート（移動）
     *
     * 主にユーザーログイン時にローカルレイアウトを個人レイアウトに変換する際に使用
     *
     * @param params インポートパラメータ
     * @param params.fromNamespace 移動元の名前空間
     * @param params.toNamespace 移動先の名前空間
     *
     * @example
     * ```typescript
     * // ローカルレイアウトを個人レイアウトに移行
     * await storage.importLayouts({
     *   fromNamespace: 'local',
     *   toNamespace: 'personal:user123'
     * });
     * ```
     */
    importLayouts({ fromNamespace, toNamespace, }: {
        fromNamespace: string;
        toNamespace: string;
    }): Promise<void>;
    /**
     * 名前空間化されていない古いレイアウトを移行
     *
     * IdbLayoutStorage作成時点では、すべてのレイアウトが
     * 既に名前空間化されているため、実際の移行処理は不要
     *
     * @param namespace 移行先の名前空間（使用されない）
     */
    migrateUnnamespacedLayouts(namespace: string): Promise<void>;
}
