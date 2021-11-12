// rollup.config.js
import typescript from '@rollup/plugin-typescript';
// import typescript from 'rollup-plugin-typescript2';
// import { resolve } from 'path/posix';
import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import json from '@rollup/plugin-json';
import auto from '@rollup/plugin-auto-install'
import commonjs from 'rollup-plugin-commonjs';
import * as bn from 'bn.js'
import replace from 'rollup-plugin-replace'

// import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.umd.js',
    // dir: 'dist',
    name: 'effectSdk',
    format: 'umd', // umd, es, iife, cjs, amd, system
    sourcemap: true,

  },
   
  plugins: [
    resolve({  browser: true  }),
    typescript({ }),
    json({  }),
    sourceMaps({  }),
    replace({ 'process.env.NODE_DEBUG': false }),
    commonjs({ 
      namedExports: {
        'node_modules/@ethersproject/bignumber/node_modules/bn.js/lib/bn.js': ['bn'],

      }
    }),
    // commonjs({ include: [
    //   './node_modules/**',
    //   './src/**',
    // ] }),
    // auto(),

  ]
};