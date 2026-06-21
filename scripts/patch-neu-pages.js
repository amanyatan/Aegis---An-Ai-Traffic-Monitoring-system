const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'app');
const files = [
  'tabs/analytics.tsx',
  'tabs/live.tsx',
  'tabs/vehicles.tsx',
  'missing/index.tsx',
  'accident/index.tsx',
  'accident/[id].tsx',
  'violation/[id].tsx',
  'vehicle/[id].tsx',
];

const neuImport = `import { NeoScreen } from '@/components/ui/NeoScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill } from '@/constants/neubrutalism';
`;

for (const f of files) {
  const p = path.join(root, f);
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes('NeoScreen')) {
    console.log('skip', f);
    continue;
  }
  c = c.replace(/import \{ LinearGradient \} from 'expo-linear-gradient';\n/g, '');
  c = c.replace(
    /import \{ COLORS(?:, SEVERITY_COLORS|, STATUS_COLORS|, SEVERITY_COLORS, STATUS_COLORS)? \} from '@\/constants\/colors';\n/g,
    neuImport
  );
  c = c.replace(/import \{ SafeAreaView \} from 'react-native-safe-area-context';\n/g, '');
  c = c.replace(
    /<View style=\{styles\.container\}>\s*<LinearGradient colors=\{\[COLORS\.primary, COLORS\.secondary\]\} style=\{styles\.gradient\}>\s*<SafeAreaView style=\{styles\.safeArea\}>/g,
    '<NeoScreen padHorizontal scroll>'
  );
  c = c.replace(/<\/SafeAreaView>\s*<\/LinearGradient>\s*<\/View>/g, '</NeoScreen>');
  c = c.replace(/backgroundColor: COLORS\.primary/g, 'backgroundColor: NEU.paper');
  c = c.replace(/backgroundColor: COLORS\.glass/g, 'backgroundColor: NEU.paper');
  c = c.replace(/backgroundColor: COLORS\.secondary/g, 'backgroundColor: NEU.paper');
  c = c.replace(/backgroundColor: COLORS\.surface/g, 'backgroundColor: PALETTE.cyan');
  c = c.replace(/color: COLORS\.text/g, 'color: NEU.ink');
  c = c.replace(/color: COLORS\.textMuted/g, 'color: "#555"');
  c = c.replace(/color: COLORS\.softAccent/g, 'color: NEU.ink');
  c = c.replace(/borderColor: COLORS\.border/g, 'borderColor: NEU.ink');
  c = c.replace(/SEVERITY_COLORS/g, 'SEVERITY_NEU');
  c = c.replace(/STATUS_COLORS/g, 'STATUS_NEU');
  fs.writeFileSync(p, c);
  console.log('patched', f);
}
