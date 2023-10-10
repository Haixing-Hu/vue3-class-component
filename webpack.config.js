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
  entry: resolve(__dirname, 'index.js'),
  devtool: 'source-map',
  stats: 'summary',
  externals: {
    'vue': 'vue',
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
 * Configuration for UMD output format in the development environment.
 */
const umdDevelopmentConfig = {
  mode: 'development',
  target: ['web', 'es5'],
  output: {
    filename: 'vue3-class-component.umd.js',
    library: {
      name: 'Vue3ClassComponent',
      type: 'umd',
    },
    globalObject: 'this',
  },
};

/**
 * Configuration for UMD output format in the production environment.
 */
const umdProductionConfig = {
  mode: 'production',
  target: ['web', 'es5'],
  output: {
    filename: 'vue3-class-component.umd.min.js',
    library: {
      name: 'Vue3ClassComponent',
      type: 'umd',
    },
    globalObject: 'this',
  },
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
 * Configuration for ESM output format in the development environment.
 */
const esmDevelopmentConfig = {
  mode: 'development',
  target: ['web', 'es6'],
  experiments: {
    outputModule: true,
  },
  output: {
    filename: 'vue3-class-component.esm.js',
    library: {
      // name: 'Vue3ClassComponent',
      type: 'module',
    },
    globalObject: 'this',
		chunkFormat: 'module',
		module: true,
  },
};

/**
 * Configuration for ESM output format in the production environment.
 */
const esmProductionConfig = {
  mode: 'production',
  target: ['web', 'es6'],
  experiments: {
    outputModule: true,
  },
  output: {
    filename: 'vue3-class-component.esm.min.js',
    library: {
      // name: 'Vue3ClassComponent',
      type: 'module',
    },
    globalObject: 'this',
		chunkFormat: 'module',
		module: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          module: true,
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
switch (process.env.LIBRARY_TYPE) {
  case 'umd':
    if (process.env.NODE_ENV === 'production') {
      config = merge(config, umdProductionConfig);
    } else {
      config = merge(config, umdDevelopmentConfig);
    }
    if (process.env.USE_ANALYZER) {
      config = merge(config, analyzerConfig);
    }
    break;
  case 'esm':
    if (process.env.NODE_ENV === 'production') {
      config = merge(config, esmProductionConfig);
    } else {
      config = merge(config, esmDevelopmentConfig);
    }
    break;
  default:
    throw new Error('Unsupported library type: ' + process.env.LIBRARY_TYPE);
}

console.log(`Building vue3-class-component in "${process.env.NODE_ENV}" mode as "${process.env.LIBRARY_TYPE}" library...`);

module.exports = config;
