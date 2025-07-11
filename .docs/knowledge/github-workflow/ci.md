# CI (継続的インテグレーション) ワークフロー

## 概要

コードの品質を継続的に検証する包括的なCIワークフロー。
リント、テスト、ビルド、E2Eテストを並行実行し、高速で信頼性の高い検証を提供。

## トリガー条件

- `main` ブランチへのプッシュ
- `release/*` ブランチへのプッシュ
- すべてのプルリクエスト

## 実行内容

### テストジョブ (test)

マトリックス戦略で複数の検証タスクを並行実行

#### 実行環境

- **メインOS**: Ubuntu (Linux)
- **追加OS**: Windows (パッケージビルドのみ)
- **Node.js**: バージョン20
- **高速化**: fail-fastを無効化し、一部失敗でも他を継続

#### 検証内容

**1. Lint検証**

- ライセンスチェック
- 依存関係の重複チェック（dedupe）
- TypeScript型チェック（tsc --noEmit）
- ESLint静的解析
- 未使用エクスポートの検出
- 依存関係の問題チェック

**2. パッケージビルド**

- 共通パッケージのビルド検証
- 内部ライブラリの整合性確認

**3. Webビルド**

- プロダクション環境向けWebアプリケーションビルド
- 静的ファイル生成の検証

**4. デスクトップビルド**

- Electronアプリケーションのビルド
- クロスプラットフォーム対応の検証

**5. ベンチマークビルド**

- パフォーマンステスト用ビルド
- 性能測定環境の準備

**6. 単体テスト**

- Jest実行（maxWorkers=100%で高速化）
- 全テストスイートの実行

#### キャッシュ戦略

- **キャッシュパス**: `.yarn/cache`, `**/node_modules`
- **キャッシュキー**: `v5-{OS}-yarn-{yarn.lock-hash}`
- **復元キー**: `v5-{OS}-yarn-`

### E2Eテストジョブ (e2e)

エンドツーエンドテストの実行

#### 環境設定

- Ubuntu Linux環境
- Node.js 20
- Playwright使用
- Xvfb（仮想ディスプレイ）で GUI テスト実行

#### 特殊設定

- **AppArmor修正**: Playwright実行のためのカーネル設定調整
- **仮想ディスプレイ**: ヘッドレス環境でのGUIテスト対応

#### 実行内容

1. デスクトップアプリのプロダクションビルド
2. Electronアプリケーションの統合テスト
3. 実際のユーザー操作シナリオの検証

## 必要な設定

### 権限

- デフォルトのGitHub権限で実行可能
- 外部APIアクセス不要

### 環境変数

- 特別な環境変数設定不要
- Node.js環境のみ必要

## 高速化の仕組み

### 並列実行

- 複数のマトリックスジョブを同時実行
- テストとビルドの並列処理

### キャッシュ活用

- 依存関係のキャッシュで時間短縮
- バージョン管理されたキャッシュキー

### 効率的なワーカー設定

- テスト時のワーカー数最適化
- CPUリソースの最大活用

## 注意点

- Windows環境ではパッケージビルドのみ実行
- E2Eテストは Linux 環境限定
- 失敗時は該当ジョブのみ停止（他は継続）
- AppArmor設定がPlaywright実行に必要

## 品質ゲート

- 全ての検証ステップがPassで成功
- 単一の失敗でマージをブロック
- プルリクエストの品質保証

## 最適化提案

- テスト並列度の調整
- キャッシュ戦略の見直し
- 重要度によるジョブ優先度設定

## 運用上の利点

- 高速なフィードバック
- 包括的な品質検証
- 開発効率の向上
- バグの早期発見
