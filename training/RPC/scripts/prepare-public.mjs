import * as esbuild from 'esbuild'
import shell from 'shelljs'

// setup & copy over css & html to public
shell.mkdir('-p', './public');
shell.cp('-fr', './src/static/*.css', './public/');
shell.cp('-fr', './src/static/*.html', './public');

// bundle rpc.ts, and also copy to public
await esbuild.build({
  entryPoints: ['./src/static/rpc.ts'],
  minify: true,
  sourcemap: true,
  bundle: true,
  outfile: './public/rpc.js',
});