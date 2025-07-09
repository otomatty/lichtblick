# Lichtblick v1.17.0 アップデートレポート

## 概要

このドキュメントは、Lichtblick v1.16.0 から v1.17.0 へのアップデートにおける変更内容をまとめたものです。

**アップデート日**: 2025年7月9日
**対象バージョン**: v1.16.0 → v1.17.0
**総コミット数**: 30件
**変更ファイル数**: 48件

## 主要な新機能・改善

### 1. 🖼️ Image Panel の輝度・コントラスト調整機能

**PR #570**: Adding brightness and contrast adjustment settings to Image panel

- **機能**: Image パネルで画像の輝度とコントラストを調整できる機能を追加
- **影響範囲**:
  - `packages/suite-base/src/panels/ThreeDeeRender/renderables/ImageMode/`
  - 新しいユーティリティ関数とテストを追加
- **メリット**: 画像の視認性向上、デバッグ時の利便性向上

### 2. 🔧 Desktop Extension Handler のリファクタリング

**PR #542**: Feature/Refactor desktop extension handler with tests

- **変更内容**:
  - `packages/suite-desktop/src/preload/extensions.ts` → `ExtensionHandler.ts` に変更
  - 包括的なテストスイートを追加（695行のテストコード）
- **改善点**:
  - コードの可読性向上
  - テストカバレッジの大幅向上
  - エラーハンドリングの改善

### 3. 🌐 Web版リリースファイルの追加

**PR #573**: Add web version static files to release

- **機能**: Web版の静的ファイルをリリースに含める機能を追加
- **影響**: リリースプロセスの改善

## バグ修正

### 1. 🐛 RawMessage Panel の空オブジェクト表示問題

**PR #556**: Fix empty 'before object' on RawMessage panel

- **問題**: RawMessage パネルで空の 'before object' が表示される問題
- **修正**: `packages/suite-base/src/panels/RawMessages/getDiff.ts` の修正
- **影響**: データ表示の正確性向上

### 2. 📱 タッチデバイスでのパネルメニュー問題

**PR #559**: Fix Change panel menu not working properly on touch devices

- **問題**: タッチデバイスでパネルメニューが正常に動作しない
- **修正**: タッチイベントの処理を改善
- **影響**: モバイル・タブレットでの使用性向上

## UI/UX 改善

### 1. 📏 左サイドバーの最小幅設定

**PR #550**: Minimum width to left sidebar

- **改善**: 左サイドバーに最小幅を設定し、レイアウトの安定性を向上
- **影響**: UI の一貫性向上

### 2. 📄 大きなファイル警告メッセージの更新

**PR #552**: Updating large files warning message

- **改善**: 大きなファイルを開く際の警告メッセージを更新
- **影響**: ユーザビリティの向上

### 3. 🔗 ドキュメントリンクの更新

**PR #553**: Documentation links updated

- **改善**: アプリケーション内のドキュメントリンクを最新版に更新
- **影響**: ヘルプ機能の改善

## 技術的改善

### 1. 🏗️ Node.js 20 対応

**PR #572**: chore: update Node.js version to 20 in SonarCloud workflow

- **変更**: SonarCloud ワークフローで Node.js 20 を使用
- **影響**: 開発環境の最新化

### 2. 📦 依存関係の大幅更新

以下の主要な依存関係が更新されました：

#### Jest グループ (#569)

- Jest 関連パッケージを最新版に更新
- テスト実行の安定性向上

#### Storybook グループ (#560)

- Storybook 関連パッケージを最新版に更新
- コンポーネント開発環境の改善

#### Electron (#565)

- Electron 36.3.2 → 37.1.0
- セキュリティとパフォーマンスの向上

#### その他の依存関係

- `@babel/core`: 7.27.4 → 7.27.7
- `tslib`: 2.6.2 → 2.8.1
- `uuid`: 9.0.1 → 11.1.0
- `webpack-dev-server`: 5.2.1 → 5.2.2
- `moment-timezone`: 0.5.43 → 0.6.0
- `pbkdf2`: 3.1.2 → 3.1.3 (セキュリティ修正)

## 削除された機能

### 1. HelpMenu コンポーネントの削除

- **削除対象**: `packages/suite-base/src/components/AppBar/HelpMenu.tsx`
- **理由**: upstream での機能統合により不要になった
- **影響**: アプリケーションの簡素化

### 2. TabSpacer コンポーネントの削除

- **削除対象**: `packages/suite-base/src/components/Sidebars/TabSpacer.tsx`
- **理由**: 新しいサイドバー実装により不要になった
- **影響**: コードベースの整理

## ファイル構造の変更

### 新規追加ファイル

```
packages/suite-base/src/components/Sidebars/
├── constants.ts                    # サイドバー定数
├── index.style.ts                  # スタイル定義
├── utils.test.ts                   # ユーティリティテスト
└── utils.ts                        # ユーティリティ関数

packages/suite-base/src/panels/ThreeDeeRender/renderables/ImageMode/
├── types.ts                        # 型定義
├── utils.test.ts                   # ユーティリティテスト
└── utils.ts                        # ユーティリティ関数

packages/suite-desktop/src/preload/
├── ExtensionHandler.test.ts        # 拡張ハンドラーテスト
└── ExtensionHandler.ts             # 拡張ハンドラー実装
```

### 削除ファイル

```
packages/suite-base/src/components/AppBar/HelpMenu.tsx
packages/suite-base/src/components/Sidebars/TabSpacer.tsx
packages/suite-desktop/src/preload/extensions.test.ts
packages/suite-desktop/src/preload/extensions.ts
```

## 影響範囲分析

### 高影響

1. **Image Panel**: 輝度・コントラスト調整機能の追加
2. **Desktop Extension Handler**: 大幅なリファクタリング
3. **依存関係**: Electron、Jest、Storybook の更新

### 中影響

1. **RawMessage Panel**: 表示問題の修正
2. **タッチデバイス**: メニュー操作の改善
3. **サイドバー**: 最小幅設定とコンポーネント整理

### 低影響

1. **警告メッセージ**: テキストの更新
2. **ドキュメントリンク**: URL の更新
3. **ビルドプロセス**: Node.js 20 対応

## 互換性情報

### 破壊的変更

- **なし**: このアップデートに破壊的変更は含まれていません

### 非推奨機能

- **HelpMenu コンポーネント**: 削除済み
- **TabSpacer コンポーネント**: 削除済み

### 新規要件

- **Node.js**: 開発環境で Node.js 20 を推奨
- **Electron**: 37.1.0 に更新

## テスト状況

### 新規追加テスト

- `ExtensionHandler.test.ts`: 695行の包括的テスト
- `utils.test.ts` (Sidebars): サイドバーユーティリティテスト
- `utils.test.ts` (ImageMode): 画像モードユーティリティテスト

### テストカバレッジ

- Desktop Extension Handler: 大幅なカバレッジ向上
- Image Panel: 新機能のテストを追加
- RawMessage Panel: バグ修正のテストを追加

## パフォーマンス影響

### 改善点

1. **Electron 37.1.0**: パフォーマンスとセキュリティの向上
2. **依存関係最新化**: 全体的な動作速度向上
3. **コード整理**: 不要なコンポーネント削除によるバンドルサイズ削減

### 注意点

- 新機能（輝度・コントラスト調整）により、Image Panel の処理負荷が若干増加する可能性

## 移行手順

### 開発者向け

1. **依存関係の更新**: `yarn install` で最新の依存関係を取得
2. **ビルド確認**: `yarn build:packages` でビルドエラーがないことを確認
3. **テスト実行**: `yarn test` で既存テストが通ることを確認

### エンドユーザー向け

- **特別な操作は不要**: 通常のアップデート手順で問題ありません
- **新機能**: Image Panel で輝度・コントラスト調整が利用可能

## 今後の推奨事項

1. **定期的な依存関係更新**: セキュリティとパフォーマンスの維持
2. **テストカバレッジの向上**: 新機能に対するテストの継続的な追加
3. **Node.js 20 移行**: 開発環境の最新化

## 参考リンク

- [Lichtblick GitHub Repository](https://github.com/lichtblick-suite/lichtblick)
- [v1.16.0...v1.17.0 比較](https://github.com/lichtblick-suite/lichtblick/compare/v1.16.0...v1.17.0)
- [リリースノート v1.17.0](https://github.com/lichtblick-suite/lichtblick/releases/tag/v1.17.0)

---

**作成日**: 2025年1月8日
**作成者**: システム管理者
**最終更新**: 2025年1月8日
