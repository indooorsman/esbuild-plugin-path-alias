# esbuild-plugin-path-alias

[![npm version](https://img.shields.io/npm/v/esbuild-plugin-path-alias.svg?style=flat)](https://www.npmjs.com/package/esbuild-plugin-path-alias)
[![test](https://github.com/indooorsman/esbuild-plugin-path-alias/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/indooorsman/esbuild-plugin-path-alias/actions/workflows/test.yml)

A esbuild plugin to support path alias like `resolve.alias` in webpack config.

## Usage

```bash
npm install -D esbuild-plugin-path-alias
```

```js
const esbuild = require('esbuild');
const aliasPlugin = require('esbuild-plugin-path-alias');
const path = require('path');

esbuild.build({
  entryPoints: [path.resolve(__dirname, './app/app.jsx')],
  bundle: true,
  outdir: 'dist',
  external: ['react'],
  plugins: [
    aliasPlugin({
      // must be absolute path
      '@': path.resolve(__dirname, './app/component')
    })
  ],
  logLevel: 'debug'
});
```

See [test](https://github.com/indooorsman/esbuild-plugin-path-alias/tree/main/test) for details.