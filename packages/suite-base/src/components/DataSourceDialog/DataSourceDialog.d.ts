/// <reference types="react" />
/**
 * データソースダイアログで表示可能なビューの種類
 *
 * - `start`: スタート画面（デフォルト）
 * - `file`: ファイル選択ダイアログ
 * - `demo`: サンプルデータ自動選択
 * - `remote`: リモート接続（将来の拡張用）
 * - `connection`: リモート接続設定画面
 */
export type DataSourceDialogItem = "start" | "file" | "demo" | "remote" | "connection";
/**
 * DataSourceDialogコンポーネントのプロパティ型
 */
type DataSourceDialogProps = {
    /**
     * 背景アニメーション（雪やコンフェッティ）の有効/無効
     *
     * `false`に設定すると、シーズナルエフェクトが無効化されます。
     * テスト環境やパフォーマンス重視の環境で使用します。
     *
     * @default true
     */
    backdropAnimation?: boolean;
};
/**
 * DataSourceDialog メインコンポーネント
 *
 * データソース接続のための統合ダイアログインターフェースを提供します。
 * 複数のビューモード（Start、Connection）を切り替えながら、
 * ユーザーのデータソース選択をサポートします。
 *
 * ## 主要な処理フロー
 *
 * 1. **初期化**: WorkspaceContextから現在の状態を取得
 * 2. **ビュー切り替え**: activeViewに基づいて適切なコンポーネントを表示
 * 3. **ファイル選択**: "file"モードでネイティブファイルダイアログを開く
 * 4. **サンプル選択**: "demo"モードで最初のサンプルデータを自動選択
 * 5. **エフェクト**: 季節に応じた背景エフェクトの表示
 *
 * ## 状態管理の詳細
 *
 * - **activeView**: 現在表示中のビュー（start/connection/demo/file）
 * - **activeDataSource**: 現在選択されているデータソース
 * - **availableSources**: 利用可能なデータソース一覧
 *
 * @param props - コンポーネントプロパティ
 * @returns レンダリングされたダイアログコンポーネント
 */
export declare function DataSourceDialog(props: DataSourceDialogProps): React.JSX.Element;
export {};
