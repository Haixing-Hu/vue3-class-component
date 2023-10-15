/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { defineConfig } from 'vite';
import babel from '@haixing_hu/vite-plugin-babel';

export default defineConfig({
  plugins: [
    babel(),                                // must after the vue plugin
  ],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'istanbul',
    },
  },
});
