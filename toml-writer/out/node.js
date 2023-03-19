"use strict";
/**
 * @author FishingHacks <https://github.com/FishingHacks>
 * @repository https://github.com/FishingHacks/js-utils/
 * @file https://github.com/FishingHacks/js-utils/tree/master/toml-writer/index.ts
 * @license MIT
 * MIT License
 *
 * Copyright (c) 2023 FishingHacks
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCustomWriters = exports.parseArray = exports.parseInlineObject = exports.parseValue = exports.parseKey = exports.parseSymbol = exports.parseFunction = exports.parseBigInt = exports.parseDate = exports.parseBoolean = exports.parseNumber = exports.parseString = void 0;
function needsQuotes(str) {
    return str.match(/^[A-Za-z0-9_-]+$/) === null || str === '';
}
const escapes = {
    '\\': '\\\\',
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    "'": "\\'",
};
let $parsers = {};
function parseString(str) {
    for (const k in escapes)
        str = str.replaceAll(k, escapes[k]);
    return `'${str}'`;
}
exports.parseString = parseString;
function parseNumber(num, format = 'base-10') {
    if (!isFinite(num))
        return `${0 < num ? '+' : '-'}inf`;
    if (isNaN(num))
        return `${0 < num ? '+' : '-'}nan`;
    if (format !== 'base-10' && Math.floor(num) !== num)
        throw new Error('Only base-10 allows floats');
    return `${format === 'octal'
        ? '0o'
        : format === 'base-10'
            ? ''
            : format === 'bin'
                ? '0b'
                : '0x'}${num.toString(format === 'octal'
        ? 7
        : format === 'hex'
            ? 16
            : format === 'bin'
                ? 2
                : 10)}`;
}
exports.parseNumber = parseNumber;
function parseBoolean(value) {
    return value ? 'true' : 'false';
}
exports.parseBoolean = parseBoolean;
function parseDate(date) {
    if (typeof date === 'object')
        return date.toISOString();
    const _d = new Date();
    _d.setTime(date);
    return _d.toISOString();
}
exports.parseDate = parseDate;
function parseBigInt(value) {
    return parseNumber(Number(value), 'hex');
}
exports.parseBigInt = parseBigInt;
function parseFunction(fn) {
    return parseString(fn.toString());
}
exports.parseFunction = parseFunction;
function parseSymbol(symbol) {
    return symbol.toString();
}
exports.parseSymbol = parseSymbol;
function parseKey(key) {
    return needsQuotes(key)
        ? `"${key.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`
        : key;
}
exports.parseKey = parseKey;
function parseValue(value) {
    if (value === null || value === undefined)
        throw new Error('Cannot parse undefined or null');
    if (typeof value === 'bigint')
        return parseBigInt(value);
    if (typeof value === 'boolean')
        return parseBoolean(value);
    if (typeof value === 'function')
        return parseFunction(value);
    if (typeof value === 'number')
        return parseNumber(value);
    if (typeof value === 'string')
        return parseString(value);
    if (typeof value === 'symbol')
        return parseSymbol(value);
    const _val = value;
    if (_val instanceof Date)
        return parseDate(_val);
    if (_val instanceof Array)
        return parseArray(_val);
    if (_val.constructor && _val.constructor.name) {
        for (const k in $parsers)
            if (_val.constructor.name === k)
                return $parsers[k](_val);
    }
    return parseInlineObject(value);
}
exports.parseValue = parseValue;
function parseInlineObject(obj) {
    let parsed = '{';
    for (const [k, v] of Object.entries(obj)) {
        parsed += ' ' + parseKey(k);
        parsed += ' = ';
        parsed += parseValue(v) + ',';
    }
    return parsed.substring(0, parsed.length - 1) + ' }';
}
exports.parseInlineObject = parseInlineObject;
function parseArray(arr) {
    let parsed = '[';
    for (const v of arr)
        parsed += ` ${parseValue(v)},`;
    return parsed + ' ]';
}
exports.parseArray = parseArray;
function defineCustomWriters(writers) {
    $parsers = { ...$parsers, ...writers };
}
exports.defineCustomWriters = defineCustomWriters;
function write(obj) {
    let parsed = '';
    for (const [k, v] of Object.entries(obj)) {
        parsed += '\n' + parseKey(k);
        parsed += ' = ';
        parsed += parseValue(v);
    }
    return parsed.substring(1);
}
exports.default = write;
