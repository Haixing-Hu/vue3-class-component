/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
// import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import babel from '@haixing_hu/vite-plugin-babel';

function getConfig() {
  const config = {};
  switch (process.env.LIBRARY_TYPE) {
    case 'umd':
      config.format = 'umd';
      config.babelModules = 'umd';
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

const config = getConfig();

const viteConfig = defineConfig({
  model: process.env.NODE_ENV,
  build: {
    lib: {
      entry: './src/index.js',
      name: 'Vue3ClassComponent',
      fileName: config.filename,
    },
    sourcemap: true,
    minify: (config.minify ? 'terser' : false),
    terserOptions: {
      compress: {
        drop_debugger: true,
        drop_console: false,
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        format: config.format,
        // dir: './dist',
        // file: `./dist/${config.filename}`,
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    babel({
      config: {
        configFile: false,
        babelrc: false,
        presets: [
          ['@babel/preset-env', { modules: config.babelModules }],
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          ['@babel/plugin-proposal-decorators', { 'version': '2023-05' }],
          '@babel/plugin-transform-class-properties',
        ],
      },
    }),
  ],
});

console.dir(viteConfig, { depth: null });

export default viteConfig;
