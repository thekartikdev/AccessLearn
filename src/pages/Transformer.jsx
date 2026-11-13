import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCheck, ChevronLeft, ChevronRight, CircleAlert, CircleCheck, FileText, FileUp, Info, ListChecks, Notebook, RotateCcw, Sparkles, StickyNote, Trash2, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../utils/supabaseClient.js';
import { Button, Card, DemoBadge, PageHeader, Spinner, Tabs } from '../components/ui.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import { LESSONS } from '../data/lessons.js';
import { formatBytes } from '../utils/dates.js';
import { pick } from '../utils/i18n.js';
import { questionsFor } from '../utils/lessons.js';

const MAX_BYTES = 10 * 1024 * 1024;
const STOP = new Set('the and for that with this from are was were have has had not but you your they them their there which what when where who how can could would should will its into than then also about more most some any all one two over such only other these those been being does did out our his her she him off per via too very each both few many much just like'.split(' '));
const KEYWORDS = { photosynthesis: ['photosynthesis', 'chlorophyll', 'chloroplast'], fractions: ['fraction', 'numerator', 'denominator'], 'binary-search': ['binary search', 'sorted list'], 'recursion-basics': ['nesting doll'], recursion: ['recursion', 'recursive', 'base case'], 'operating-systems': ['operating system', 'kernel', 'scheduler'] };

async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    const pdfjs = await import('pdfjs-dist');
    const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    let text = '';
    const pages = Math.min(doc.numPages, 30);
    for (let i = 1; i <= pages; i += 1) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      text += `${content.items.map((it) => it.str).join(' ')}\n`;
    }
    return { text, pages: doc.numPages };
  }
  return { text: await file.text() };
}

function analyse(text) {
  const words = text.toLowerCase().match(/[a-z\u0900-\u097f']{3,}/g) || [];
  const freq = {};
  words.forEach((w) => { if (!STOP.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const count = text.trim() ? text.trim().split(/\s+/).length : 0;
  return { count, minutes: Math.max(1, Math.round(count / 200)), top };
}

function matchTopic(text, name) {
  const hay = `${name} ${text}`.toLowerCase();
  return Object.entries(KEYWORDS).find(([, ks]) => ks.some((k) => hay.includes(k)))?.[0] || null;
}

const STEPS = ['Reading your file', 'Looking for key ideas', 'Building notes and flashcards', 'Writing revision points'];

export default function Transformer() {
  const { lang, custom, toast, addActivity } = useApp();
  const [file, setFile] = useState(null); // {name,size,sample?}
  const [extract, setExtract] = useState({ state: 'idle', text: '', pages: null, error: '' });
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const [stage, setStage] = useState('ready'); // ready | processing | done
  const [step, setStep] = useState(0);
  const [topicId, setTopicId] = useState('photosynthesis');
  const [matched, setMatched] = useState(false);
  const [tab, setTab] = useState('summary');
  const inputRef = useRef(null);

  useEffect(() => { document.title = 'Study material · AccessLearn'; }, []);

  const lesson = LESSONS.find((l) => l.id === topicId);
  const stats = useMemo(() => analyse(extract.text), [extract.text]);

  const reset = () => { setFile(null); setExtract({ state: 'idle', text: '', pages: null, error: '' }); setStage('ready'); setError(''); setMatched(false); if (inputRef.current) inputRef.current.value = ''; };

  const accept = async (f) => {
    setError('');
    setStage('ready');
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt', 'md'].includes(ext)) { setError('That file type is not supported. Please choose a PDF, TXT or MD file.'); return; }
    if (f.size === 0) { setError('That file is empty.'); return; }
    if (f.size > MAX_BYTES) { setError(`That file is ${formatBytes(f.size)}. The limit is 10 MB.`); return; }
    setFile({ name: f.name, size: f.size });
    setExtract({ state: 'reading', text: '', pages: null, error: '' });

    try {
      // 1. Local Extraction
      const { text, pages } = await extractText(f);
      const m = matchTopic(text, f.name);
      if (m) setTopicId(m);
      setMatched(!!m);
      setExtract({ state: 'done', text, pages: pages ?? null, error: text.trim() ? '' : 'No readable text was found.' });

      // 2. Upload to Supabase (if logged in)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const filePath = `${session.user.id}/${Date.now()}_${f.name}`;
        const { error: uploadError } = await supabase.storage
          .from('study-materials')
          .upload(filePath, f);

        if (uploadError) console.error('Upload failed:', uploadError);
        else toast('File saved to your cloud storage');
      }
    } catch {
      setExtract({ state: 'error', text: '', pages: null, error: 'We could not read text from this file. You can still try the demo output below.' });
    }
  };

  const useSample = () => {
    const l = LESSONS.find((x) => x.id === topicId);
    const text = l.simple.en.join('\n\n');
    setError('');
    setFile({ name: `sample-${l.id}.txt`, size: new Blob([text]).size, sample: true });
    setExtract({ state: 'done', text, pages: null, error: '' });
    setMatched(true);
    setStage('ready');
  };

  const transform = () => { setStage('processing'); setStep(0); setTab('summary'); };
  useEffect(() => {
    if (stage !== 'processing') return undefined;
    const ids = STEPS.map((_, i) => window.setTimeout(() => setStep(i + 1), (i + 1) * 550));
    const done = window.setTimeout(() => { setStage('done'); addActivity(1); toast('Demo output ready'); }, STEPS.length * 550 + 300);
    return () => { ids.forEach(window.clearTimeout); window.clearTimeout(done); };
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDrop = (e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) accept(f); };

  return (
    <div>
      <PageHeader title="Study material transformer" subtitle="Drop in a PDF or text file to preview its text and see how notes, flashcards and a quiz could look." actions={<DemoBadge>Outputs are demo content</DemoBadge>} />

      <p className="mb-6 flex gap-3 rounded-card border-2 border-example bg-example-soft p-4 font-semibold" role="note">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span>This prototype has no AI service. Your file’s text is read and counted locally in your browser, but the summary, notes, flashcards and quiz below are <b>pre-written demo content</b> for a sample topic. They are not generated from your file.</span>
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-4">
          <label
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-panel border-2 border-dashed p-8 text-center transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${drag ? 'border-ink bg-primary-soft' : 'border-muted/70 bg-surface hover:border-ink'}`}
          >
            <FileUp className="h-10 w-10 text-primary" aria-hidden="true" />
            <span className="text-lg font-extrabold">Drag a file here, or choose one</span>
            <span className="text-sm text-muted">PDF, TXT or MD · up to 10 MB</span>
            <span className="btn btn-secondary btn-sm mt-1 pointer-events-none">Choose file</span>
            <input ref={inputRef} type="file" accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" className="sr-only" onChange={(e) => e.target.files?.[0] && accept(e.target.files[0])} />
          </label>

          <div role="alert" aria-live="assertive">
            {error && <p className="flex gap-2 rounded-ctl border-2 border-danger bg-danger-soft p-3 font-bold text-danger"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />{error}</p>}
          </div>

          {!file && (
            <Card className="!p-4">
              <p className="mb-2 font-bold">No file handy? Use a sample document</p>
              <div className="flex flex-wrap items-center gap-2">
                <select aria-label="Sample document" className="input !w-auto" value={topicId} onChange={(e) => setTopicId(e.target.value)}>{LESSONS.map((l) => <option key={l.id} value={l.id}>{l.title.en}</option>)}</select>
                <Button variant="secondary" size="sm" onClick={useSample}><FileText className="h-4 w-4" aria-hidden="true" /> Use sample</Button>
              </div>
            </Card>
          )}

          {file && (
            <Card className="!p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl bg-primary-soft text-primary-deep"><FileText className="h-6 w-6" aria-hidden="true" /></span>
                <div className="min-w-0 flex-1"><p className="truncate font-extrabold">{file.name}</p><p className="text-sm text-muted">{formatBytes(file.size)}{file.sample ? ' · sample document' : ''}{extract.pages ? ` · ${extract.pages} pages` : ''}</p></div>
                <Button variant="ghost" size="sm" onClick={reset} aria-label={`Remove ${file.name}`}><Trash2 className="h-4 w-4" aria-hidden="true" /> Remove</Button>
              </div>

              {extract.state === 'reading' && <div className="mt-4"><Spinner label="Reading text from your file…" /></div>}
              {extract.error && <p role="alert" className="mt-4 flex gap-2 rounded-ctl border-2 border-example bg-example-soft p-3 text-sm font-semibold"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{extract.error}</p>}
              {extract.state === 'done' && extract.text.trim() && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-bold">Analysed in your browser</p>
                  <dl className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-ctl bg-sunken p-2"><dd className="font-display text-xl font-extrabold">{stats.count.toLocaleString()}</dd><dt className="text-xs text-muted">words</dt></div>
                    <div className="rounded-ctl bg-sunken p-2"><dd className="font-display text-xl font-extrabold">~{stats.minutes} min</dd><dt className="text-xs text-muted">to read</dt></div>
                    <div className="rounded-ctl bg-sunken p-2"><dd className="font-display text-xl font-extrabold">{extract.text.length.toLocaleString()}</dd><dt className="text-xs text-muted">characters</dt></div>
                  </dl>
                  {stats.top.length > 0 && <div><p className="mb-1 text-sm font-bold">Most frequent words</p><ul className="flex flex-wrap gap-1.5">{stats.top.map(([w, n]) => <li key={w} className="chip !py-0.5 text-xs">{w} · {n}</li>)}</ul></div>}
                  <div><p className="mb-1 text-sm font-bold">Text preview</p><pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-ctl bg-sunken p-3 font-sans text-sm" tabIndex={0} aria-label="Extracted text preview">{extract.text.slice(0, 1500)}{extract.text.length > 1500 ? '…' : ''}</pre></div>
                </div>
              )}
            </Card>
          )}

          {file && extract.state !== 'reading' && (
            <Card className="space-y-3 !p-4">
              <label className="block"><span className="label">Demo content to show</span>
                <select className="input" value={topicId} onChange={(e) => { setTopicId(e.target.value); setMatched(false); setStage('ready'); }}>{LESSONS.map((l) => <option key={l.id} value={l.id}>{l.title.en}</option>)}</select></label>
              <p className="text-sm text-muted">{matched ? <>This file mentions ideas from <b>{lesson.title.en}</b>, so we preselected that demo topic.</> : <>We did not recognise a sample topic in this file, so you are choosing which demo content to preview.</>}</p>
              <Button onClick={transform} disabled={stage === 'processing'} className="w-full" size="lg"><Sparkles className="h-5 w-5" aria-hidden="true" /> {stage === 'done' ? 'Run the demo again' : 'Transform (demo)'}</Button>
            </Card>
          )}
        </div>

        <div>
          {stage === 'ready' && (
            <div className="flex h-full min-h-[18rem] flex-col items-center justify-center rounded-panel border-2 border-dashed border-line p-8 text-center">
              <Layers className="mb-3 h-10 w-10 text-muted" aria-hidden="true" />
              <p className="text-lg font-extrabold">Your study tools will appear here</p>
              <p className="mt-1 max-w-sm text-muted">Add a file or pick a sample document, then choose Transform.</p>
            </div>
          )}
          {stage === 'processing' && (
            <Card className="border-2 !border-ink" aria-live="polite">
              <Spinner label="Preparing demo output…" />
              <ol className="mt-5 space-y-3">{STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 font-bold ${i < step ? 'text-visual-deep' : i === step ? 'text-ink' : 'text-muted'}`}>
                  {i < step ? <CircleCheck className="h-5 w-5" aria-hidden="true" /> : <span className={`h-5 w-5 rounded-full border-2 ${i === step ? 'animate-pulse border-ink' : 'border-line'}`} aria-hidden="true" />}{s}
                </li>))}</ol>
              <div className="mt-6 space-y-3" aria-hidden="true">{[90, 70, 80].map((w) => <div key={w} className="shimmer h-4 rounded-full bg-sunken" style={{ width: `${w}%` }} />)}</div>
            </Card>
          )}
          {stage === 'done' && <Results lesson={lesson} lang={lang} custom={custom} tab={tab} setTab={setTab} />}
        </div>
      </div>
    </div>
  );
}

/* ───────── Output tabs ───────── */
function Results({ lesson, lang, custom, tab, setTab }) {
  const qs = useMemo(() => questionsFor(lesson, custom), [lesson, custom]);
  const tabs = [
    { id: 'summary', label: 'Summary', icon: StickyNote }, { id: 'notes', label: 'Notes', icon: Notebook },
    { id: 'cards', label: 'Flashcards', icon: Layers }, { id: 'quiz', label: 'Quiz', icon: ListChecks }, { id: 'revision', label: 'Revision points', icon: CheckCheck },
  ];
  return (
    <div className="animate-rise">
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-ctl border-2 border-dashed border-muted/70 p-3 text-sm font-bold">
        <DemoBadge>Demo content</DemoBadge> Pre-written for “{pick(lesson.title, lang)}”, not generated from your file.
      </div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Study tools" />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="card mt-0 rounded-t-none border-t-0 p-5 sm:p-6">
        {tab === 'summary' && (
          <div className="space-y-4"><h2 className="text-2xl font-extrabold">{pick(lesson.title, lang)}: summary</h2>
            <p className="text-lg leading-relaxed">{pick(lesson.simple, lang)[0]}</p>
            <ul className="space-y-2">{pick(lesson.keyPoints, lang).map((k) => <li key={k} className="flex gap-2 font-semibold"><CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-visual-deep" aria-hidden="true" />{k}</li>)}</ul></div>
        )}
        {tab === 'notes' && (
          <div className="space-y-5"><h2 className="text-2xl font-extrabold">Study notes</h2>
            {pick(lesson.simple, lang).map((p, i) => <div key={i}><h3 className="font-extrabold text-primary-deep">Note {i + 1}</h3><p className="mt-1 text-lg leading-relaxed">{p}</p></div>)}
            <div className="rounded-ctl border-2 border-example bg-example-soft p-4"><h3 className="font-extrabold">Example: {pick(lesson.example.title, lang)}</h3><p className="mt-1">{pick(lesson.example.body, lang)[0]}</p></div></div>
        )}
        {tab === 'cards' && <Flashcards qs={qs} lang={lang} />}
        {tab === 'quiz' && <MiniQuiz key={lesson.id} qs={qs.slice(0, 3)} lang={lang} />}
        {tab === 'revision' && <Revision key={lesson.id} lesson={lesson} lang={lang} qs={qs} />}
      </div>
    </div>
  );
}

function Flashcards({ qs, lang }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [known, setKnown] = useState({});
  const q = qs[i];
  if (!q) return <p>No flashcards available.</p>;
  const move = (d) => { setI((x) => (x + d + qs.length) % qs.length); setFlip(false); };
  const knownCount = Object.values(known).filter(Boolean).length;
  return (
    <div>
      <div className="mb-3 flex justify-between text-sm font-bold"><span>Card {i + 1} of {qs.length}</span><span>{knownCount} marked “got it”</span></div>
      <button type="button" onClick={() => setFlip((f) => !f)} aria-pressed={flip} aria-label={flip ? 'Showing answer. Select to show the question.' : 'Showing question. Select to show the answer.'} className={`flex min-h-[15rem] w-full flex-col items-center justify-center rounded-panel border-2 border-ink p-6 text-center shadow-pop transition ${flip ? 'bg-visual-soft' : 'bg-surface'}`}>
        <span className="mb-3 text-xs font-bold text-muted">{flip ? 'ANSWER' : 'QUESTION'} · tap to flip</span>
        {flip ? <><span className="text-xl font-extrabold">{pick(q.options, lang)[q.answer]}</span><span className="mt-3 max-w-md">{pick(q.explain, lang)}</span></> : <span className="text-xl font-extrabold">{pick(q.prompt, lang)}</span>}
      </button>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => move(-1)} aria-label="Previous card"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></Button><Button variant="secondary" size="sm" onClick={() => move(1)} aria-label="Next card"><ChevronRight className="h-4 w-4" aria-hidden="true" /></Button></div>
        <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => { setKnown({ ...known, [q.id]: false }); move(1); }}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Review again</Button><Button size="sm" onClick={() => { setKnown({ ...known, [q.id]: true }); move(1); }}><CircleCheck className="h-4 w-4" aria-hidden="true" /> Got it</Button></div>
      </div>
    </div>
  );
}

function MiniQuiz({ qs, lang }) {
  const { t } = useApp();
  const [ans, setAns] = useState({});
  const score = qs.filter((q) => ans[q.id] === q.answer).length;
  return (
    <div className="space-y-6">
      {qs.map((q, n) => <div key={q.id} className="rounded-card border-2 border-line p-4"><p className="mb-2 text-sm font-bold text-practice-deep">Question {n + 1} of {qs.length}</p><QuestionCard q={q} lang={lang} t={t} name={`tq-${q.id}`} selected={ans[q.id]} revealed={ans[q.id] != null} onSelect={(i) => setAns((a) => (a[q.id] != null ? a : { ...a, [q.id]: i }))} /></div>)}
      {Object.keys(ans).length === qs.length && <p role="status" className="rounded-ctl border-2 border-practice bg-practice-soft p-3 text-lg font-extrabold">You got {score} of {qs.length} correct.</p>}
    </div>
  );
}

function Revision({ lesson, lang, qs }) {
  const points = pick(lesson.keyPoints, lang);
  const [done, setDone] = useState([]);
  const tags = [...new Map(qs.map((q) => [q.tag.en, pick(q.tag, lang)])).values()];
  return (
    <div>
      <h2 className="text-2xl font-extrabold">Revision points</h2>
      <p className="mb-3 text-sm text-muted">{done.length} of {points.length} revised</p>
      <ul className="space-y-2">{points.map((p, i) => (
        <li key={p} className="flex items-start gap-3 rounded-ctl border border-line p-3">
          <input id={`rv-${i}`} type="checkbox" className="mt-1 h-5 w-5 accent-primary" checked={done.includes(i)} onChange={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))} />
          <label htmlFor={`rv-${i}`} className={`cursor-pointer font-semibold ${done.includes(i) ? 'text-muted line-through' : ''}`}>{p}</label>
        </li>))}</ul>
      <h3 className="mb-2 mt-5 font-extrabold">Concepts to be able to explain</h3>
      <ul className="flex flex-wrap gap-2">{tags.map((tg) => <li key={tg} className="chip">{tg}</li>)}</ul>
    </div>
  );
}
