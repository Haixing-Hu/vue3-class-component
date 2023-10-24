////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import babel from '@rollup/plugin-babel';

function getBasicConfig(format) {
  const config = {};
  switch (format) {
    case 'cjs':
      config.format = 'cjs';
      config.babelModules = 'cjs';
      break;
    case 'es':
      config.format = 'es';
      config.babelModules = false;
      break;
    default:
      throw new Error(`Unsupported library format: ${format}`);
  }
  config.minify = (process.env.NODE_ENV === 'production');
  config.filename = `vue3-class-component.${config.format}${config.minify ? '.min' : ''}.js`;
  return config;
}

function rollupOptions(format) {
  const config = getBasicConfig(format);
  return {
    external: ['vue', /@babel\/runtime/],
    input: 'src/index.js',
    output: {
      name: 'Vue3ClassComponent',
      file: `dist/${config.filename}`,
      format: config.format,
      compact: config.minify,
      sourcemap: true,
      globals: {
        vue: 'Vue',
      },
    },
    plugins: [
      babel({
        babelHelpers: 'runtime',
        exclude: ['node_modules/**'],
      }),
    ],
  };
}

export default [
  rollupOptions('cjs'),
  rollupOptions('es'),
];
