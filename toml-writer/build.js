#! /bin/env node
/**
 * @author FishingHacks <https://github.com/FishingHacks>
 * @repository https://github.com/FishingHacks/js-utils/
 * @file https://github.com/FishingHacks/js-utils/tree/master/toml-writer/build.js
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

const { mkdirSync, cpSync, readFileSync, writeFileSync, rmSync, existsSync } = require('fs');
const { join } = require('path');
const { spawnSync } = require('child_process')
const { writeHeader } = require('../file-header');

if (existsSync(join(process.cwd(), 'out'))) rmSync(join(process.cwd(), 'out'), { recursive: true });
mkdirSync(join(process.cwd(), 'out'));
cpSync(join(process.cwd(), 'index.ts'), join(process.cwd(), 'out', 'node.ts'));
cpSync(join(process.cwd(), 'index.ts'), join(process.cwd(), 'out', 'browser.ts'));

writeFileSync(join(process.cwd(), 'out', 'browser.ts'), readFileSync(join(process.cwd(), 'out', 'browser.ts')).toString().replaceAll('export default ', '').replaceAll('export ', ''));
spawnSync('tsc', ['browser.ts', '--module', 'None', '--lib', 'es2021', '--outFile', 'browser.js'], { cwd: join(process.cwd(), 'out') }).output.forEach(buf => buf && process.stdout.write(buf));
spawnSync('tsc', ['node.ts', '--module', 'commonjs', '--target', 'es2021', '-d'], { cwd: join(process.cwd(), 'out') }).output.forEach(buf => buf && process.stdout.write(buf));

rmSync(join(process.cwd(), 'out', 'node.ts'));
rmSync(join(process.cwd(), 'out', 'browser.ts'));