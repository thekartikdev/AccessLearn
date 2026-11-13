// Verifies English and Hindi dictionaries have identical keys, and lesson data has Hindi everywhere.
import { STRINGS } from '../src/utils/i18n.js';
import { LESSONS } from '../src/data/lessons.js';

let problems = 0;
const enKeys = Object.keys(STRINGS.en), hiKeys = Object.keys(STRINGS.hi);
for (const k of enKeys) if (!(k in STRINGS.hi)) { console.log('missing hi:', k); problems++; }
for (const k of hiKeys) if (!(k in STRINGS.en)) { console.log('extra hi:', k); problems++; }

const walk = (v, path) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if ('en' in v) {
      if (!('hi' in v)) { console.log('lesson missing hi at', path); problems++; }
      else if (Array.isArray(v.en) && v.en.length !== v.hi.length) { console.log('length mismatch at', path); problems++; }
    } else for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
};
LESSONS.forEach((l) => walk(l, l.id));
console.log(problems ? `${problems} problem(s)` : `i18n OK — ${enKeys.length} UI strings, ${LESSONS.length} lessons`);
process.exit(problems ? 1 : 0);
