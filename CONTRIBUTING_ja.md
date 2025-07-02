# 貢献ガイドライン

Lichtblickへの貢献にご興味をお持ちいただき、ありがとうございます！私たちはあなたの貢献を大切にし、貢献体験を楽しく、やりがいのあるものにしたいと考えています。以下に開始方法をご説明します：

## :rocket: 始め方

[README.md](README.md)をご確認の上、インストール手順に従ってください。

#### その他の便利なコマンド

```sh
# ストーリーブックを起動
$ yarn storybook
```

```sh
# 高度な使用法：同一ネットワーク上の異なるコンピュータ（またはVM）でwebpackとelectronを実行
$ yarn desktop:serve --host 192.168.xxx.yyy # electronがwebpack dev serverに到達できるアドレス
$ yarn dlx electron@22.1.0 .webpack # 現在のコンピュータのプラットフォーム用のelectronバージョンを起動
```

```sh
$ yarn run               # 利用可能なコマンドを一覧表示
$ yarn lint              # 全ファイルをlint
$ yarn test              # 全テストを実行
$ yarn test:watch        # 変更されたファイルのテストを実行
$ yarn test:e2e:desktop  # 全e2eテストを実行
```

## :herb: 新しいブランチの作成

このリポジトリでブランチを作成する際は、以下のガイドラインに従い、各ブランチの目的が明確で適切に定義されていることを確認してください：

- `feature` : 新機能の追加、既存機能の変更、または古い機能の削除を行う際にこのブランチを作成します。
- `bugfix` : 既存機能で発見されたバグを解決するためのブランチです。
- `hotfix` : 重要な問題を迅速に対処するために使用します。これは通常、即座に注意が必要な一時的な解決策の実装を含みます。
- `test` : 実験的な変更を行う際に使用します。主な目標は特定の問題に対処することなく、新しいアイデアを探索したり、解決策をテストしたりすることです。
- `docs` : ドキュメントの更新と改善を行う際にこのブランチを指定し、ユーザーにとって最新で有用な情報を確保します。
- `wip`（Work In Progress）: メインブランチにマージする準備がまだできていない進行中の開発作業に使用します。
- `cicd` : ci/cdパイプラインスクリプトの変更に使用します。

### 例

`feature/new-menu-foo`

`test/create-unit-test-for-component-bar`

## :label: バージョンアップ

セマンティックバージョニングを、様々なソフトウェアプロジェクトで広く採用されているバージョンアップの標準方法として選択しました。バージョン形式は以下のように構成されています：
`<major>.<minor>.<patch>[.<ビルド番号>]`

- _注意：現在、バージョンアップのプロセスは手動です。開発者はpackage.jsonファイルのバージョン番号を手動で更新する必要があります。このタスクの自動化パイプラインは開発中で、将来このプロセスを合理化するために実装される予定です。_

### 構成要素

MAJOR：メジャーバージョンの増加は通常、互換性を破り、開発者が非推奨のAPIを削除したり、既存のAPIを再作業したりできるようになります。ユーザーはこれを知っており、スムーズな更新は期待していません。

MINOR：バージョンアップは、互換性を破ることなく新機能を追加することを意味します。

PATCH：セキュリティ脆弱性の修正などを含むバグフィックスバージョンとしても知られています。

ビルド番号（オプション）：オプションで、ビルド番号を追加できます。

### 例

`1.20.11`

`1.20.11.403`

## :globe_with_meridians: ローカライゼーション

現時点では、Lichtblickの第一級サポートは英語のみで提供されています。他の言語への翻訳は、コミュニティボランティアが提供する翻訳により、ベストエフォートベースで利用可能です。

翻訳サポートは[`react-i18next`](https://react.i18next.com)を使用して実装されています。

### 翻訳の追加

- 特定のコンポーネントやビューの_すべて_の翻訳を持つよりも、_高品質_な翻訳を持つことを重視しています。すべてのPRは最新の英語翻訳を含む必要がありますが、他の言語の更新は完全にオプションです。
- 英語翻訳を更新して非英語翻訳を提供できない場合は、そのPRで非英語バージョンを削除してください。オプションで、正確な非英語翻訳を追加するフォローアップPRを開いてください。

### `i18n`ディレクトリに翻訳を追加

[`i18n`ディレクトリ](packages/suite-base/src/i18n)には、Lichtblickでサポートされているすべての言語の翻訳（ローカライズ）文字列が含まれています。

翻訳された文字列は_名前空間_に整理されています — 例：[`i18n/[language]/appSettings.ts`](packages/suite-base/src/i18n/en/appSettings.ts)には、アプリの設定タブの翻訳が含まれています。

### `useTranslation()`と`t()`を使用して翻訳された文字列にアクセス

1. Reactコンポーネント内で[<code>useTranslation(<i>namespace</i>)</code>フック](https://react.i18next.com/latest/usetranslation-hook)を呼び出して、特定の名前空間の文字列にアクセスします。フックは`t`という関数を返します。

2. `t`関数を呼び出して、文字列の翻訳を取得します。

例：

```ts
const { t } = useTranslation("myComponent");
return <p>{t("hello")}</p>;
```

### コンポーネントにローカライゼーションサポートを追加

1. 英語文字列をコンポーネントコードから移動し、`i18n`フォルダに配置します。コンポーネントまたはアプリビューの論理的なグループに新しい名前空間を使用してください。

2. ソースコードにハードコードされた文字列を`t()`関数の呼び出しに置き換えます。新しいローカライゼーションキーには`camelCase`を使用してください。

<table><tr><th>変更前</th><th>変更後</th></tr><tr><td>

```ts
function MyComponent() {
  return <p>Hello!</p>;
}
```

</td><td>

```ts
function MyComponent() {
  const { t } = useTranslation("myComponent");
  return <p>{t("hello")}</p>;
}
```

```ts
// i18n/en/myComponent.ts
export const myComponent = {
  hello: "Hello!",
};
```

</td></tr></table>

### 完全な例

```ts
// MyComponent.ts

import { useTranslation } from "react-i18next";

function MyComponent(props: Props): React.JSX.Element {
  const { t } = useTranslation("myComponent");

  return <p>{t("hello")}</p>;
}
```

```ts
// i18n/en/myComponent.ts
export const myComponent = {
  hello: "Hello!",
};

// i18n/en/index.ts
export * from "./myComponent";
```

```ts
// i18n/zh/myComponent.ts
export const myComponent: Partial<TypeOptions["resources"]["myComponent"]> = {
  hello: "你好！",
};

// i18n/zh/index.ts
export * from "./myComponent";
```

結果：

| 英語            | 中国語          |
| --------------- | --------------- |
| `<p>Hello!</p>` | `<p>你好！</p>` |
```
