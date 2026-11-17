/* Every film has every piece, everywhere (scripts/check-ripple.cjs, docs/RIPPLE.md). */
const { execFileSync } = require('child_process'), path = require('path');
try { process.stdout.write(execFileSync('node', [path.join(__dirname, '..', 'scripts', 'check-ripple.cjs')], { encoding: 'utf8' })); }
catch (e) { process.stdout.write(e.stdout || ''); console.error('ripple test failed'); process.exit(1); }
