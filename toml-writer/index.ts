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

function needsQuotes(str: string): boolean {
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
let $writers: Record<string, (obj: any) => string> = {};
export function writeString(str: string): string {
    for (const k in escapes)
        str = str.replaceAll(k, escapes[k as keyof typeof escapes]);
    return `'${str}'`;
}
export function writeNumber(
    num: number,
    format: 'octal' | 'hex' | 'bin' | 'base-10' = 'base-10'
): string {
    if (!isFinite(num)) return `${0 < num ? '+' : '-'}inf`;
    if (isNaN(num)) return `${0 < num ? '+' : '-'}nan`;
    if (format !== 'base-10' && Math.floor(num) !== num)
        throw new Error('Only base-10 allows floats');

    return `${
        format === 'octal'
            ? '0o'
            : format === 'base-10'
            ? ''
            : format === 'bin'
            ? '0b'
            : '0x'
    }${num.toString(
        format === 'octal'
            ? 7
            : format === 'hex'
            ? 16
            : format === 'bin'
            ? 2
            : 10
    )}`;
}
export function writeBoolean(value: boolean): string {
    return value ? 'true' : 'false';
}
export function writeDate(date: Date | number): string {
    if (typeof date === 'object') return date.toISOString();
    const _d = new Date();
    _d.setTime(date);
    return _d.toISOString();
}
export function writeBigInt(value: BigInt | bigint): string {
    return writeNumber(Number(value), 'hex');
}
export function writeFunction(
    fn: ((...args: any[]) => any) | Function
): string {
    return writeString(fn.toString());
}
export function writeSymbol(symbol: Symbol): string {
    return symbol.toString();
}
export function writeKey(key: string): string {
    return needsQuotes(key)
        ? `"${key.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`
        : key;
}
export function writeValue(value: unknown): string {
    if (value === null || value === undefined)
        throw new Error('Cannot write undefined or null');
    if (typeof value === 'bigint') return writeBigInt(value);
    if (typeof value === 'boolean') return writeBoolean(value);
    if (typeof value === 'function') return writeFunction(value);
    if (typeof value === 'number') return writeNumber(value);
    if (typeof value === 'string') return writeString(value);
    if (typeof value === 'symbol') return writeSymbol(value);

    const _val = value as any;
    if (_val instanceof Date) return writeDate(_val);
    if (_val instanceof Array) return writeArray(_val);
    if (_val.constructor && _val.constructor.name) {
        for (const k in $writers)
            if (_val.constructor.name === k) return $writers[k](_val);
    }
    return writeInlineObject(value as any);
}
export function writeInlineObject(obj: Record<string, any>) {
    let writed = '{';

    for (const [k, v] of Object.entries(obj)) {
        writed += ' ' + writeKey(k);
        writed += ' = ';
        writed += writeValue(v) + ',';
    }

    return writed.substring(0, writed.length - 1) + ' }';
}
export function writeArray(arr: any[]) {
    let writed = '[';

    for (const v of arr) writed += ` ${writeValue(v)},`;

    return writed + ' ]';
}
export function defineCustomWriters(
    writers: Record<string, (obj: any) => string>
) {
    $writers = { ...$writers, ...writers };
}
export default function write(obj: Record<string, any>): string {
    let writed = '';
    for (const [k, v] of Object.entries(obj)) {
        writed += '\n' + writeKey(k);
        writed += ' = ';
        writed += writeValue(v);
    }
    return writed.substring(1);
}
