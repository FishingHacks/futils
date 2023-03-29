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

import { fork } from 'child_process';
import { join } from 'path';

type maybePromise<T> = Promise<T> | T;

export interface Thread<
    Channel extends string = string,
    ChannelTypes extends Record<Channel, any> = Record<Channel, any>,
    ChannelReturnType extends Record<Channel, any> = Record<Channel, any>
> {
    readonly file: string;
    send<T extends Channel>(
        channel: T,
        data: ChannelTypes[T]
    ): Promise<ChannelReturnType[T]>;
    kill(): void;
    onMessage<T extends Channel>(
        message: T,
        cb: (data: ChannelReturnType[T]) => void
    ): () => void;
    onMessageOnce<T extends Channel>(
        message: T,
        cb: (data: ChannelReturnType[T]) => void
    ): () => void;
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

export function startThread<
    Channel extends string = string,
    ChannelTypes extends Record<Channel, any> = Record<Channel, any>,
    ChannelReturnType extends Record<Channel, any> = Record<Channel, any>
>(file: string): Thread<Channel, ChannelTypes, ChannelReturnType> {
    if (file.startsWith('./')) file = join(process.cwd(), file);
    const subprocess = fork(file);
    let running = false;
    subprocess.on('spawn', () => (running = true));

    if (subprocess.stderr) subprocess.stderr.pipe(process.stderr);
    if (subprocess.stdout) subprocess.stdout.pipe(process.stdout);
    if (subprocess.stdin) process.stdin.pipe(subprocess.stdin);

    let cbs: [(data: any) => void, () => void, string][] = [];

    function onMessage<T extends Channel>(
        message: T,
        cb: (data: ChannelReturnType[T]) => void
    ) {
        if (cbs.find((el) => el[2] === message && el[0] === cb)) return;
        function onMessage(data: any) {
            if (!data || typeof data !== 'object') return;
            if (data.channel !== message) return;
            cb(data.data);
        }
        subprocess.on('message', onMessage);
        function off() {
            cbs = cbs.filter((el) => el[2] === message && el[0] === cb);
            return subprocess.removeListener('message', onMessage);
        }

        cbs.push([cb, off, message]);
        return off;
    }

    const t: Thread<Channel, ChannelTypes, ChannelReturnType> = {
        file,
        isRunning() {
            return !subprocess.killed && subprocess.exitCode === null;
        },
        kill() {
            return subprocess.kill();
        },
        stop() {
            return subprocess.kill('SIGQUIT');
        },
        whenExit() {
            return new Promise((res) => {
                if (subprocess.killed || subprocess.exitCode !== null)
                    res(undefined);
                else subprocess.on('close', res);
            });
        },
        whenReady() {
            return new Promise((res) => {
                if (running && !subprocess.kill && subprocess.exitCode !== null)
                    return res();
                else if (!running) subprocess.on('spawn', res);
            });
        },
        onMessage,
        onMessageOnce(message, cb) {
            if (cbs.find((el) => el[2] === message && el[0] === cb)) return;
            function onMessage(data: any) {
                if (!data || typeof data !== 'object') return;
                if (data.channel !== message) return;
                cb(data.data);
                off();
            }
            subprocess.on('message', onMessage);
            function off() {
                cbs = cbs.filter((el) => el[2] === message && el[0] === cb);
                return subprocess.removeListener('message', onMessage);
            }

            cbs.push([cb, off, message]);
            return off;
        },
        removeListener(message, cb) {
            cbs.find((el) => el[2] === message && el[0] === cb)?.[1]();
        },
        send(channel, data) {
            subprocess.send({
                channel,
                data,
            });

            return new Promise((res) => {
                let unregister = () => {};
                unregister = onMessage(channel, (data) => {
                    unregister();
                    res(data);
                });
            });
        },
        __internaldata: {} as any,
    };

    return t;
}

export interface ThreadProcess<T extends Thread> {
    send<K extends T['__internaldata']['c']>(
        channel: K,
        data: T['__internaldata']['crt'][K]
    ): void;
    onMessage<K extends T['__internaldata']['c']>(
        channel: K,
        cb: (
            data: T['__internaldata']['ct'][K]
        ) => maybePromise<T['__internaldata']['crt'][K]>
    ): () => void;
    onMessageOnce<K extends T['__internaldata']['c']>(
        channel: K,
        cb: (
            data: T['__internaldata']['ct'][K]
        ) => maybePromise<T['__internaldata']['crt'][K]>
    ): () => void;
    removeListener(
        channel: T['__internaldata']['c'],
        cb: (data: any) => any
    ): void;
}

export function getThreadProcess<T extends Thread>(): ThreadProcess<T> {
    let cbs: [() => void, (data: any) => any, string][] = [];

    const proc: ThreadProcess<T> = {
        send(channel, data) {
            process.send({ channel, data });
        },
        onMessage(channel, cb) {
            if (cbs.find((el) => el[2] === channel && el[1] === cb)) return;
            async function onMessage(data: any) {
                if (
                    !data ||
                    typeof data !== 'object' ||
                    typeof data.channel !== 'string' ||
                    data.channel !== channel
                )
                    return;
                const for_send = { channel, data: await cb(data.data) };
                process.send(for_send);
            }
            process.on('message', onMessage);
            function off() {
                cbs = cbs.filter((el) => el[2] === channel && el[1] === cb);
                process.removeListener('message', onMessage);
            }

            cbs.push([off, cb, channel]);
            return off;
        },
        onMessageOnce(channel, cb) {
            if (cbs.find((el) => el[2] === channel && el[1] === cb)) return;
            async function onMessage(data: any) {
                if (
                    !data ||
                    typeof data !== 'object' ||
                    typeof data.channel !== 'string' ||
                    data.channel !== channel
                )
                    return;
                process.send({ channel, data: await cb(data.data) });
                off();
            }
            process.on('message', onMessage);
            function off() {
                cbs = cbs.filter((el) => el[2] === channel && el[1] === cb);
                process.removeListener('message', onMessage);
            }

            cbs.push([off, cb, channel]);
            return off;
        },
        removeListener(channel, cb) {
            cbs.find((el) => el[2] === channel && el[1] === cb)?.[0]();
        },
    };

    return proc;
}
