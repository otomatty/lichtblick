// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as _ from "lodash-es";
import { parseMessagePath } from "@lichtblick/message-path";
import { simpleGetMessagePathDataItems } from "@lichtblick/suite-base/components/MessagePathSyntax/simpleGetMessagePathDataItems";
import { fillInGlobalVariablesInPath } from "@lichtblick/suite-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems";
export function getSingleDataItem(results) {
    if (results.length <= 1) {
        return results[0];
    }
    throw new Error("Message path produced multiple results");
}
function handleFrameActionState({ messages, state, }) {
    if (state.pathParseError != undefined) {
        return { ...state, latestMessage: _.last(messages), error: undefined };
    }
    if (!state.parsedPath) {
        return { ...state, error: undefined };
    }
    const filledInPath = fillInGlobalVariablesInPath(state.parsedPath, state.globalVariables);
    let latestMatchingQueriedData = state.latestMatchingQueriedData;
    let latestMessage = state.latestMessage;
    for (const message of messages) {
        if (message.topic !== filledInPath.topicName) {
            continue;
        }
        const data = getSingleDataItem(simpleGetMessagePathDataItems(message, filledInPath));
        if (data != undefined) {
            latestMatchingQueriedData = data;
            latestMessage = message;
        }
    }
    return { ...state, latestMessage, latestMatchingQueriedData, error: undefined };
}
function handlePathActionStateWithGlobalVars({ path, state, }) {
    const newPath = parseMessagePath(path);
    let pathParseError;
    let latestMatchingQueriedData;
    let error;
    const filledInPath = fillInGlobalVariablesInPath(newPath, state.globalVariables);
    try {
        if (state.latestMessage) {
            latestMatchingQueriedData = getSingleDataItem(simpleGetMessagePathDataItems(state.latestMessage, filledInPath));
        }
    }
    catch (err) {
        error = err;
    }
    return {
        ...state,
        error,
        latestMatchingQueriedData,
        parsedPath: filledInPath,
        path,
        pathParseError,
    };
}
export function stateReducer(state, action) {
    try {
        switch (action.type) {
            case "frame": {
                return handleFrameActionState({ state, messages: action.messages });
            }
            case "path": {
                return handlePathActionStateWithGlobalVars({ state, path: action.path });
            }
            case "seek":
                return {
                    ...state,
                    latestMessage: undefined,
                    latestMatchingQueriedData: undefined,
                    error: undefined,
                };
            case "updateGlobalVariables": {
                return { ...state, globalVariables: action.globalVariables };
            }
        }
    }
    catch (error) {
        return {
            ...state,
            latestMatchingQueriedData: undefined,
            error,
        };
    }
}
