/**
 * @author FishingHacks <https://github.com/FishingHacks>
 * @repository https://github.com/FishingHacks/js-utils/
 * @file https://github.com/FishingHacks/js-utils/tree/master/multi-threading/index.ts
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
type maybePromise<T> = Promise<T> | T;
export interface Thread<Channel extends string = string, ChannelTypes extends Record<Channel, any> = Record<Channel, any>, ChannelReturnType extends Record<Channel, any> = Record<Channel, any>> {
    readonly file: string;
    send<T extends Channel>(channel: T, data: ChannelTypes[T]): Promise<ChannelReturnType[T]>;
    kill(): void;
    onMessage<T extends Channel>(message: T, cb: (data: ChannelReturnType[T]) => void): () => void;
    onMessageOnce<T extends Channel>(message: T, cb: (data: ChannelReturnType[T]) => void): () => void;
    removeListener(message: Channel, cb: (data: any) => void): void;
    isRunning(): boolean;
    stop(): boolean;
    whenExit(): Promise<void>;
    whenReady(): Promise<void>;
    readonly __internaldata: {
        c: Channel;
        ct: ChannelTypes;
        crt: ChannelReturnType;
    };
}
export declare function startThread<Channel extends string = string, ChannelTypes extends Record<Channel, any> = Record<Channel, any>, ChannelReturnType extends Record<Channel, any> = Record<Channel, any>>(file: string): Thread<Channel, ChannelTypes, ChannelReturnType>;
export interface ThreadProcess<T extends Thread> {
    send<K extends T['__internaldata']['c']>(channel: K, data: T['__internaldata']['crt'][K]): void;
    onMessage<K extends T['__internaldata']['c']>(channel: K, cb: (data: T['__internaldata']['ct'][K]) => maybePromise<T['__internaldata']['crt'][K]>): () => void;
    onMessageOnce<K extends T['__internaldata']['c']>(channel: K, cb: (data: T['__internaldata']['ct'][K]) => maybePromise<T['__internaldata']['crt'][K]>): () => void;
    removeListener(channel: T['__internaldata']['c'], cb: (data: any) => any): void;
}
export declare function getThreadProcess<T extends Thread>(): ThreadProcess<T>;
export {};
