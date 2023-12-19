import * as esbuild from 'esbuild'
import shell from 'shelljs'

// // setup & copy over css & html to public
shell.mkdir('-p', './public');
// shell.cp('-fr', './src/static/*', './public/');
shell.cp('-fr', './src/static/*.html', './public');
shell.cp('-fr', './src/static/*.css', './public');
shell.cp('-fr', './src/static/scripts/*.js', './public');

// // bundle minilogo.ts, and also copy to public
// await esbuild.build({
//   entryPoints: ['./src/static/rbs-canvas.ts'],
//   minify: false,
//   sourcemap: true,
//   bundle: true,
//   outfile: './public/scripts/rbs-canvas.js',
// });

const srcFolderPath = './src/static/scripts';
const entryPoints = shell.find(srcFolderPath).filter(file => file.endsWith('.ts'));

await esbuild.build({
  entryPoints: entryPoints,
  minify: false,
  sourcemap: true,
  bundle: true,
  outdir: './public',
});
