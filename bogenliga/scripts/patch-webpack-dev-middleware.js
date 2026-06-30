const fs = require('fs');
const path = require('path');

const candidates = [
  path.join(__dirname, '..', 'node_modules', 'webpack-dev-middleware', 'lib', 'util.js'),
  path.join(
    __dirname,
    '..',
    'node_modules',
    '@angular-devkit',
    'build-angular',
    'node_modules',
    'webpack-dev-middleware',
    'lib',
    'util.js'
  )
];

const unsafeCheck = 'if (req.headers.range) {';
const safeCheck = 'if (req.headers && req.headers.range) {';

for (const file of candidates) {
  if (!fs.existsSync(file)) {
    continue;
  }

  const source = fs.readFileSync(file, 'utf8');
  if (source.includes(safeCheck)) {
    continue;
  }

  if (!source.includes(unsafeCheck)) {
    throw new Error(`Unexpected webpack-dev-middleware source in ${file}`);
  }

  fs.writeFileSync(file, source.replace(unsafeCheck, safeCheck));
  console.log(`Patched ${path.relative(process.cwd(), file)}`);
}
