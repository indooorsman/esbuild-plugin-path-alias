const fs = require('fs');
const path = require('path');
const extensions = ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs', 'cjsx', 'mjsx'];

const patchExtension = (p) => {
  let isExisted = true;
  try {
    fs.accessSync(p, fs.constants.F_OK);
  } catch (e) {
    isExisted = false;
  }
  if (!isExisted) {
    const ext = extensions.find((t) => {
      const np = `${p}.${t}`;
      let isNpExisted = true;
      try {
        fs.accessSync(np, fs.constants.F_OK);
      } catch (e) {
        isNpExisted = false;
      }
      return isNpExisted;
    });
    if (ext) {
      return `${p}.${ext}`;
    }
    return p;
  }
  const stats = fs.statSync(p);
  const isFile = stats.isFile();
  const isDir = stats.isDirectory();
  if (isFile) {
    return p;
  }
  if (isDir) {
    const ext = extensions.find((t) => {
      const np = path.resolve(p, `./index.${t}`);
      let isNpExisted = true;
      try {
        fs.accessSync(np, fs.constants.F_OK);
      } catch (e) {
        isNpExisted = false;
      }
      return isNpExisted;
    });
    if (ext) {
      return path.resolve(p, `./index.${ext}`);
    }
  }
  return p;
};

/**
 * alias plugin
 * @description
 * config example:
 * ```
 * {
 *   '@lib': '/some/absolute/path'
 * }
 * ```
 * then `import { something } from '@lib/xxx'` will be transformed to
 * `import { something } from '/some/absolute/path/xxx'`
 * @param {object} config
 */
const aliasPlugin = (config) => {
  const alias = config && Object.keys(config);
  return {
    name: 'path-alias',

    setup(build) {
      if (!alias || !alias.length) {
        return;
      }

      const { logLevel } = build.initialOptions;
      const outputLogs = logLevel === 'debug' || logLevel === 'verbose';

      const main = (k, args) => {
        const targetPath = config[k].replace(/\/$/, '');
        const patchedPath = patchExtension(
          args.path
            .replace(new RegExp(`^${k}\\/`), targetPath + '/')
            .replace(new RegExp(`^${k}$`), targetPath)
        );
        outputLogs && console.log(
          `${new Date().toLocaleTimeString()} [plugin-path-alias] `,
          args.path,
          '=>',
          patchedPath
        );
        return {
          path: patchedPath
        };
      };

      alias.forEach((k) => {
        build.onResolve({ filter: new RegExp(`^${k}$`) }, (args) => {
          return main(k, args);
        });
        build.onResolve({ filter: new RegExp(`^${k}\\/.*$`) }, (args) => {
          return main(k, args);
        });
      });
    }
  };
};

module.exports = aliasPlugin;
