/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

module.exports = {
  verbose: false,
  testEnvironment: 'jest-environment-jsdom-global',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
    '\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@haixing_hu)',
  ],
  setupFilesAfterEnv: [
    'jest-extended/all',
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: ['**/src/**/*.js'],
};
