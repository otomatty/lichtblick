# SonarCloud ワークフロー

## 概要

SonarCloudを使用したコード品質分析とセキュリティ分析を自動実行するワークフロー。
コードの品質問題、セキュリティ脆弱性、テストカバレッジを継続的に監視する。

## トリガー条件

- `main` ブランチへのプッシュ
- プルリクエストの作成・同期・再オープン
- 手動実行（`workflow_dispatch`）

## 実行内容

### 1. 環境セットアップ

- Ubuntu環境で実行
- Node.js 20をセットアップ
- Yarnパッケージマネージャーを有効化

### 2. 依存関係のインストール

- キャッシュを活用した高速インストール
- キャッシュキー: `v5-ubuntu-yarn-<yarn.lock-hash>`

### 3. コード品質チェック

- ESLintによる静的解析実行
- レポートファイルのパス修正（CI環境対応）
- エラーが発生しても続行（`continue-on-error: true`）

### 4. テストとカバレッジ

- 単体テスト実行
- カバレッジレポート生成
- エラーが発生しても続行

### 5. SonarCloud分析

- コード品質、セキュリティ、重複コードの分析
- テストカバレッジ結果の送信
- 分析結果をSonarCloudダッシュボードに反映

## 必要な設定

### シークレット

- `SONAR_TOKEN`: SonarCloud認証トークン
- `SONAR_HOST_URL`: SonarCloudサーバーURL（変数として設定）

### 前提条件

- SonarCloudプロジェクトが設定済み
- プロジェクトルートに`sonar-project.properties`が存在

## 注意点

- 失敗してもワークフローは継続される設定
- Shallow clone無効（`fetch-depth: 0`）で分析精度を向上
- パスの正規化でローカル環境とCI環境の差異を解消

## 活用方法

- プルリクエスト時の品質チェック
- mainブランチの継続的な品質監視
- 技術的負債の可視化と改善指標として使用
