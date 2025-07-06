// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as _ from "lodash-es";
import randomString from "randomstring";
import { Capitalization, } from "@lichtblick/suite-base/testing/builders/types";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class BasicBuilder {
    static date(props = {}) {
        const { year, month, day, hours, minutes, seconds } = defaults(props, {
            year: BasicBuilder.number({ min: 2000, max: 2021 }),
            month: BasicBuilder.number({ min: 1, max: 12 }).toString().padStart(2, "0"),
            day: BasicBuilder.number({ min: 1, max: 28 }).toString().padStart(2, "0"),
            hours: BasicBuilder.number({ min: 0, max: 23 }).toString().padStart(2, "0"),
            minutes: BasicBuilder.number({ min: 0, max: 59 }).toString().padStart(2, "0"),
            seconds: BasicBuilder.number({ min: 0, max: 59 }).toString().padStart(2, "0"),
        });
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.926536Z`;
    }
    static boolean() {
        return Boolean(_.random(0, 1));
    }
    static number({ min = 1, max = 20 } = {}) {
        return _.random(min, max);
    }
    static float(min = 1, max = 20) {
        return _.random(min, max, true);
    }
    static bigInt(min = 1n, max = 20n) {
        const range = max - min + 1n;
        const randomBigInt = BigInt(Math.floor(Math.random() * Number(range)));
        return min + randomBigInt;
    }
    static string({ length = 6, charset = "alphabetic", capitalization, } = {}) {
        let casingFunction = (input) => input;
        if (capitalization != undefined) {
            casingFunction = {
                [Capitalization.UPPERCASE]: _.toUpper,
                [Capitalization.LOWERCASE]: _.toLower,
            }[capitalization];
        }
        return casingFunction(randomString.generate({
            length,
            charset,
        }));
    }
    static stringMap({ count = 3, length = 6, charset = "alphabetic", capitalization, } = {}) {
        const entries = BasicBuilder.multiple(() => [
            BasicBuilder.string({ length, charset, capitalization }),
            BasicBuilder.string({ length, charset, capitalization }),
        ], count);
        return new Map(entries);
    }
    static genericMap(valueGenerator, { count = 3, length = 6, charset = "alphabetic", capitalization } = {}) {
        const entries = BasicBuilder.multiple(() => [BasicBuilder.string({ length, charset, capitalization }), valueGenerator()], count);
        return new Map(entries);
    }
    static genericDictionary(valueGenerator, { count = 3, length = 6, charset = "alphabetic", capitalization } = {}) {
        return _.fromPairs(BasicBuilder.multiple(() => [BasicBuilder.string({ length, charset, capitalization }), valueGenerator()], count));
    }
    static multiple(factory, count = 3) {
        return _.map(new Array(count), factory);
    }
    static numbers(count = 3) {
        return BasicBuilder.multiple(BasicBuilder.number, count);
    }
    static strings({ count = 3, length = 6, charset = "alphabetic", capitalization = undefined, } = {}) {
        return BasicBuilder.multiple(() => BasicBuilder.string({ length, charset, capitalization }), count);
    }
    static sample(input, count) {
        return count == undefined ? _.sample(input) : _.sampleSize(input, count);
    }
}
