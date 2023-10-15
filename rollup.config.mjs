/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import babel from '@rollup/plugin-babel';

function getBasicConfig() {
  const config = {};
  switch (process.env.LIBRARY_TYPE) {
    case 'cjs':
      config.format = 'cjs';
      config.babelModules = 'cjs';
      break;
    case 'es':
      config.format = 'es';
      config.babelModules = false;
      break;
    default:
      throw new Error(`Unsupported library type: ${process.env.LIBRARY_TYPE}`);
  }
  config.minify = (process.env.NODE_ENV === 'production');
  config.filename = `vue3-class-component.${config.format}${config.minify ? '.min' : ''}.js`;
  return config;
}

const basicConfig = getBasicConfig();

const rollupOptions = {
  external: ['vue', /@babel\/runtime/],
  input: 'src/index.js',
  output: {
    name: 'Vue3ClassComponent',
    file: `dist/${basicConfig.filename}`,
    format: basicConfig.format,
    compact: basicConfig.minify,
    sourcemap: true,
    globals: {
      vue: 'Vue',
    },
  },
  plugins: [
    babel({
      babelHelpers: 'runtime',
      exclude: [ 'node_modules/**' ],
    }),
  ],
};

// console.dir(rollupOptions, { depth: null });

export default rollupOptions;
