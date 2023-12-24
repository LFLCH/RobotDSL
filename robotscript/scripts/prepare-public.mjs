import * as esbuild from 'esbuild'
import shell from 'shelljs'

shell.mkdir('-p', './public');
shell.cp('-fr', './src/static/*.html', './public');
shell.cp('-fr', './src/static/scripts/*.js', './public');


const srcFolderPath = './src/static/scripts';
const entryPoints = shell.find(srcFolderPath).filter(file => file.endsWith('.ts'));

await esbuild.build({
  entryPoints: entryPoints,
  minify: false,
  sourcemap: true,
  bundle: true,
  outdir: './public',
});
