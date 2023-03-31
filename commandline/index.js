"use strict";
/**
 * @author FishingHacks <https://github.com/FishingHacks>
 * @repository https://github.com/FishingHacks/js-utils/
 * @file https://github.com/FishingHacks/js-utils/tree/master/commandline/index.ts
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
exports.applyPadding = exports.createTable = exports.createTextbox = exports.TextboxBuilder = exports.removeAnsiColors = exports.removeTerminalColors = exports.getInput = exports.color = exports.colors = void 0;
const promises_1 = require("readline/promises");
exports.colors = {
    reset: {
        fg: '\x1B[39m',
        bg: '\x1B[49m',
        colorAll: '\x1B[39m\x1B[49m',
        bold: '\x1B[22m',
        italic: '\x1B[23m',
        strikethrough: '\x1B[29m',
        underline: '\x1B[24m',
        style: '\x1B[22m\x1B[23m\x1B[29m\x1B[24m',
        all: '\x1B[22m\x1B[23m\x1B[29m\x1B[24m\x1B[39m\x1B[49m',
    },
    fg: {
        black: '\x1B[30m',
        blue: '\x1B[34m',
        cyan: '\x1B[36m',
        gray: '\x1B[90m',
        green: '\x1B[32m',
        magenta: '\x1B[35m',
        red: '\x1B[31m',
        white: '\x1B[37m',
        yellow: '\x1B[33m',
    },
    bg: {
        black: '\x1B[40m',
        blue: '\x1B[44m',
        cyan: '\x1B[46m',
        gray: '\x1B[100m',
        green: '\x1B[42m',
        magenta: '\x1B[45m',
        red: '\x1B[41m',
        white: '\x1B[47m',
        yellow: '\x1B[43m',
    },
    fgBright: {
        black: '\x1B[90m',
        blue: '\x1B[94m',
        cyan: '\x1B[96m',
        green: '\x1B[92m',
        magenta: '\x1B[95m',
        red: '\x1B[91m',
        white: '\x1B[97m',
        yellow: '\x1B[93m',
    },
    bgBright: {
        black: '\x1B[100m',
        blue: '\x1B[104m',
        cyan: '\x1B[106m',
        green: '\x1B[102m',
        magenta: '\x1B[105m',
        red: '\x1B[101m',
        white: '\x1B[107m',
        yellow: '\x1B[103m',
    },
    styles: {
        italic: '\x1B[3m',
        strikethrough: '\x1B[9m',
        underline: '\x1B[4m',
        bold: '\x1B[1m',
    },
};
function color(text, color) {
    return (exports.colors[color.space][color.color] +
        text +
        (color.space === 'reset'
            ? ''
            : color.space === 'style'
                ? exports.colors.reset[color.color]
                : color.space === 'fg' || color.space === 'fgBright'
                    ? exports.colors.reset.fg
                    : exports.colors.reset.bg));
}
exports.color = color;
async function getInput(question) {
    const rl = (0, promises_1.createInterface)({
        input: process.stdin,
        output: process.stdout,
    });
    const input = await rl.question(question + ': ');
    rl.close();
    return input;
}
exports.getInput = getInput;
function removeTerminalColors(text) {
    return text.replaceAll(/\x1B\[[0-9]+(;[0-9]+)*m/g, '');
}
exports.removeTerminalColors = removeTerminalColors;
exports.removeAnsiColors = removeTerminalColors;
class TextboxBuilder {
    constructor() {
        this.title = '';
        this.lines = [];
        this.minLength = 0;
        this.footer = '';
        this.padl = 0;
        this.padr = 0;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setFooter(footer) {
        this.footer = footer;
        return this;
    }
    paddingLeft(padding) {
        if (padding < 0)
            throw new Error('Invalid padding: negative left padding');
        if (Math.floor(padding) !== padding)
            throw new Error('Invalid padding: non-int left padding');
        this.padl = padding;
        return this;
    }
    paddingRight(padding) {
        if (padding < 0)
            throw new Error('Invalid padding: negative right padding');
        if (Math.floor(padding) !== padding)
            throw new Error('Invalid padding: non-int right padding');
        this.padr = padding;
        return this;
    }
    padding(padding) {
        if (padding.left !== undefined)
            this.paddingLeft(padding.left);
        if (padding.right !== undefined)
            this.paddingRight(padding.right);
        return this;
    }
    getPaddingLeft() {
        return this.padl;
    }
    getPaddingRight() {
        return this.padr;
    }
    getPadding() {
        return {
            left: this.padl,
            right: this.padr,
        };
    }
    getFooter() {
        return this.footer;
    }
    addLine(line) {
        if (line.includes('\n'))
            throw new Error('Line contains a new line');
        this.lines.push(line);
        return this;
    }
    addLines(lines) {
        if (typeof lines === 'object' &&
            lines.find((el) => el.includes('\n') || el.includes('\r')))
            throw new Error('Found a new line in the lines');
        if (typeof lines === 'object')
            this.lines.push(...lines);
        else
            this.lines.push(...lines.split('\n'));
        return this;
    }
    setMinLength(length) {
        if (length < 0)
            throw new Error('Invalid minlength: negative minlength');
        if (Math.floor(length) !== length)
            throw new Error('Invalid minlength: non-int minlength');
        this.minLength = length;
        return this;
    }
    getMinLength() {
        return this.minLength;
    }
    addDivider() {
        this.lines.push({ type: 'divider' });
        return this;
    }
    getLines() {
        return this.lines;
    }
    getTitle() {
        return this.title;
    }
    removeLine(last = true) {
        if (last)
            this.lines.pop();
        else
            this.lines.shift();
        return this;
    }
    build() {
        this.minLength -= Math.abs(this.padl);
        this.minLength -= Math.abs(this.padr);
        const stringLines = this.lines.filter((el) => typeof el === 'string');
        const innerSize = Math.max(this.minLength, removeTerminalColors(this.footer).length, removeTerminalColors(this.title).length + 2, stringLines.reduce((acc, el) => Math.max(acc, removeTerminalColors(el).length), removeTerminalColors(stringLines[0] || '').length));
        const buildLines = this.lines
            .map((el) => {
            if (typeof el === 'string')
                return (el +
                    ' '.repeat(innerSize -
                        el.replaceAll(/\x1B\[[0-9]+(;[0-9]+)*m/g, '')
                            .length));
            else if (el.type === 'divider')
                return '─'.repeat(innerSize);
            else
                return ' '.repeat(innerSize);
        })
            .map((el) => (el.startsWith('─')
            ? '├─' + '─'.repeat(this.padl)
            : '│ ' + ' '.repeat(this.padl)) +
            el +
            (el.endsWith('─')
                ? '─'.repeat(this.padr) + '─┤\n'
                : ' '.repeat(this.padr) + ' │\n'))
            .join('');
        const footerSize = this.footer.replaceAll(/\x1B\[[0-9]+(;[0-9]+)*m/g, '').length;
        const titleSize = this.title.replaceAll(/\x1B\[[0-9]+(;[0-9]+)*m/g, '').length;
        return `┌──${'─'.repeat(this.padl)}${titleSize > 0 ? '« ' : '─'}${this.title}${titleSize > 0 ? ' »' : '─'}${'─'.repeat(innerSize - titleSize - (titleSize > 0 ? 4 : 0))}${'─'.repeat(this.padr)}┐\n${buildLines}└──${'─'.repeat(this.padl)}${footerSize > 0 ? '« ' : '─'}${this.footer}${footerSize > 0 ? ' »' : '─'}${'─'.repeat(innerSize - footerSize - (footerSize > 0 ? 4 : 2))}${'─'.repeat(this.padr)}┘`;
    }
    log(loggingFunction) {
        (loggingFunction || console.log)(this.build());
    }
}
exports.TextboxBuilder = TextboxBuilder;
function createTextbox(title, contents) {
    const lines = contents.split('\n');
    const innerSize = Math.max((title ? title.length + 4 : 0) + 2, lines.reduce((acc, el) => Math.max(acc, el.replaceAll(/\x1B\[[0-9]+(;[0-9]+)*m/g, '').length), lines[0].length || 0));
    let textbox = `┌──${title ? '« ' + title + ' »' : ''}${'─'.repeat(innerSize - (title ? title.length + 4 : 0))}┐\n`;
    textbox += lines
        .map((el) => `${el.startsWith('─') ? '├─' : '│ '}${el}${' '.repeat(innerSize -
        el.replaceAll(/\x1B\[[0-9]+(;[0-9]+)*m/g, '').length)}${el.endsWith('─') ? '─┤' : ' │'}\n`)
        .join('');
    textbox += '└' + '─'.repeat(innerSize + 2) + '┘';
    return textbox;
}
exports.createTextbox = createTextbox;
function createTable(header, keys, data, differentiateLines = false) {
    const rowKeys = Object.keys(data);
    if (rowKeys.length < 1 || keys.length < 1)
        return '┌──┐\n└──┘';
    const rows = Object.values(data);
    const columns = {};
    for (const c of keys)
        columns[c] = rows.map((el) => typeof el[c] === 'object' ? el[c] : el[c].toString());
    const columnLengths = {};
    for (const c of keys)
        columnLengths[c] =
            columns[c]?.reduce((a, b) => typeof b === 'object' ? a : a > b.length ? a : b.length, c.length) || 0;
    let str = '┌──« ' + header + ' »';
    const length = Object.values(columnLengths).reduce((a, b) => a + b + 3, 0);
    str += '─'.repeat(Math.max(length - str.length, 0));
    str += '┐\n';
    let i = 0;
    for (const c of keys) {
        const length = columnLengths[c] || 0;
        if (str[i] === '─')
            str = str.substring(0, i) + '┬' + str.substring(i + 1);
        i += 3 + length;
    }
    str += '│ ';
    for (const c of keys) {
        str += c;
        str += ' '.repeat((columnLengths[c] || 1) - c.length);
        str += ' │ ';
    }
    str += '\n';
    if (!differentiateLines) {
        str += '├';
        for (const c of keys) {
            str +=
                '─'.repeat((columnLengths[c] || 1) + 2) + '┼';
        }
        str = str.substring(0, str.length - 1);
        str += '┤\n';
    }
    for (const i in rowKeys) {
        if (differentiateLines) {
            str += '├';
            for (const c of keys) {
                str +=
                    '─'.repeat((columnLengths[c] || 1) + 2) + '┼';
            }
            str = str.substring(0, str.length - 1);
            str += '┤\n';
        }
        let col = columns[keys[0]]?.[i];
        str += typeof col === 'object' || col.startsWith('─') ? '├─' : '│ ';
        for (const j in Object.keys(keys)) {
            col = columns[keys[j]]?.[i];
            const nextCol = columns[keys[Number(j) + 1]]?.[j === (keys.length - 1).toString()
                ? Number(i) + 1
                : Number(i)];
            const c = keys[j];
            str +=
                ((typeof col === 'object'
                    ? '─'.repeat(columnLengths[c])
                    : col) || '') +
                    (typeof col === 'object'
                        ? ''
                        : ' '.repeat((columnLengths[c] || 0) -
                            col.length)) +
                    `${resolveDelimiter(typeof col === 'object'
                        ? '─'
                        : col.length < columnLengths[c]
                            ? ' '
                            : col, typeof nextCol === 'object' ? '─' : nextCol)}`;
        }
        str += '\n';
    }
    str += '└';
    for (const c of keys)
        str += '─' + '─'.repeat(columnLengths[c] || 0) + '─┴';
    str = str.substring(0, str.length - 2);
    str += '─┘';
    return str;
}
exports.createTable = createTable;
function resolveDelimiter(a, b) {
    let str = '';
    if (a?.endsWith('─'))
        str = '─┤';
    else
        str += ' │';
    if (b?.startsWith('─'))
        return str[0] + (str[1] === '│' ? '├─' : '┼─');
    else
        return str + ' ';
}
function applyPadding(str, padding) {
    return ('\n'.repeat(padding?.top || 0) +
        str
            .split('\n')
            .map((el) => ' '.repeat(padding?.left || 0) +
            el +
            ' '.repeat(padding?.right || 0))
            .join('\n') +
        '\n'.repeat(padding?.bottom || 0));
}
exports.applyPadding = applyPadding;
