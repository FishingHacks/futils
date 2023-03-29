# futils

A library of one-file utils for nodejs. All modules that dont use imports should be able to be used in the browser.

## Utils

| NPM Package                                                            | Typescript File (`.ts`)                        | Javascript File (`.js`)                        | Types File (`.d.ts`)                             | Uses imports | help                                     |
| ---------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------------ | ------------ | ---------------------------------------- |
| [`@futils/toml-writer`](https://npmjs.com/@futils/toml-writer)         | [toml-writer/](./toml-writer/index.ts)         | [toml-writer/](./toml-writer/index.js)         | [toml-writer/](./toml-writer/index.d.ts)         | [ ] No       | [README.MD](./toml-writer/README.MD)     |
| [`@futils/multi-threading`](https://npmjs.com/@futils/multi-threading) | [multi-threading/](./multi-threading/index.ts) | [multi-threading/](./multi-threading/index.js) | [multi-threading/](./multi-threading/index.d.ts) | [x] Yes      | [README.MD](./multi-threading/README.MD) |
