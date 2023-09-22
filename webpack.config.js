/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
const { resolve } = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');

/**
 * Common configuration across all environments.
 */
const commonConfig = {
  entry: resolve(__dirname, 'main.js'),
  output: {
    filename: 'vue3-class-component.js',
    library: {
      name: 'vue3ClassComponent',
      type: 'umd',
    },
    globalObject: 'this',
  },
  devtool: 'source-map',
  mode: 'development',
  stats: 'summary',
  target: ['web', 'es5'],
  externals: {
    'vue': 'Vue',
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        resolve(__dirname, 'index.js'),
        resolve(__dirname, 'src'),
      ],
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        babelrc: false,         // replace .babelrc with babel.config.json
        rootMode: 'upward',
      },
    }],
  },
};

/**
 * Configuration for production environment.
 */
const productionConfig = {
  output: {
    filename: 'vue3-class-component.min.js',
  },
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_debugger: true,
            drop_console: false,
          },
        },
      }),
    ],
  },
};

/**
 * Module analysis configuration.
 */
const analyzerConfig = {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};

let config = commonConfig;
if (process.env.NODE_ENV === 'production') {
  config = merge(config, productionConfig);
}
if (process.env.USE_ANALYZER) {
  config = merge(config, analyzerConfig);
}
module.exports = config;
