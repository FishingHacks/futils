import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const utilname = process.argv[2];
if (!utilname) {
    console.log('ERROR: No util name specified!');
    process.exit(1);
}
if (existsSync(join(__filename, '..', utilname))) {
    console.log('ERROR: No util already exists!');
    process.exit(1);
}

const utilFolder = join(__filename, '..', utilname);
mkdirSync(utilFolder);
writeFileSync(
    join(utilFolder, '.npmignore'),
    '*.ts\n' + 'out/\n' + 'build.js\n' + '!*.d.ts\n'
);
writeFileSync(
    join(utilFolder, 'index.ts'),
`/**
 * @author FishingHacks <https://github.com/FishingHacks>
 * @repository https://github.com/FishingHacks/js-utils/
 * @file https://github.com/FishingHacks/js-utils/tree/master/${utilname}/index.ts
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
 */`
);
writeFileSync(
    join(utilFolder, 'README.md'),
    `# ${utilname}\n\n\n\n**[Issues and Pull Requests](https://github.com/FishingHacks/futils/labels/${utilname})**`
);
writeFileSync(
    join(utilFolder, 'package.json'),
`{
  "name": "@futils/${utilname}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/FishingHacks/futils.git"
  },
  "keywords": [
    "TOML"
  ],
  "author": "FishingHacks",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/FishingHacks/futils/issues"
  },
  "homepage": "https://github.com/FishingHacks/futils#readme"
}`
);
