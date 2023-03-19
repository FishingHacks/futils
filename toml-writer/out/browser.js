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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function needsQuotes(str) {
    return str.match(/^[A-Za-z0-9_-]+$/) === null || str === '';
}
var escapes = {
    '\\': '\\\\',
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    "'": "\\'"
};
var $parsers = {};
function parseString(str) {
    for (var k in escapes)
        str = str.replaceAll(k, escapes[k]);
    return "'".concat(str, "'");
}
function parseNumber(num, format) {
    if (format === void 0) { format = 'base-10'; }
    if (!isFinite(num))
        return "".concat(0 < num ? '+' : '-', "inf");
    if (isNaN(num))
        return "".concat(0 < num ? '+' : '-', "nan");
    if (format !== 'base-10' && Math.floor(num) !== num)
        throw new Error('Only base-10 allows floats');
    return "".concat(format === 'octal'
        ? '0o'
        : format === 'base-10'
            ? ''
            : format === 'bin'
                ? '0b'
                : '0x').concat(num.toString(format === 'octal'
        ? 7
        : format === 'hex'
            ? 16
            : format === 'bin'
                ? 2
                : 10));
}
function parseBoolean(value) {
    return value ? 'true' : 'false';
}
function parseDate(date) {
    if (typeof date === 'object')
        return date.toISOString();
    var _d = new Date();
    _d.setTime(date);
    return _d.toISOString();
}
function parseBigInt(value) {
    return parseNumber(Number(value), 'hex');
}
function parseFunction(fn) {
    return parseString(fn.toString());
}
function parseSymbol(symbol) {
    return symbol.toString();
}
function parseKey(key) {
    return needsQuotes(key)
        ? "\"".concat(key.replaceAll('\\', '\\\\').replaceAll('"', '\\"'), "\"")
        : key;
}
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
    var _val = value;
    if (_val instanceof Date)
        return parseDate(_val);
    if (_val instanceof Array)
        return parseArray(_val);
    if (_val.constructor && _val.constructor.name) {
        for (var k in $parsers)
            if (_val.constructor.name === k)
                return $parsers[k](_val);
    }
    return parseInlineObject(value);
}
function parseInlineObject(obj) {
    var parsed = '{';
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        parsed += ' ' + parseKey(k);
        parsed += ' = ';
        parsed += parseValue(v) + ',';
    }
    return parsed.substring(0, parsed.length - 1) + ' }';
}
function parseArray(arr) {
    var parsed = '[';
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var v = arr_1[_i];
        parsed += " ".concat(parseValue(v), ",");
    }
    return parsed + ' ]';
}
function defineCustomWriters(writers) {
    $parsers = __assign(__assign({}, $parsers), writers);
}
function write(obj) {
    var parsed = '';
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        parsed += '\n' + parseKey(k);
        parsed += ' = ';
        parsed += parseValue(v);
    }
    return parsed.substring(1);
}
