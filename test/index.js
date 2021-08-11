const esbuild = require('esbuild');
const aliasPlugin = require('../index');
const path = require('path');

esbuild.build({
  entryPoints: [path.resolve(__dirname, './app/app.jsx')],
  bundle: true,
  outdir: 'dist',
  external: ['react'],
  plugins: [
    aliasPlugin({
      '@': path.resolve(__dirname, './app/component')
    })
  ],
  logLevel: 'debug'
});
