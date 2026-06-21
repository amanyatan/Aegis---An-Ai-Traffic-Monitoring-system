const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (name.endsWith('.tsx')) files.push(p);
  }
  return files;
}

const root = path.join(__dirname, '..', 'app');
for (const file of walk(root)) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('COLORS')) continue;
  if (c.includes("from '@/constants/colors'")) {
    c = c.replace(
      /import \{ COLORS(?:, [^}]+)? \} from '@\/constants\/colors';\n/g,
      ''
    );
  }
  if (c.includes('COLORS') && c.includes('@/constants/neubrutalism') && !c.match(/import \{[^}]*COLORS[^}]*\} from '@\/constants\/neubrutalism'/)) {
    c = c.replace(
      /from '@\/constants\/neubrutalism';/,
      (m, offset) => {
        const line = c.slice(0, offset).split('\n').pop() + m;
        if (line.includes('COLORS')) return m;
        return m.replace("';", ", COLORS';");
      }
    );
  }
  if (c.includes('COLORS') && !c.includes('@/constants/neubrutalism')) {
    c = c.replace(
      /(import .+\n)(?!import)/,
      "$1import { COLORS, NEU, PALETTE } from '@/constants/neubrutalism';\n"
    );
  }
  fs.writeFileSync(file, c);
  console.log('fixed', path.relative(root, file));
}
