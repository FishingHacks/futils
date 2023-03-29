"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThreadProcess = exports.startThread = void 0;
const child_process_1 = require("child_process");
const path_1 = require("path");
function startThread(file) {
    if (file.startsWith('./'))
        file = (0, path_1.join)(process.cwd(), file);
    const subprocess = (0, child_process_1.fork)(file);
    let running = false;
    subprocess.on('spawn', () => (running = true));
    if (subprocess.stderr)
        subprocess.stderr.pipe(process.stderr);
    if (subprocess.stdout)
        subprocess.stdout.pipe(process.stdout);
    if (subprocess.stdin)
        process.stdin.pipe(subprocess.stdin);
    let cbs = [];
    function onMessage(message, cb) {
        if (cbs.find((el) => el[2] === message && el[0] === cb))
            return;
        function onMessage(data) {
            if (!data || typeof data !== 'object')
                return;
            if (data.channel !== message)
                return;
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
    const t = {
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
                else
                    subprocess.on('close', res);
            });
        },
        whenReady() {
            return new Promise((res) => {
                if (running && !subprocess.kill && subprocess.exitCode !== null)
                    return res();
                else if (!running)
                    subprocess.on('spawn', res);
            });
        },
        onMessage,
        onMessageOnce(message, cb) {
            if (cbs.find((el) => el[2] === message && el[0] === cb))
                return;
            function onMessage(data) {
                if (!data || typeof data !== 'object')
                    return;
                if (data.channel !== message)
                    return;
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
                let unregister = () => { };
                unregister = onMessage(channel, (data) => {
                    unregister();
                    res(data);
                });
            });
        },
        __internaldata: {},
    };
    return t;
}
exports.startThread = startThread;
function getThreadProcess() {
    let cbs = [];
    const proc = {
        send(channel, data) {
            process.send({ channel, data });
        },
        onMessage(channel, cb) {
            if (cbs.find((el) => el[2] === channel && el[1] === cb))
                return;
            async function onMessage(data) {
                if (!data ||
                    typeof data !== 'object' ||
                    typeof data.channel !== 'string' ||
                    data.channel !== channel)
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
            if (cbs.find((el) => el[2] === channel && el[1] === cb))
                return;
            async function onMessage(data) {
                if (!data ||
                    typeof data !== 'object' ||
                    typeof data.channel !== 'string' ||
                    data.channel !== channel)
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
exports.getThreadProcess = getThreadProcess;
