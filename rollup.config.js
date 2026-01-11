import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const banner = '/* html-fireword v1.0.0 | MIT License */';

export default [
  // UMD development build
  {
    input: 'src/firework.js',
    output: {
      file: 'dist/firework.js',
      format: 'umd',
      name: 'Firework',
      banner,
      sourcemap: true
    },
    plugins: [resolve(), commonjs()]
  },
  // UMD production build (minified)
  {
    input: 'src/firework.js',
    output: {
      file: 'dist/firework.min.js',
      format: 'umd',
      name: 'Firework',
      banner
    },
    plugins: [resolve(), commonjs(), terser()]
  },
  // ESM build
  {
    input: 'src/firework.js',
    output: {
      file: 'dist/firework.esm.js',
      format: 'esm',
      banner,
      sourcemap: true
    },
    plugins: [resolve(), commonjs()]
  },
  // CommonJS build
  {
    input: 'src/firework.js',
    output: {
      file: 'dist/firework.cjs.js',
      format: 'cjs',
      banner,
      sourcemap: true
    },
    plugins: [resolve(), commonjs()]
  }
];
