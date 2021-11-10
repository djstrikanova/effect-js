// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    name: 'bundle.umd.js',
    dir: 'dist',
    format: 'iife' // umd, es, iife, cjs, amd, system, iife
  },
  plugins: [typescript()]
};