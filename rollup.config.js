// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    name: 'bundle.umd.js',
    dir: 'dist',
    format: 'es2020' // umd, es, iife, cjs, amd, system, iife
  },
  plugins: [typescript()]
};