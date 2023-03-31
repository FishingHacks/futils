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
export declare const colors: {
    readonly reset: {
        readonly fg: "\u001B[39m";
        readonly bg: "\u001B[49m";
        readonly colorAll: "\u001B[39m\u001B[49m";
        readonly bold: "\u001B[22m";
        readonly italic: "\u001B[23m";
        readonly strikethrough: "\u001B[29m";
        readonly underline: "\u001B[24m";
        readonly style: "\u001B[22m\u001B[23m\u001B[29m\u001B[24m";
        readonly all: "\u001B[22m\u001B[23m\u001B[29m\u001B[24m\u001B[39m\u001B[49m";
    };
    readonly fg: {
        readonly black: "\u001B[30m";
        readonly blue: "\u001B[34m";
        readonly cyan: "\u001B[36m";
        readonly gray: "\u001B[90m";
        readonly green: "\u001B[32m";
        readonly magenta: "\u001B[35m";
        readonly red: "\u001B[31m";
        readonly white: "\u001B[37m";
        readonly yellow: "\u001B[33m";
    };
    readonly bg: {
        readonly black: "\u001B[40m";
        readonly blue: "\u001B[44m";
        readonly cyan: "\u001B[46m";
        readonly gray: "\u001B[100m";
        readonly green: "\u001B[42m";
        readonly magenta: "\u001B[45m";
        readonly red: "\u001B[41m";
        readonly white: "\u001B[47m";
        readonly yellow: "\u001B[43m";
    };
    readonly fgBright: {
        readonly black: "\u001B[90m";
        readonly blue: "\u001B[94m";
        readonly cyan: "\u001B[96m";
        readonly green: "\u001B[92m";
        readonly magenta: "\u001B[95m";
        readonly red: "\u001B[91m";
        readonly white: "\u001B[97m";
        readonly yellow: "\u001B[93m";
    };
    readonly bgBright: {
        readonly black: "\u001B[100m";
        readonly blue: "\u001B[104m";
        readonly cyan: "\u001B[106m";
        readonly green: "\u001B[102m";
        readonly magenta: "\u001B[105m";
        readonly red: "\u001B[101m";
        readonly white: "\u001B[107m";
        readonly yellow: "\u001B[103m";
    };
    readonly styles: {
        readonly italic: "\u001B[3m";
        readonly strikethrough: "\u001B[9m";
        readonly underline: "\u001B[4m";
        readonly bold: "\u001B[1m";
    };
};
type Color = {
    space: 'fg' | 'bg';
    color: 'black' | 'blue' | 'cyan' | 'gray' | 'green' | 'magenta' | 'red' | 'white' | 'yellow';
} | {
    space: 'fgBright' | 'bgBright';
    color: 'black' | 'blue' | 'cyan' | 'green' | 'magenta' | 'red' | 'white' | 'yellow';
} | {
    space: 'reset';
    color: 'all' | 'underline' | 'bold' | 'strikethrough' | 'italic' | 'bg' | 'fg' | 'colorAll' | 'style';
} | {
    space: 'style';
    color: 'italic' | 'strikethrough' | 'underline' | 'bold';
};
export declare function color(text: string, color: Color): string;
export declare function getInput(question: string): Promise<string>;
export declare function removeTerminalColors(text: string): string;
export declare const removeAnsiColors: typeof removeTerminalColors;
export declare class TextboxBuilder {
    private title;
    private lines;
    private minLength;
    private footer;
    private padl;
    private padr;
    setTitle(title: string): this;
    setFooter(footer: string): this;
    paddingLeft(padding: number): this;
    paddingRight(padding: number): this;
    padding(padding: {
        left?: number;
        right?: number;
    }): this;
    getPaddingLeft(): number;
    getPaddingRight(): number;
    getPadding(): {
        left: number;
        right: number;
    };
    getFooter(): string;
    addLine(line: string): this;
    addLines(lines: string | string[]): this;
    setMinLength(length: number): this;
    getMinLength(): number;
    addDivider(): this;
    getLines(): (string | {
        type: "divider";
    })[];
    getTitle(): string;
    removeLine(last?: boolean | undefined): this;
    build(): string;
    log(loggingFunction?: (message: string) => any): void;
}
export declare function createTextbox(title: string | undefined, contents: string): string;
export declare function createTable<T extends string>(header: string, keys: T[], data: {
    [Key in T]: string | number | boolean | {
        type: 'delimiter';
    };
}[], differentiateLines?: boolean | undefined): string;
export interface PaddingOptions {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}
export declare function applyPadding(str: string, padding?: PaddingOptions): string;
export {};
