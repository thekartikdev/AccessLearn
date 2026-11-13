import { useId, useMemo, useState } from 'react';
import { ChevronRight, RotateCcw, StepForward, StepBack } from 'lucide-react';
import { pick } from '../utils/i18n.js';

const clean = (s) => s.replace(/[^a-zA-Z0-9]/g, '');
const L = (lang) => (en, hi) => (lang === 'hi' ? hi : en);

function DetailBox({ children, tone = 'bg-visual-soft border-visual text-ink' }) {
  return <div aria-live="polite" className={`mt-4 rounded-ctl border-2 p-4 font-medium ${tone}`}>{children}</div>;
}

function Chips({ items, value, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="mt-3 flex flex-wrap gap-2">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          aria-pressed={value === it.id}
          onClick={() => onChange(value === it.id ? null : it.id)}
          className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition ${value === it.id ? 'border-ink bg-ink text-bg' : 'border-line bg-surface hover:border-ink'}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ───────── Photosynthesis ───────── */
function Photosynthesis({ lang }) {
  const l = L(lang);
  const uid = clean(useId());
  const [sel, setSel] = useState(null);
  const parts = [
    { id: 'sun', label: l('Sunlight', 'सूरज की रोशनी'), text: l('Sunlight is the energy source. Chlorophyll in the leaf captures it.', 'सूरज की रोशनी ऊर्जा का स्रोत है। पत्ती का क्लोरोफ़िल इसे पकड़ता है।') },
    { id: 'water', label: l('Water', 'पानी'), text: l('Water is absorbed by the roots and carried up the stem to the leaf.', 'पानी जड़ों से सोखा जाता है और तने से होकर पत्ती तक पहुँचता है।') },
    { id: 'co2', label: l('Carbon dioxide', 'कार्बन डाइऑक्साइड'), text: l('Carbon dioxide enters through tiny leaf openings called stomata.', 'कार्बन डाइऑक्साइड रंध्र नाम के छोटे छेदों से पत्ती में आती है।') },
    { id: 'glucose', label: l('Glucose', 'ग्लूकोज़'), text: l('Glucose is the sugar the plant makes and uses as food.', 'ग्लूकोज़ वह शर्करा है जो पौधा बनाता है और भोजन की तरह इस्तेमाल करता है।') },
    { id: 'o2', label: l('Oxygen', 'ऑक्सीजन'), text: l('Oxygen is released into the air as a by-product. We breathe it.', 'ऑक्सीजन सह-उत्पाद के रूप में हवा में छोड़ी जाती है। हम उसी में साँस लेते हैं।') },
  ];
  const dim = (id) => (sel && sel !== id ? 'opacity-25' : 'opacity-100');
  const mk = (n, cls) => (
    <marker id={`${uid}-${n}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" className={cls} />
    </marker>
  );
  return (
    <div>
      <svg viewBox="0 0 640 340" className="w-full rounded-ctl bg-sunken" role="img"
        aria-label={l('Diagram: sunlight, water and carbon dioxide enter a leaf; glucose and oxygen come out.', 'चित्र: सूरज की रोशनी, पानी और कार्बन डाइऑक्साइड पत्ती में जाते हैं; ग्लूकोज़ और ऑक्सीजन निकलते हैं।')}>
        <defs>{mk('s', 'fill-example')}{mk('w', 'fill-simple')}{mk('c', 'fill-ink')}{mk('o', 'fill-listen')}</defs>
        <rect y="270" width="640" height="70" className="fill-example-soft" />
        {/* stem + roots */}
        <path d="M345 215 L345 275 M345 275 C 330 300, 300 305, 280 320 M345 275 C 360 300, 390 310, 410 322" className={`fill-none stroke-visual ${dim('water')}`} strokeWidth="6" strokeLinecap="round" />
        {/* leaf */}
        <g className={dim('glucose')}>
          <path d="M235 190 C 255 85, 405 70, 475 150 C 445 250, 320 270, 235 190 Z" className="fill-visual-soft stroke-visual" strokeWidth="4" />
          <path d="M245 188 C 320 170, 400 160, 462 150" className="fill-none stroke-visual" strokeWidth="2.5" strokeDasharray="6 6" />
          <text x="350" y="148" textAnchor="middle" className="fill-ink text-[17px] font-bold">{l('Glucose', 'ग्लूकोज़')}</text>
          <text x="350" y="214" textAnchor="middle" className="fill-visual-deep text-[13px] font-bold">{l('chloroplasts', 'क्लोरोप्लास्ट')}</text>
        </g>
        {/* sun */}
        <g className={dim('sun')}>
          <circle cx="86" cy="72" r="34" className="fill-example" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1={86 + 44 * Math.cos((a * Math.PI) / 180)} y1={72 + 44 * Math.sin((a * Math.PI) / 180)} x2={86 + 56 * Math.cos((a * Math.PI) / 180)} y2={72 + 56 * Math.sin((a * Math.PI) / 180)} className="stroke-example" strokeWidth="5" strokeLinecap="round" />
          ))}
          <line x1="130" y1="108" x2="240" y2="165" className="stroke-example" strokeWidth="5" strokeLinecap="round" markerEnd={`url(#${uid}-s)`} />
          <text x="86" y="140" textAnchor="middle" className="fill-ink text-[14px] font-bold">{l('Sunlight', 'रोशनी')}</text>
        </g>
        {/* water */}
        <g className={dim('water')}>
          <path d="M120 300 q-10 -16 0 -28 q10 12 0 28z" className="fill-simple" />
          <path d="M150 312 q-8 -13 0 -22 q8 9 0 22z" className="fill-simple" />
          <line x1="165" y1="300" x2="268" y2="312" className="stroke-simple" strokeWidth="4" strokeLinecap="round" markerEnd={`url(#${uid}-w)`} />
          <text x="130" y="258" textAnchor="middle" className="fill-ink text-[14px] font-bold">{l('Water', 'पानी')} (H₂O)</text>
        </g>
        {/* CO2 */}
        <g className={dim('co2')}>
          <text x="560" y="232" textAnchor="middle" className="fill-ink text-[20px] font-extrabold">CO₂</text>
          <line x1="535" y1="215" x2="458" y2="190" className="stroke-ink" strokeWidth="4" strokeLinecap="round" markerEnd={`url(#${uid}-c)`} />
        </g>
        {/* O2 */}
        <g className={dim('o2')}>
          <line x1="452" y1="112" x2="530" y2="70" className="stroke-listen" strokeWidth="4" strokeLinecap="round" markerEnd={`url(#${uid}-o)`} />
          <text x="560" y="72" textAnchor="middle" className="fill-listen-deep text-[20px] font-extrabold">O₂</text>
        </g>
      </svg>
      <Chips items={parts} value={sel} onChange={setSel} label={l('Parts of the diagram', 'चित्र के भाग')} />
      {sel && <DetailBox>{parts.find((p) => p.id === sel).text}</DetailBox>}
    </div>
  );
}

/* ───────── Fractions ───────── */
function Pie({ n, d, size = 170 }) {
  const c = size / 2, r = size / 2 - 6;
  const slice = (i) => {
    const a0 = (i / d) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
    return `M${c} ${c} L${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} Z`;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${n}/${d}`}>
      {d === 1 ? (
        <circle cx={c} cy={c} r={r} className={`${n ? 'fill-visual' : 'fill-surface'} stroke-ink`} strokeWidth="2.5" />
      ) : (
        Array.from({ length: d }, (_, i) => <path key={i} d={slice(i)} className={`${i < n ? 'fill-visual' : 'fill-surface'} stroke-ink`} strokeWidth="2" />)
      )}
    </svg>
  );
}

function Fractions({ lang }) {
  const l = L(lang);
  const [d, setD] = useState(8);
  const [n, setN] = useState(3);
  const [twin, setTwin] = useState(true);
  const num = Math.min(n, d);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-8 rounded-ctl bg-sunken p-5">
        <figure className="text-center">
          <Pie n={num} d={d} />
          <figcaption className="mt-2 font-display text-3xl font-extrabold">{num}/{d}</figcaption>
        </figure>
        {twin && (
          <>
            <span className="font-display text-3xl font-extrabold" aria-hidden="true">=</span>
            <figure className="text-center">
              <Pie n={num * 2} d={d * 2} />
              <figcaption className="mt-2 font-display text-3xl font-extrabold">{num * 2}/{d * 2}</figcaption>
            </figure>
          </>
        )}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">{l('Denominator: equal pieces in the whole', 'हर: पूरे में बराबर टुकड़े')} — <b>{d}</b></span>
          <input type="range" min="1" max="12" value={d} onChange={(e) => setD(+e.target.value)} className="w-full accent-primary" />
        </label>
        <label className="block">
          <span className="label">{l('Numerator: pieces you have', 'अंश: आपके पास टुकड़े')} — <b>{num}</b></span>
          <input type="range" min="0" max={d} value={num} onChange={(e) => setN(+e.target.value)} className="w-full accent-primary" />
        </label>
      </div>
      <label className="mt-3 inline-flex min-h-[44px] cursor-pointer items-center gap-2 font-bold">
        <input type="checkbox" checked={twin} onChange={(e) => setTwin(e.target.checked)} className="h-5 w-5 accent-primary" />
        {l('Show an equal fraction (double the pieces)', 'बराबर भिन्न दिखाएँ (टुकड़े दुगने)')}
      </label>
      <DetailBox>
        {l(`${num} of ${d} equal pieces are shaded, so the fraction is ${num}/${d}. Cutting every piece in half gives ${num * 2}/${d * 2}: the shaded area is exactly the same.`,
          `${d} बराबर टुकड़ों में से ${num} रंगे हैं, इसलिए भिन्न ${num}/${d} है। हर टुकड़े को आधा करने पर ${num * 2}/${d * 2} मिलता है: रंगा हुआ क्षेत्र बिल्कुल वही रहता है।`)}
      </DetailBox>
    </div>
  );
}

/* ───────── Binary search ───────── */
const ARR = [3, 8, 12, 19, 23, 31, 40, 47, 55, 62, 71, 80];
const initBS = { lo: 0, hi: ARR.length - 1, mid: null, status: 'ready', log: [] };

function BinarySearch({ lang }) {
  const l = L(lang);
  const [target, setTarget] = useState(23);
  const [s, setS] = useState(initBS);
  const reset = (t = target) => { setTarget(t); setS(initBS); };
  const step = () => {
    if (s.status === 'found' || s.status === 'missing') return;
    if (s.lo > s.hi) {
      setS({ ...s, status: 'missing', mid: null, log: [...s.log, l('The range is empty, so the target is not in the list.', 'दायरा खाली है, इसलिए लक्ष्य सूची में नहीं है।')] });
      return;
    }
    const mid = Math.floor((s.lo + s.hi) / 2);
    const v = ARR[mid];
    const n = s.log.length + 1;
    if (v === target) {
      setS({ ...s, mid, status: 'found', log: [...s.log, l(`Step ${n}: the middle is ${v}. That is the target. Found it!`, `कदम ${n}: बीच का तत्व ${v} है। यही लक्ष्य है। मिल गया!`)] });
    } else if (target < v) {
      setS({ lo: s.lo, hi: mid - 1, mid, status: 'searching', log: [...s.log, l(`Step ${n}: the middle is ${v}. ${target} is smaller, so keep the left half.`, `कदम ${n}: बीच का तत्व ${v} है। ${target} छोटा है, इसलिए बायाँ आधा रखें।`)] });
    } else {
      setS({ lo: mid + 1, hi: s.hi, mid, status: 'searching', log: [...s.log, l(`Step ${n}: the middle is ${v}. ${target} is larger, so keep the right half.`, `कदम ${n}: बीच का तत्व ${v} है। ${target} बड़ा है, इसलिए दायाँ आधा रखें।`)] });
    }
  };
  const finished = s.status === 'found' || s.status === 'missing';
  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="label">{l('Target to find', 'ढूँढने का लक्ष्य')}</span>
          <select className="input !w-auto" value={target} onChange={(e) => reset(+e.target.value)}>
            {[23, 71, 3, 80, 50].map((v) => (
              <option key={v} value={v}>{v}{ARR.includes(v) ? '' : l(' (not in list)', ' (सूची में नहीं)')}</option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-primary" onClick={step} disabled={finished}><StepForward className="h-4 w-4" aria-hidden="true" /> {l('Next step', 'अगला कदम')}</button>
        <button type="button" className="btn btn-secondary" onClick={() => reset()}><RotateCcw className="h-4 w-4" aria-hidden="true" /> {l('Reset', 'रीसेट')}</button>
      </div>
      <ol className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-12" aria-label={l('Sorted list', 'सॉर्टेड सूची')}>
        {ARR.map((v, i) => {
          const inRange = i >= s.lo && i <= s.hi;
          const isMid = i === s.mid;
          const found = s.status === 'found' && isMid;
          return (
            <li
              key={v}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 font-display text-lg font-extrabold transition ${
                found ? 'border-ink bg-visual text-ink' : isMid ? 'border-ink bg-example text-ink' : inRange ? 'border-primary bg-primary-soft' : 'border-line bg-sunken text-muted opacity-50 line-through'
              }`}
            >
              {v}
              <span className="text-[10px] font-semibold opacity-70">{i}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-sm text-muted">{l('Yellow: item just checked. Blue: still in the search range. Faded: ruled out.', 'पीला: अभी जाँचा गया तत्व। नीला: अभी भी खोज के दायरे में। फीका: हटाया जा चुका।')}</p>
      <DetailBox tone={s.status === 'found' ? 'bg-visual-soft border-visual text-ink' : s.status === 'missing' ? 'bg-danger-soft border-danger text-ink' : 'bg-primary-soft border-primary text-ink'}>
        {s.log.length === 0
          ? l(`Press “Next step” to look at the middle item. Linear search could need up to ${ARR.length} checks; binary search needs at most 4 here.`, `“अगला कदम” दबाकर बीच का तत्व देखें। लीनियर सर्च में ${ARR.length} तक जाँचें लग सकती हैं; यहाँ बाइनरी सर्च में ज़्यादा से ज़्यादा 4।`)
          : <ul className="space-y-1">{s.log.map((x, i) => <li key={i}>{x}</li>)}</ul>}
      </DetailBox>
    </div>
  );
}

/* ───────── Recursion (call stack for factorial) ───────── */
const fact = (m) => (m <= 1 ? 1 : m * fact(m - 1));

function Recursion({ lang }) {
  const l = L(lang);
  const [n, setN] = useState(3);
  const [step, setStep] = useState(0);
  const total = 2 * (n + 1);
  const pushed = Math.min(step, n + 1);
  const returned = Math.max(0, step - (n + 1));
  const frames = Array.from({ length: pushed }, (_, i) => ({ m: n - i, back: i >= n + 1 - returned }));
  let msg;
  if (step === 0) msg = l('Press “Next” to make the first call.', '“अगला” दबाकर पहली कॉल करें।');
  else if (step <= n + 1) {
    const m = n - (step - 1);
    msg = m === 0 ? l('factorial(0) is the base case. It answers 1 directly and makes no more calls.', 'factorial(0) बेस केस है। यह सीधे 1 लौटाता है और आगे कॉल नहीं करता।') : l(`Call factorial(${m}). It needs factorial(${m - 1}) first, so it waits.`, `factorial(${m}) कॉल हुआ। उसे पहले factorial(${m - 1}) चाहिए, इसलिए वह इंतज़ार करता है।`);
  } else {
    const m = returned - 1;
    msg = l(`factorial(${m}) returns ${fact(m)}.`, `factorial(${m}) का उत्तर ${fact(m)} लौटता है।`);
  }
  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="label">{l('Compute factorial of', 'इसका फ़ैक्टोरियल निकालें')} — <b>{n}</b></span>
          <input type="range" min="1" max="5" value={n} onChange={(e) => { setN(+e.target.value); setStep(0); }} className="w-44 accent-primary" />
        </label>
        <button type="button" className="btn btn-secondary" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0}><StepBack className="h-4 w-4" aria-hidden="true" /> {l('Back', 'पीछे')}</button>
        <button type="button" className="btn btn-primary" onClick={() => setStep((x) => Math.min(total, x + 1))} disabled={step === total}><StepForward className="h-4 w-4" aria-hidden="true" /> {l('Next', 'अगला')}</button>
        <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}><RotateCcw className="h-4 w-4" aria-hidden="true" /> {l('Reset', 'रीसेट')}</button>
      </div>
      <div className="mt-5 flex min-h-[15rem] flex-col justify-end gap-2 rounded-ctl bg-sunken p-4" aria-label={l('Call stack', 'कॉल स्टैक')}>
        {frames.length === 0 && <p className="py-10 text-center text-muted">{l('The call stack is empty.', 'कॉल स्टैक खाली है।')}</p>}
        {[...frames].reverse().map((f) => (
          <div key={f.m} className={`flex animate-pop flex-wrap items-center justify-between gap-2 rounded-lg border-2 px-4 py-2.5 font-bold ${f.m === 0 ? 'border-ink bg-example' : f.back ? 'border-visual bg-visual-soft' : 'border-line bg-surface'}`}>
            <code className="text-base">factorial({f.m}){f.m === 0 ? ' = 1' : ` = ${f.m} × factorial(${f.m - 1})`}</code>
            <span className="text-sm">{f.back ? `→ ${fact(f.m)}` : f.m === 0 ? l('base case', 'बेस केस') : l('waiting…', 'इंतज़ार…')}</span>
          </div>
        ))}
        <p className="text-center text-xs font-bold text-muted">{l('top of the stack ↑', 'स्टैक का ऊपरी भाग ↑')}</p>
      </div>
      <DetailBox tone="bg-primary-soft border-primary text-ink">{msg}</DetailBox>
    </div>
  );
}

/* ───────── Recursion basics (nesting dolls) ───────── */
function Dolls({ lang }) {
  const l = L(lang);
  const sizes = [150, 124, 100, 76, 52];
  const [open, setOpen] = useState(1);
  const done = open === sizes.length;
  return (
    <div>
      <div className="flex items-end justify-center gap-3 rounded-ctl bg-sunken px-3 py-6 sm:gap-6" role="img" aria-label={l('Five nesting dolls, each smaller than the last', 'पाँच नेस्टिंग गुड़ियाँ, हर एक पिछली से छोटी')}>
        {sizes.map((h, i) => {
          const isOpen = i < open;
          const last = i === sizes.length - 1;
          return (
            <div key={h} className="flex flex-col items-center gap-1">
              <div
                className={`flex items-end justify-center rounded-t-full rounded-b-2xl border-2 border-ink pb-2 text-xs font-extrabold transition ${last && isOpen ? 'bg-example' : isOpen ? 'bg-listen-soft' : 'bg-surface opacity-60'}`}
                style={{ width: h * 0.55, height: h }}
              >
                {last && isOpen ? l('base case', 'बेस केस') : isOpen ? `#${i + 1}` : ''}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-3">
        <button type="button" className="btn btn-primary" onClick={() => setOpen((o) => Math.min(sizes.length, o + 1))} disabled={done}><ChevronRight className="h-4 w-4" aria-hidden="true" /> {l('Open the next doll', 'अगली गुड़िया खोलें')}</button>
        <button type="button" className="btn btn-secondary" onClick={() => setOpen(1)}><RotateCcw className="h-4 w-4" aria-hidden="true" /> {l('Reset', 'रीसेट')}</button>
      </div>
      <DetailBox tone={done ? 'bg-example-soft border-example text-ink' : 'bg-primary-soft border-primary text-ink'}>
        {done
          ? l('The smallest doll does not open. That is the base case: stop here and start returning answers.', 'सबसे छोटी गुड़िया नहीं खुलती। यही बेस केस है: यहाँ रुकें और उत्तर लौटाना शुरू करें।')
          : l(`Doll ${open} is open. Inside is a smaller copy of the same problem. Keep going.`, `गुड़िया ${open} खुली है। अंदर उसी समस्या की छोटी कॉपी है। आगे बढ़ते रहें।`)}
      </DetailBox>
    </div>
  );
}

/* ───────── Operating systems (layers) ───────── */
function OperatingSystems({ lang }) {
  const l = L(lang);
  const [sel, setSel] = useState('os');
  const info = {
    apps: { title: l('Applications', 'एप्लिकेशन'), items: ['Browser', 'Game', 'Editor'], text: l('Apps do the work you see. They never touch hardware directly; they ask the OS.', 'ऐप्स वह काम करते हैं जो आप देखते हैं। वे हार्डवेयर को सीधे नहीं छूते; वे OS से माँगते हैं।'), cls: 'bg-simple-soft border-simple' },
    os: { title: l('Operating system', 'ऑपरेटिंग सिस्टम'), items: [l('Scheduler', 'शेड्यूलर'), l('Memory manager', 'मेमोरी मैनेजर'), l('File system', 'फ़ाइल प्रणाली'), l('Drivers', 'ड्राइवर')], text: l('The OS shares the processor and memory, manages files and talks to devices through drivers.', 'OS प्रोसेसर और मेमोरी बाँटता है, फ़ाइलें संभालता है और ड्राइवरों के ज़रिए डिवाइसों से बात करता है।'), cls: 'bg-visual-soft border-visual' },
    hw: { title: l('Hardware', 'हार्डवेयर'), items: ['CPU', 'RAM', l('Disk', 'डिस्क'), l('Network', 'नेटवर्क')], text: l('The physical parts. The OS decides who uses them and when.', 'भौतिक पुर्ज़े। OS तय करता है कि उन्हें कौन और कब इस्तेमाल करेगा।'), cls: 'bg-example-soft border-example' },
  };
  const order = ['apps', 'os', 'hw'];
  return (
    <div>
      <div className="space-y-2 rounded-ctl bg-sunken p-4">
        {order.map((k, idx) => (
          <div key={k}>
            <button
              type="button"
              aria-pressed={sel === k}
              onClick={() => setSel(k)}
              className={`w-full rounded-ctl border-2 p-3 text-left transition ${info[k].cls} ${sel === k ? 'ring-4 ring-ink/25 !border-ink' : 'opacity-80 hover:opacity-100'}`}
            >
              <span className="block font-display text-lg font-extrabold">{info[k].title}</span>
              <span className="mt-2 flex flex-wrap gap-2">
                {info[k].items.map((it) => <span key={it} className="rounded-md border border-ink/30 bg-surface px-2 py-0.5 text-sm font-bold">{it}</span>)}
              </span>
            </button>
            {idx < order.length - 1 && <p className="py-1 text-center text-sm font-bold text-muted" aria-hidden="true">⇅ {idx === 0 ? l('system calls', 'सिस्टम कॉल') : l('device control', 'डिवाइस नियंत्रण')}</p>}
          </div>
        ))}
      </div>
      <DetailBox tone={`${info[sel].cls} text-ink`}><b>{info[sel].title}.</b> {info[sel].text}</DetailBox>
    </div>
  );
}

/* ───────── Generic concept tree (teacher-made lessons) ───────── */
function ConceptTree({ lesson, lang }) {
  const points = pick(lesson.keyPoints, lang) || [];
  const [sel, setSel] = useState(0);
  return (
    <div>
      <div className="rounded-ctl bg-sunken p-5">
        <div className="mx-auto w-fit max-w-full rounded-ctl border-2 border-ink bg-primary px-5 py-3 text-center font-display text-xl font-extrabold text-primary-on shadow-pop-sm">{pick(lesson.title, lang)}</div>
        <div className="mx-auto h-6 w-0.5 bg-ink" aria-hidden="true" />
        <div className="grid gap-2 sm:grid-cols-2">
          {points.map((p, i) => (
            <button key={i} type="button" aria-pressed={sel === i} onClick={() => setSel(i)} className={`rounded-ctl border-2 p-3 text-left font-semibold transition ${sel === i ? 'border-ink bg-example-soft' : 'border-line bg-surface hover:border-ink'}`}>
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-bg">{i + 1}</span>{p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const REGISTRY = {
  photosynthesis: Photosynthesis,
  fractions: Fractions,
  'binary-search': BinarySearch,
  recursion: Recursion,
  'recursion-basics': Dolls,
  'operating-systems': OperatingSystems,
};

export default function LessonVisual({ lesson, lang }) {
  const Cmp = REGISTRY[lesson.visual];
  const key = useMemo(() => `${lesson.id}-${lang}`, [lesson.id, lang]);
  return Cmp ? <Cmp key={key} lang={lang} /> : <ConceptTree key={key} lesson={lesson} lang={lang} />;
}
