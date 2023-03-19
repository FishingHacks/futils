#! /bin/env node

const { mkdirSync, cpSync, readFileSync, writeFileSync, rmSync, existsSync } = require('fs');
const { join } = require('path');
const {spawnSync} = require('child_process')

if (existsSync(join(process.cwd(), 'out'))) rmSync(join(process.cwd(), 'out'), { recursive: true });
mkdirSync(join(process.cwd(), 'out'));
cpSync(join(process.cwd(), 'index.ts'), join(process.cwd(), 'out', 'node.ts'));
cpSync(join(process.cwd(), 'index.ts'), join(process.cwd(), 'out', 'browser.ts'));

writeFileSync(join(process.cwd(), 'out', 'browser.ts'), readFileSync(join(process.cwd(), 'out', 'browser.ts')).toString().replaceAll('export default ', '').replaceAll('export ', ''));
spawnSync('tsc', ['browser.ts', '--module', 'None', '--lib', 'es2021', '--outFile', 'browser.js'], { cwd: join(process.cwd(), 'out') }).output.forEach(buf => buf && process.stdout.write(buf));
spawnSync('tsc', ['node.ts', '--module', 'commonjs', '--target', 'es2021', '-d'], { cwd: join(process.cwd(), 'out') }).output.forEach(buf => buf && process.stdout.write(buf));

rmSync(join(process.cwd(), 'out', 'node.ts'));
rmSync(join(process.cwd(), 'out', 'browser.ts'));