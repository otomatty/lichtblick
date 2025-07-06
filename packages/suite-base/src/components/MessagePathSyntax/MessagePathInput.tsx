// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { TextFieldProps } from "@mui/material";
import * as _ from "lodash-es";
import { CSSProperties, useCallback, useMemo } from "react";
import { makeStyles } from "tss-react/mui";

import { filterMap } from "@lichtblick/den/collection";
import {
  quoteTopicNameIfNeeded,
  parseMessagePath,
  MessagePath,
  PrimitiveType,
} from "@lichtblick/message-path";
import * as PanelAPI from "@lichtblick/suite-base/PanelAPI";
import { Autocomplete, IAutocomplete } from "@lichtblick/suite-base/components/Autocomplete";
import useGlobalVariables, {
  GlobalVariables,
} from "@lichtblick/suite-base/hooks/useGlobalVariables";

import {
  traverseStructure,
  messagePathStructures,
  messagePathsForStructure,
  validTerminatingStructureItem,
  StructureTraversalResult,
} from "./messagePathsForDatatype";

/**
 * グローバル変数のデフォルト値を設定しようと試みる
 *
 * @param variableName - 設定対象の変数名
 * @param setGlobalVariables - グローバル変数設定関数
 * @returns デフォルト値が設定できた場合はtrue、できなかった場合はfalse
 *
 * @example
 * ```typescript
 * const success = tryToSetDefaultGlobalVar("myVar", setGlobalVariables);
 * if (success) {
 *   console.log("デフォルト値を設定しました");
 * }
 * ```
 */
export function tryToSetDefaultGlobalVar(
  variableName: string,
  setGlobalVariables: (arg0: GlobalVariables) => void,
): boolean {
  const defaultGlobalVars = new Map<string, GlobalVariables>();
  const defaultVar = defaultGlobalVars.get(variableName);
  if (defaultVar) {
    setGlobalVariables({ [variableName]: defaultVar });
    return true;
  }
  return false;
}

/**
 * ROSパスから最初の無効なグローバル変数を検索する
 *
 * メッセージパス内で使用されているグローバル変数のうち、
 * 現在定義されていない最初の変数を返す。
 *
 * @param rosPath - 解析対象のROSメッセージパス
 * @param globalVariables - 現在定義されているグローバル変数
 * @param setGlobalVariables - グローバル変数設定関数
 * @returns 無効な変数の情報（変数名と位置）、または undefined
 *
 * @example
 * ```typescript
 * const invalidVar = getFirstInvalidVariableFromRosPath(
 *   parsedPath,
 *   globalVariables,
 *   setGlobalVariables
 * );
 * if (invalidVar) {
 *   console.log(`無効な変数: ${invalidVar.variableName} at position ${invalidVar.loc}`);
 * }
 * ```
 */
export function getFirstInvalidVariableFromRosPath(
  rosPath: MessagePath,
  globalVariables: GlobalVariables,
  setGlobalVariables: (arg0: GlobalVariables) => void,
): { variableName: string; loc: number } | undefined {
  const { messagePath } = rosPath;
  const globalVars = Object.keys(globalVariables);
  return _.flatMap(messagePath, (path) => {
    const messagePathParts = [];
    if (
      path.type === "filter" &&
      typeof path.value === "object" &&
      !globalVars.includes(path.value.variableName)
    ) {
      const [variableName, loc] = [path.value.variableName, path.valueLoc];
      messagePathParts.push({ variableName, loc });
    } else if (path.type === "slice") {
      if (typeof path.start === "object" && !globalVars.includes(path.start.variableName)) {
        const [variableName, loc] = [path.start.variableName, path.start.startLoc];
        messagePathParts.push({ variableName, loc });
      }
      if (typeof path.end === "object" && !globalVars.includes(path.end.variableName)) {
        const [variableName, loc] = [path.end.variableName, path.end.startLoc];
        messagePathParts.push({ variableName, loc });
      }
    }
    return messagePathParts;
  }).find(({ variableName }) => !tryToSetDefaultGlobalVar(variableName, setGlobalVariables));
}

/**
 * プリミティブ型の例示値を取得する
 *
 * 自動補完でフィルター条件を提案する際に使用される
 * サンプル値を返す。
 *
 * @param primitiveType - ROSプリミティブ型
 * @returns 型に応じた例示値の文字列表現
 *
 * @example
 * ```typescript
 * getExamplePrimitive("string") // '""'
 * getExamplePrimitive("bool")   // "true"
 * getExamplePrimitive("int32")  // "0"
 * ```
 */
function getExamplePrimitive(primitiveType: PrimitiveType) {
  switch (primitiveType) {
    case "string":
      return '""';
    case "bool":
      return "true";
    case "float32":
    case "float64":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
    case "int8":
    case "int16":
    case "int32":
    case "int64":
      return "0";
  }
}

/**
 * MessagePathInputコンポーネントのプロパティ型定義
 *
 * ROSメッセージパスの入力フィールドを提供するコンポーネントの
 * 設定オプションを定義する。
 */
export type MessagePathInputBaseProps = {
  /** 数学修飾子（.@演算子）をサポートするかどうか */
  supportsMathModifiers?: boolean;
  /** 入力されたパス文字列（例: `/topic.some_field[:]{id==42}.x`） */
  path: string;
  /** 複数の入力フィールドを区別するためのオプションインデックス */
  index?: number;
  /** パス変更時のコールバック関数 */
  onChange: (value: string, index?: number) => void;
  /** 有効な型のリスト（"message", "array", "primitive"、またはROSプリミティブ型） */
  validTypes?: readonly string[];
  /** 複数値スライス（[:]）を無効にし、単一値（[0]）のみを許可するかどうか */
  noMultiSlices?: boolean;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 入力フィールドのカスタムスタイル */
  inputStyle?: CSSProperties;
  /** 入力フィールドを無効にするかどうか */
  disabled?: boolean;
  /** 自動補完を無効にして通常の入力フィールドとして扱うかどうか */
  disableAutocomplete?: boolean;
  /** 読み取り専用にするかどうか */
  readOnly?: boolean;
  /** 優先されるデータ型（自動補完順序に影響） */
  prioritizedDatatype?: string;
  /** Material-UIのTextFieldバリアント */
  variant?: TextFieldProps["variant"];
};

const useStyles = makeStyles()({
  root: { flexGrow: 1 },
});

/**
 * ROSメッセージパス入力コンポーネント
 *
 * ROSトピックとメッセージフィールドへのパスを入力するための
 * 自動補完機能付きの入力フィールドを提供する。
 *
 * ## 主な機能
 * - トピック名の自動補完
 * - メッセージフィールドパスの自動補完
 * - フィルター条件の自動補完
 * - グローバル変数の自動補完
 * - 型制約による候補の絞り込み
 * - 数学修飾子のサポート
 *
 * ## 自動補完の種類
 * 1. **トピック名補完**: `/topic_name` の形式
 * 2. **メッセージパス補完**: `.field_name[0].sub_field` の形式
 * 3. **フィルター補完**: `{field==value}` の形式
 * 4. **グローバル変数補完**: `$variable_name` の形式
 *
 * @example
 * ```typescript
 * // 基本的な使用例
 * <MessagePathInput
 *   path="/robot/pose.position.x"
 *   onChange={(path) => console.log(path)}
 * />
 *
 * // 型制約付きの使用例
 * <MessagePathInput
 *   path="/sensor/data"
 *   validTypes={["primitive", "float64"]}
 *   onChange={(path) => setSelectedPath(path)}
 * />
 *
 * // 複数入力フィールドでの使用例
 * <MessagePathInput
 *   path="/topic.field"
 *   index={0}
 *   onChange={(path, index) => updatePath(index, path)}
 * />
 * ```
 *
 * @param props - コンポーネントのプロパティ
 * @returns 自動補完機能付きの入力フィールド
 */
export default React.memo<MessagePathInputBaseProps>(function MessagePathInput(
  props: MessagePathInputBaseProps,
) {
  const { globalVariables, setGlobalVariables } = useGlobalVariables();
  const { datatypes, topics } = PanelAPI.useDataSourceInfo();

  const {
    supportsMathModifiers,
    path,
    prioritizedDatatype,
    validTypes,
    placeholder,
    noMultiSlices,
    inputStyle,
    disableAutocomplete = false,
    variant = "standard",
  } = props;
  const { classes } = useStyles();

  // データ型からメッセージパス構造を生成（メモ化）
  const messagePathStructuresForDataype = useMemo(
    () => messagePathStructures(datatypes),
    [datatypes],
  );

  /**
   * 各メッセージパスと対応するMessagePathStructureItemのマップ
   * 自動補完候補の生成に使用される
   */
  const allStructureItemsByPath = useMemo(
    () =>
      new Map(
        topics.flatMap((topic) => {
          if (topic.schemaName == undefined) {
            return [];
          }
          const structureItem = messagePathStructuresForDataype[topic.schemaName];
          if (structureItem == undefined) {
            return [];
          }
          const allPaths = messagePathsForStructure(structureItem, {
            validTypes,
            noMultiSlices,
          });
          return filterMap(allPaths, (item) => {
            if (item.path === "") {
              // プレーントピック項目は `topicNamesAutocompleteItems` で追加される
              return undefined;
            }
            return [quoteTopicNameIfNeeded(topic.name) + item.path, item.terminatingStructureItem];
          });
        }),
      ),
    [messagePathStructuresForDataype, noMultiSlices, topics, validTypes],
  );

  const onChangeProp = props.onChange;

  /**
   * 入力値変更時のハンドラー
   *
   * 特別な処理として、"{"文字の入力時に自動的に"}"を挿入し、
   * フィルター条件の入力を支援する。
   */
  const onChange = useCallback(
    (event: React.SyntheticEvent, rawValue: string) => {
      // "{"文字が入力された時、自動的に"}"を挿入して
      // フィルター名選択のための自動補完ウィンドウを即座に表示
      let value = rawValue;
      if ((event.nativeEvent as InputEvent).data === "{") {
        const target = event.target as HTMLInputElement;
        const newCursorPosition = target.selectionEnd ?? 0;
        value = `${value.slice(0, newCursorPosition)}}${value.slice(newCursorPosition)}`;
        setImmediate(() => {
          target.setSelectionRange(newCursorPosition, newCursorPosition);
        });
      }

      onChangeProp(value, props.index);
    },
    [onChangeProp, props.index],
  );

  /**
   * 自動補完項目選択時のハンドラー
   *
   * 選択された項目に基づいて入力値を更新し、
   * 必要に応じてカーソル位置を調整する。
   */
  const onSelect = useCallback(
    (
      rawValue: string,
      autocomplete: IAutocomplete,
      autocompleteType: ("topicName" | "messagePath" | "globalVariables") | undefined,
      autocompleteRange: { start: number; end: number },
    ) => {
      const completeStart = path.slice(0, autocompleteRange.start);
      const completeEnd = path.slice(autocompleteRange.end);

      // この補完を受け入れると非複合フィールドへのパスになるかチェック
      const completedPath = completeStart + rawValue + completeEnd;
      const completedField = allStructureItemsByPath.get(completedPath);
      const isSimpleField =
        completedField != undefined && completedField.structureType === "primitive";

      // トピック名を扱っていて、メッセージ型で有効に終了できない場合、
      // "."を追加してユーザーがメッセージパスの自動補完を続けられるようにする
      const messageIsValidType = validTypes == undefined || validTypes.includes("message");
      const keepGoingAfterTopicName =
        autocompleteType === "topicName" && !messageIsValidType && !isSimpleField;
      const value = keepGoingAfterTopicName ? rawValue + "." : rawValue;

      onChangeProp(completeStart + value + completeEnd);

      // 以下の場合は入力を続行する:
      // - トピック名を扱っている場合
      // - フィルター付きの項目を補完した場合（フィルターを編集したい可能性）
      // - 既存の自動補完にフィルターが含まれている場合
      if (keepGoingAfterTopicName || value.includes("{") || path.includes("{")) {
        const newCursorPosition = autocompleteRange.start + value.length;
        setImmediate(() => {
          autocomplete.setSelectionRange(newCursorPosition, newCursorPosition);
        });
      } else {
        autocomplete.blur();
      }
    },
    [path, allStructureItemsByPath, validTypes, onChangeProp],
  );

  // 入力パスを解析してMessagePathオブジェクトに変換
  const rosPath = useMemo(() => parseMessagePath(path), [path]);

  // 解析されたパスからトピック情報を取得
  const topic = useMemo(() => {
    if (!rosPath) {
      return undefined;
    }

    const { topicName } = rosPath;
    return topics.find(({ name }) => name === topicName);
  }, [rosPath, topics]);

  // メッセージパスの構造走査結果を取得
  const structureTraversalResult = useMemo((): StructureTraversalResult | undefined => {
    if (!topic || !rosPath?.messagePath) {
      return undefined;
    }
    if (topic.schemaName == undefined) {
      return {
        valid: true,
        msgPathPart: undefined,
        structureItem: {
          structureType: "message",
          nextByName: {},
          datatype: "",
        },
      };
    }

    return traverseStructure(
      messagePathStructuresForDataype[topic.schemaName],
      rosPath.messagePath,
    );
  }, [messagePathStructuresForDataype, rosPath?.messagePath, topic]);

  // 無効なグローバル変数を検索
  const invalidGlobalVariablesVariable = useMemo(() => {
    if (!rosPath) {
      return undefined;
    }
    return getFirstInvalidVariableFromRosPath(rosPath, globalVariables, setGlobalVariables);
  }, [globalVariables, rosPath, setGlobalVariables]);

  // トピック名の自動補完候補を生成
  const topicNamesAutocompleteItems = useMemo(
    () => topics.map(({ name }) => quoteTopicNameIfNeeded(name)),
    [topics],
  );

  // トピック名とフィールドパスの自動補完候補を生成
  const topicNamesAndFieldsAutocompleteItems = useMemo(
    () => topicNamesAutocompleteItems.concat(Array.from(allStructureItemsByPath.keys())),
    [allStructureItemsByPath, topicNamesAutocompleteItems],
  );

  // 現在の自動補完タイプを決定
  const autocompleteType = useMemo(() => {
    if (!rosPath) {
      return "topicName";
    } else if (!topic) {
      return "topicName";
    } else if (
      structureTraversalResult == undefined ||
      !structureTraversalResult.valid ||
      !validTerminatingStructureItem(structureTraversalResult.structureItem, validTypes)
    ) {
      return "messagePath";
    }

    if (invalidGlobalVariablesVariable) {
      return "globalVariables";
    }

    return undefined;
  }, [invalidGlobalVariablesVariable, structureTraversalResult, validTypes, rosPath, topic]);

  const structures = useMemo(() => messagePathStructures(datatypes), [datatypes]);

  /**
   * 自動補完候補とその関連情報を生成
   *
   * 現在の入力状態に基づいて適切な自動補完候補を決定し、
   * フィルターテキストと置換範囲を計算する。
   */
  const { autocompleteItems, autocompleteFilterText, autocompleteRange } = useMemo(() => {
    if (disableAutocomplete) {
      return {
        autocompleteItems: [],
        autocompleteFilterText: "",
        autocompleteRange: { start: 0, end: Infinity },
      };
    } else if (autocompleteType === "topicName") {
      // パスが空の場合はトピック名のみを表示し、そうでなければ
      // トピック名とフィールドパスの全セットを自動補完に使用
      return {
        autocompleteItems: path
          ? topicNamesAndFieldsAutocompleteItems
          : topicNamesAutocompleteItems,
        autocompleteFilterText: path,
        autocompleteRange: { start: 0, end: Infinity },
      };
    } else if (autocompleteType === "messagePath" && topic && rosPath) {
      if (
        structureTraversalResult &&
        !structureTraversalResult.valid &&
        structureTraversalResult.msgPathPart?.type === "filter" &&
        structureTraversalResult.structureItem?.structureType === "message"
      ) {
        const { msgPathPart } = structureTraversalResult;

        const items: string[] = [];

        // プリミティブ値のフィルター提案を提供
        // （フィルタリング可能な値の種類はプリミティブのみ）
        for (const name of Object.keys(structureTraversalResult.structureItem.nextByName)) {
          const item = structureTraversalResult.structureItem.nextByName[name];
          if (item?.structureType === "primitive") {
            for (const operator of ["==", "!=", ">", ">=", "<", "<="]) {
              items.push(`${name}${operator}${getExamplePrimitive(item.primitiveType)}`);
            }
          }
        }

        const filterText = msgPathPart.path.join(".");

        return {
          autocompleteItems: items,
          autocompleteFilterText: filterText,
          autocompleteRange: {
            start: msgPathPart.nameLoc,
            end: msgPathPart.nameLoc + filterText.length,
          },
        };
      } else {
        // 初期フィルター（"/topic{foo=='bar'}"）を、ユーザーが新しい
        // メッセージパスを選択した際に置換される範囲から除外
        const initialFilterLength =
          rosPath.messagePath[0]?.type === "filter" ? rosPath.messagePath[0].repr.length + 2 : 0;

        const structure = topic.schemaName != undefined ? structures[topic.schemaName] : undefined;

        return {
          autocompleteItems:
            structure == undefined
              ? []
              : filterMap(
                  messagePathsForStructure(structure, {
                    validTypes,
                    noMultiSlices,
                    messagePath: rosPath.messagePath,
                  }),
                  (item) => item.path,
                ),

          autocompleteRange: {
            start: rosPath.topicNameRepr.length + initialFilterLength,
            end: Infinity,
          },
          // フィルターを粗い方法で除外し、既にフィルターを指定している場合でも
          // 自動補完が機能するようにする。エッジケースだが、実装が簡単で便利
          autocompleteFilterText: path
            .substring(rosPath.topicNameRepr.length)
            .replace(/\{[^}]*\}/g, ""),
        };
      }
    } else if (invalidGlobalVariablesVariable) {
      return {
        autocompleteItems: Object.keys(globalVariables).map((key) => `$${key}`),
        autocompleteRange: {
          start: invalidGlobalVariablesVariable.loc,
          end:
            invalidGlobalVariablesVariable.loc +
            invalidGlobalVariablesVariable.variableName.length +
            1,
        },
        autocompleteFilterText: invalidGlobalVariablesVariable.variableName,
      };
    }

    return {
      autocompleteItems: [],
      autocompleteFilterText: "",
      autocompleteRange: { start: 0, end: Infinity },
    };
  }, [
    disableAutocomplete,
    autocompleteType,
    topic,
    rosPath,
    invalidGlobalVariablesVariable,
    path,
    topicNamesAndFieldsAutocompleteItems,
    topicNamesAutocompleteItems,
    structureTraversalResult,
    structures,
    validTypes,
    noMultiSlices,
    globalVariables,
  ]);

  // トピック名でインデックス化されたトピック情報
  const topicsByName = useMemo(() => _.keyBy(topics, ({ name }) => name), [topics]);

  // 優先データ型に基づいて自動補完候補を並び替え
  const orderedAutocompleteItems = useMemo(() => {
    if (prioritizedDatatype == undefined) {
      return autocompleteItems;
    }

    return _.flatten(
      _.partition(
        autocompleteItems,
        (item) => topicsByName[item]?.schemaName === prioritizedDatatype,
      ),
    );
  }, [autocompleteItems, prioritizedDatatype, topicsByName]);

  // サポートされていない数学修飾子の使用をチェック
  const usesUnsupportedMathModifier =
    (supportsMathModifiers == undefined || !supportsMathModifiers) && path.includes(".@");

  // エラー状態を判定
  const hasError =
    usesUnsupportedMathModifier ||
    (autocompleteType != undefined && !disableAutocomplete && path.length > 0);

  return (
    <Autocomplete
      className={classes.root}
      variant={variant}
      items={orderedAutocompleteItems}
      disabled={props.disabled}
      readOnly={props.readOnly}
      filterText={autocompleteFilterText}
      value={path}
      onChange={onChange}
      onSelect={(value, autocomplete) => {
        onSelect(value, autocomplete, autocompleteType, autocompleteRange);
      }}
      hasError={hasError}
      placeholder={
        placeholder != undefined && placeholder !== "" ? placeholder : "/some/topic.msgs[0].field"
      }
      inputStyle={inputStyle}
      // 複雑なクエリを構築する際に、変更したい部分に対して
      // 入力全体が選択されるのは非常に迷惑なので、自動選択を無効化
      disableAutoSelect
    />
  );
});
