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
export declare function writeString(str: string): string;
export declare function writeNumber(num: number, format?: 'octal' | 'hex' | 'bin' | 'base-10'): string;
export declare function writeBoolean(value: boolean): string;
export declare function writeDate(date: Date | number): string;
export declare function writeBigInt(value: BigInt | bigint): string;
export declare function writeFunction(fn: ((...args: any[]) => any) | Function): string;
export declare function writeSymbol(symbol: Symbol): string;
export declare function writeKey(key: string): string;
export declare function writeValue(value: unknown): string;
export declare function writeInlineObject(obj: Record<string, any>): string;
export declare function writeArray(arr: any[]): string;
export declare function defineCustomWriters(writers: Record<string, (obj: any) => string>): void;
export default function write(obj: Record<string, any>): string;
