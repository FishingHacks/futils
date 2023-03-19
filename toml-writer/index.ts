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
let $parsers: Record<string, (obj: any) => string> = {};
export function parseString(str: string): string {
    for (const k in escapes)
        str = str.replaceAll(k, escapes[k as keyof typeof escapes]);
    return `'${str}'`;
}
export function parseNumber(
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
export function parseBoolean(value: boolean): string {
    return value ? 'true' : 'false';
}
export function parseDate(date: Date | number): string {
    if (typeof date === 'object') return date.toISOString();
    const _d = new Date();
    _d.setTime(date);
    return _d.toISOString();
}
export function parseBigInt(value: BigInt | bigint): string {
    return parseNumber(Number(value), 'hex');
}
export function parseFunction(
    fn: ((...args: any[]) => any) | Function
): string {
    return parseString(fn.toString());
}
export function parseSymbol(symbol: Symbol): string {
    return symbol.toString();
}
export function parseKey(key: string): string {
    return needsQuotes(key)
        ? `"${key.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`
        : key;
}
export function parseValue(value: unknown): string {
    if (value === null || value === undefined)
        throw new Error('Cannot parse undefined or null');
    if (typeof value === 'bigint') return parseBigInt(value);
    if (typeof value === 'boolean') return parseBoolean(value);
    if (typeof value === 'function') return parseFunction(value);
    if (typeof value === 'number') return parseNumber(value);
    if (typeof value === 'string') return parseString(value);
    if (typeof value === 'symbol') return parseSymbol(value);

    const _val = value as any;
    if (_val instanceof Date) return parseDate(_val);
    if (_val instanceof Array) return parseArray(_val);
    if (_val.constructor && _val.constructor.name) {
        for (const k in $parsers)
            if (_val.constructor.name === k) return $parsers[k](_val);
    }
    return parseInlineObject(value as any);
}
export function parseInlineObject(obj: Record<string, any>) {
    let parsed = '{';

    for (const [k, v] of Object.entries(obj)) {
        parsed += ' ' + parseKey(k);
        parsed += ' = ';
        parsed += parseValue(v) + ',';
    }

    return parsed.substring(0, parsed.length - 1) + ' }';
}
export function parseArray(arr: any[]) {
    let parsed = '[';

    for (const v of arr) parsed += ` ${parseValue(v)},`;

    return parsed + ' ]';
}
export function defineCustomWriters(
    writers: Record<string, (obj: any) => string>
) {
    $parsers = { ...$parsers, ...writers };
}
export default function write(obj: Record<string, any>): string {
    let parsed = '';
    for (const [k, v] of Object.entries(obj)) {
        parsed += '\n' + parseKey(k);
        parsed += ' = ';
        parsed += parseValue(v);
    }
    return parsed.substring(1);
}
