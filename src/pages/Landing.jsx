import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenText, ClipboardCheck, Compass, FileUp, Flame, GraduationCap, HeartHandshake, Languages, Mountain, Play, Square, Sparkles, Ear, Keyboard, Eye, Contrast, Type, Volume2, MonitorSmartphone } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Button, DemoBadge, ProgressBar, Ring, Segmented } from '../components/ui.jsx';
import LessonVisual from '../components/Visuals.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import WeeklyChart from '../components/WeeklyChart.jsx';
import { LESSONS } from '../data/lessons.js';
import { HOW_STEPS, SAMPLE_STATS, SAMPLE_TESTIMONIALS } from '../data/landing.js';
import { FORMATS } from '../utils/formats.js';
import { makeT, pick } from '../utils/i18n.js';
import { useSpeech } from '../hooks/useSpeech.js';

/* ───────── Hero: a live miniature of One Concept, Many Ways ───────── */
const HERO_LESSONS = ['photosynthesis', 'fractions', 'binary-search', 'recursion'];

function HeroConcept() {
  const [lessonId, setLessonId] = useState('photosynthesis');
  const [format, setFormat] = useState('simple');
  const [lang, setLang] = useState('en');
  const [ans, setAns] = useState(null);
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const t = makeT(lang);
  const sp = useSpeech({ lang });
  const meta = FORMATS.find((f) => f.id === format);
  const q = lesson.questions[0];
  const stopSpeech = sp.stop;

  useEffect(() => { setAns(null); stopSpeech(); }, [lessonId, format, lang, stopSpeech]);

  return (
    <div className="relative">
      <div className="card overflow-hidden border-2 !border-ink shadow-pop" role="region" aria-label="Live demo: one concept, five ways">
        <div className={`flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink px-4 py-3 ${meta.cls.soft}`}>
          <label className="flex items-center gap-2 font-bold">
            <span className="sr-only">Choose a concept</span>
            <select className="rounded-lg border-2 border-ink bg-surface px-2.5 py-1.5 font-bold" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
              {HERO_LESSONS.map((id) => <option key={id} value={id}>{pick(LESSONS.find((l) => l.id === id).title, lang)}</option>)}
            </select>
          </label>
          <Segmented label="Language" value={lang} onChange={setLang} options={[{ value: 'en', label: 'EN' }, { value: 'hi', label: 'हिं' }]} />
        </div>
        <div className="border-b border-line p-3">
          <Segmented
            label="Way of learning"
            value={format}
            onChange={setFormat}
            fill
            options={FORMATS.map((f) => ({ value: f.id, label: t(`lesson.${f.id}Short`), icon: f.icon }))}
          />
        </div>
        <div className="min-h-[21rem] animate-rise p-5" key={`${lessonId}-${format}-${lang}`}>
          {format === 'simple' && (
            <div className="space-y-3">
              <p className="text-lg font-semibold leading-relaxed">{pick(lesson.simple, lang)[0]}</p>
              <ul className="space-y-1.5 rounded-ctl bg-simple-soft p-4 font-semibold text-simple-deep">
                {pick(lesson.keyPoints, lang).slice(0, 3).map((p) => <li key={p}>• {p}</li>)}
              </ul>
            </div>
          )}
          {format === 'visual' && <LessonVisual lesson={lesson} lang={lang} />}
          {format === 'listen' && (
            <div>
              <div className="flex items-center gap-3 rounded-ctl bg-listen-soft p-4">
                {sp.status === 'playing' ? (
                  <Button onClick={sp.stop}><Square className="h-4 w-4" aria-hidden="true" /> {t('lesson.stop')}</Button>
                ) : (
                  <Button onClick={() => sp.speak(pick(lesson.simple, lang).slice(0, 2))} disabled={!sp.isSupported}><Play className="h-4 w-4" aria-hidden="true" /> {t('lesson.play')}</Button>
                )}
                <div className="flex h-8 flex-1 items-end gap-1" aria-hidden="true">
                  {Array.from({ length: 22 }, (_, i) => <span key={i} className={`w-full origin-bottom rounded-full bg-listen ${sp.status === 'playing' ? 'animate-wave' : 'opacity-40'}`} style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 6) * 90}ms` }} />)}
                </div>
              </div>
              {!sp.isSupported && <p className="mt-3 text-sm font-semibold">{t('lesson.noSpeech')}</p>}
              {sp.isSupported && lang === 'hi' && !sp.hasVoice && <p className="mt-3 text-sm font-semibold">{t('lesson.noVoice')}</p>}
              <p className="mt-4 text-lg leading-relaxed text-muted">{pick(lesson.simple, lang)[0]}</p>
            </div>
          )}
          {format === 'example' && (
            <div>
              <h3 className="text-xl font-extrabold">{pick(lesson.example.title, lang)}</h3>
              <p className="mt-2 text-lg leading-relaxed">{pick(lesson.example.body, lang)[0]}</p>
              <ul className="mt-3 space-y-1 rounded-ctl bg-example-soft p-4 font-semibold text-example-deep">
                {pick(lesson.example.mapsTo, lang).map((m) => <li key={m}>→ {m}</li>)}
              </ul>
            </div>
          )}
          {format === 'practice' && <QuestionCard q={q} lang={lang} t={t} name="hero-q" selected={ans} revealed={ans != null} onSelect={setAns} />}
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-muted">This is a live preview. Try the five formats, then switch language.</p>
    </div>
  );
}

/* ───────── Dashboard preview (illustrative) ───────── */
const PREVIEW_WEEK = [{ day: 'Mon', minutes: 20 }, { day: 'Tue', minutes: 35 }, { day: 'Wed', minutes: 15 }, { day: 'Thu', minutes: 40 }, { day: 'Fri', minutes: 30 }, { day: 'Sat', minutes: 45 }, { day: 'Sun', minutes: 25, today: true }];

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-panel border-2 border-ink bg-surface shadow-pop" aria-label="Illustrative preview of the learner dashboard" role="group">
      <div className="flex items-center gap-2 border-b-2 border-ink bg-sunken px-4 py-2.5" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-listen" /><span className="h-3 w-3 rounded-full bg-example" /><span className="h-3 w-3 rounded-full bg-visual" />
        <span className="ml-3 rounded-md bg-surface px-3 py-0.5 text-xs font-bold text-muted">accesslearn · dashboard</span>
      </div>
      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-3" aria-hidden="false">
        <div className="rounded-card bg-ink p-5 text-bg lg:col-span-2">
          <p className="text-sm font-bold opacity-80">Continue learning</p>
          <p className="mt-1 text-2xl font-extrabold">Binary search</p>
          <div className="mt-4 max-w-sm"><div className="mb-1 flex justify-between text-sm font-bold"><span>3 of 5 ways explored</span></div><ProgressBar value={3} max={5} label="Lesson progress" colorClass="bg-example" className="!bg-bg/20" height="h-3" /></div>
        </div>
        <div className="flex items-center gap-3 rounded-card border border-line p-5"><Flame className="h-9 w-9 text-listen" aria-hidden="true" /><div><p className="font-display text-3xl font-extrabold leading-none">6</p><p className="text-sm font-bold text-muted">day streak</p></div></div>
        <div className="rounded-card border border-line p-4 lg:col-span-2">
          <p className="mb-1 font-extrabold">This week</p>
          <WeeklyChart data={PREVIEW_WEEK} label="Minutes studied" unit="min" height={170} />
        </div>
        <div className="rounded-card border border-line p-4">
          <p className="mb-3 font-extrabold">Topic mastery</p>
          <div className="flex flex-wrap gap-4">
            {[['Fractions', 58, 'text-example'], ['Recursion', 72, 'text-visual'], ['OS', 44, 'text-listen']].map(([n, v, c]) => (
              <div key={n} className="text-center"><Ring value={v} size={64} stroke={8} colorClass={c} label={`${n} ${v}%`}><span className="text-sm">{v}%</span></Ring><p className="mt-1 text-xs font-bold">{n}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Accessibility try-out (scoped to the preview box) ───────── */
function AccessTryout() {
  const [lang, setLang] = useState('en');
  const [size, setSize] = useState(110);
  const [contrast, setContrast] = useState(false);
  const [reading, setReading] = useState(false);
  const t = makeT(lang);
  const text = lang === 'hi'
    ? 'पौधे अपना भोजन खुद बनाते हैं। इस प्रक्रिया को प्रकाश संश्लेषण कहते हैं, और यह ज़्यादातर पत्तियों में होती है।'
    : 'Plants make their own food. This process is called photosynthesis, and it happens mostly in the leaves.';
  return (
    <div className="card border-2 !border-ink p-5 shadow-pop">
      <h3 className="text-lg font-extrabold">Try it right here</h3>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div><span className="label">{t('common.language')}</span><Segmented label="Language" value={lang} onChange={setLang} options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी' }]} /></div>
        <label className="block"><span className="label">{t('lesson.textSize')}: {size}%</span><input type="range" min="90" max="170" step="10" value={size} onChange={(e) => setSize(+e.target.value)} className="w-40 accent-primary" /></label>
        <button type="button" role="switch" aria-checked={contrast} onClick={() => setContrast((c) => !c)} className={`btn btn-sm ${contrast ? 'btn-primary' : 'btn-secondary'}`}><Contrast className="h-4 w-4" aria-hidden="true" /> {t('set.contrast')}</button>
        <button type="button" role="switch" aria-checked={reading} onClick={() => setReading((c) => !c)} className={`btn btn-sm ${reading ? 'btn-primary' : 'btn-secondary'}`}><Type className="h-4 w-4" aria-hidden="true" /> {t('lesson.reading')}</button>
      </div>
      <div
        className={`mt-5 rounded-ctl border-2 p-5 transition ${contrast ? 'border-[#ffdd00] bg-black text-white' : reading ? 'border-[#e0d8c2] bg-[#fbf8ee] text-[#111c33]' : 'border-line bg-sunken'}`}
        style={{ fontSize: `${size / 100}rem`, lineHeight: reading ? 2 : 1.6, fontFamily: reading ? 'Lexend, system-ui, sans-serif' : undefined, letterSpacing: reading ? '0.02em' : undefined }}
      >
        {text}
      </div>
    </div>
  );
}

function Section({ id, className = '', children, label }) {
  return <section id={id} aria-label={label} className={`scroll-mt-20 ${className}`}><div className="mx-auto max-w-6xl px-4 sm:px-8">{children}</div></section>;
}
function H2({ children, sub, className = '' }) {
  return (
    <div className={`mb-10 max-w-2xl ${className}`}>
      <h2 className="text-3xl font-extrabold sm:text-5xl">{children}</h2>
      {sub && <p className="mt-4 text-lg text-muted">{sub}</p>}
    </div>
  );
}

const FEATURES = [
  { id: 'many', span: 'md:col-span-4', icon: Sparkles, color: 'bg-simple', title: 'One Concept, Many Ways', body: 'Every lesson comes as a simple explanation, a visual you can explore, audio, a real-life example and practice questions. Switch formats without losing your place.', to: '/learn/fractions', cta: 'Try a lesson', pills: true },
  { id: 'quiz', span: 'md:col-span-2', icon: ClipboardCheck, color: 'bg-practice', title: 'Adaptive quizzes', body: 'Instant feedback, a reason behind every answer, and a next lesson chosen from what you missed.', to: '/quiz', cta: 'Take a quiz' },
  { id: 'parent', span: 'md:col-span-2', icon: HeartHandshake, color: 'bg-listen', title: 'ParentBridge', body: 'Encouraging summaries and simple home activities for parents and guardians.', to: '/parent', cta: 'See ParentBridge' },
  { id: 'teacher', span: 'md:col-span-2', icon: GraduationCap, color: 'bg-visual', title: 'Teacher tools', body: 'See class learning gaps, then write lessons and quiz questions in minutes.', to: '/teacher', cta: 'Open teacher view' },
  { id: 'study', span: 'md:col-span-2', icon: FileUp, color: 'bg-example', title: 'Study material tool', body: 'Drop in a PDF or text file and preview notes, flashcards and revision points (demo content).', to: '/transformer', cta: 'Open the tool' },
  { id: 'growth', span: 'md:col-span-3', icon: Mountain, color: 'bg-example', title: 'GrowthQuest', body: 'Milestones, badges and progress rings that celebrate your own improvement. No leaderboards, no comparing.', to: '/growth', cta: 'See your growth' },
  { id: 'lang', span: 'md:col-span-3', icon: Languages, color: 'bg-simple', title: 'Language and accessibility', body: 'English and Hindi in the core experience, plus text size, high contrast, reading mode, reduced motion and read-aloud.', to: '/settings', cta: 'Open settings' },
];

export default function Landing() {
  const { user } = useApp();
  useEffect(() => { document.title = 'AccessLearn — Learning Without Limits'; }, []);

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-line">
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden="true" />
        <Section label="Introduction" className="relative">
          <div className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-20">
            <div className="animate-rise">
              <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-example px-3.5 py-1 text-sm font-bold text-ink"><Compass className="h-4 w-4" aria-hidden="true" /> One platform. Every learner. Every stage of life.</p>
              <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] sm:text-7xl">Learning Without Limits.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
                AccessLearn adapts to how <em className="not-italic font-bold text-ink">you</em> learn: in your language, at your pace, in the format that finally makes it click. Built for school students, college learners, adults, parents and teachers.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to={user ? '/dashboard' : '/signup'} size="lg">{user ? 'Open dashboard' : 'Start Learning'} <ArrowRight className="h-5 w-5" aria-hidden="true" /></Button>
                <Button href="#features" variant="secondary" size="lg">Explore Features</Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2 text-sm font-bold" aria-label="Who it is for">
                {['School students', 'College students', 'Adult learners', 'Parents', 'Teachers'].map((x, i) => (
                  <li key={x} className="chip"><span className={`h-2.5 w-2.5 rounded-full ${['bg-simple', 'bg-visual', 'bg-listen', 'bg-example', 'bg-practice'][i]}`} aria-hidden="true" />{x}</li>
                ))}
              </ul>
            </div>
            <HeroConcept />
          </div>
        </Section>
      </div>

      {/* Dashboard preview */}
      <Section label="Dashboard preview" className="py-16 sm:py-24">
        <H2 sub="Streaks, mastery rings and a clear next step. Nothing noisy, nothing judgmental.">A dashboard that knows where you left off</H2>
        <DashboardPreview />
        <p className="mt-3 text-center text-sm text-muted">Illustrative preview using demo data.</p>
      </Section>

      {/* Features */}
      <Section id="features" label="Features" className="pb-16 sm:pb-24">
        <H2 sub="Everything a learner, parent or teacher needs, working in your browser today.">Built around how people actually learn</H2>
        <div className="grid gap-4 md:grid-cols-6">
          {FEATURES.map((f) => (
            <article key={f.id} className={`card group flex flex-col p-6 transition hover:border-ink ${f.span}`}>
              <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-ctl border-2 border-ink ${f.color} text-ink`}><f.icon className="h-6 w-6" aria-hidden="true" /></span>
              <h3 className="text-2xl font-extrabold">{f.title}</h3>
              <p className="mt-2 flex-1 text-muted">{f.body}</p>
              {f.pills && (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Five formats">
                  {FORMATS.map((x) => <li key={x.id} className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-sm font-bold ${x.cls.soft} ${x.cls.deep}`}><x.icon className="h-4 w-4" aria-hidden="true" />{{ simple: 'Simple', visual: 'Visual', listen: 'Listen', example: 'Example', practice: 'Practice' }[x.id]}</li>)}
                </ul>
              )}
              <Link to={f.to} className="mt-4 inline-flex items-center gap-1.5 font-bold text-primary underline-offset-4 hover:underline">{f.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </Section>

      {/* One Concept, Many Ways */}
      <div id="many-ways" className="scroll-mt-20 bg-ink py-16 text-bg sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="font-bold text-example">The signature idea</p>
            <h2 className="mt-2 text-4xl font-extrabold sm:text-6xl">One concept, many ways.</h2>
            <p className="mt-5 max-w-lg text-lg opacity-80">No two minds take in an idea the same way. AccessLearn presents the same concept five ways, so a learner who struggles with a paragraph can try a picture, a voice or a story, and keep going.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={user ? '/learn/fractions' : '/signup'} className="!border-bg !bg-example !text-ink !shadow-none hover:brightness-95" size="lg">Try a lesson <ArrowRight className="h-5 w-5" aria-hidden="true" /></Button>
            </div>
          </div>
          <ol className="space-y-3">
            {[
              ['simple', 'Simple explanation', 'Plain words and key points for readers who want less jargon.'],
              ['visual', 'Visual summary', 'Diagrams you can click, slide and step through.'],
              ['listen', 'Listen', 'Read aloud with a highlighted transcript, in English or Hindi.'],
              ['example', 'Real-life example', 'An everyday comparison that gives the idea somewhere to land.'],
              ['practice', 'Practice', 'Questions with instant, kind feedback and reasons.'],
            ].map(([id, title, body], i) => {
              const f = FORMATS.find((x) => x.id === id);
              return (
                <li key={id} className="flex items-start gap-4 rounded-card border-2 border-bg/20 p-4" style={{ marginLeft: `${(i % 2) * 1.25}rem` }}>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl ${f.cls.solid} text-ink`}><f.icon className="h-6 w-6" aria-hidden="true" /></span>
                  <div><p className="text-lg font-extrabold">{title}</p><p className="opacity-75">{body}</p></div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* ParentBridge */}
      <Section id="parentbridge" label="ParentBridge" className="py-16 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-bold text-listen-deep">For parents and guardians</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">ParentBridge: help without the homework fights</h2>
            <p className="mt-4 text-lg text-muted">See what your child is doing well, what to practise, and one small thing to try this week. Calm language, practical ideas and a weekly report you can read in two minutes.</p>
            <ul className="mt-5 space-y-2 font-semibold">
              {['Strengths first, never a scorecard', 'Home activities that need no special knowledge', '“Help me help my child” guides in plain words'].map((x) => <li key={x} className="flex gap-2"><HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-listen" aria-hidden="true" />{x}</li>)}
            </ul>
            <Button to="/parent" variant="secondary" className="mt-6">See ParentBridge <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          </div>
          <div className="card border-2 !border-ink p-6 shadow-pop">
            <div className="flex items-center justify-between"><p className="font-extrabold">Weekly report</p><DemoBadge>Sample data</DemoBadge></div>
            <p className="mt-1 text-muted">Aarav (sample child), Class 6</p>
            <div className="mt-4 space-y-3">
              {[['Fractions', 68, 'bg-visual'], ['Reading comprehension', 82, 'bg-simple'], ['Science vocabulary', 54, 'bg-example']].map(([n, v, c]) => (
                <div key={n}><div className="mb-1 flex justify-between text-sm font-bold"><span>{n}</span><span>{v}%</span></div><ProgressBar value={v} label={n} colorClass={c} height="h-3" /></div>
              ))}
            </div>
            <div className="mt-5 rounded-ctl border-2 border-example bg-example-soft p-4"><p className="font-bold">Try this at home</p><p className="mt-1">Cut a roti or pizza into equal pieces and ask: “How much is left?” Say the fraction out loud together.</p></div>
          </div>
        </div>
      </Section>

      {/* Language and accessibility */}
      <div id="accessibility" className="scroll-mt-20 border-y border-line bg-sunken/60 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-5xl">Made to be used by everyone</h2>
            <p className="mt-4 text-lg text-muted">Accessibility is part of the foundation, not an add-on. The core learner experience works in English and Hindi, and every control adapts to you.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[[Keyboard, 'Full keyboard navigation'], [Volume2, 'Read-aloud with text highlighting'], [Type, 'Five text sizes'], [Contrast, 'High-contrast theme'], [Eye, 'Reduced motion option'], [Ear, 'Reading-friendly mode'], [Languages, 'English and Hindi'], [MonitorSmartphone, 'Works on phone, tablet and desktop']].map(([I, x]) => (
                <li key={x} className="flex items-center gap-2.5 font-bold"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-surface"><I className="h-5 w-5" aria-hidden="true" /></span>{x}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">Other Indian languages are planned but not available yet, so we do not claim them.</p>
          </div>
          <AccessTryout />
        </div>
      </div>

      {/* How it works */}
      <Section id="how" label="How it works" className="py-16 sm:py-24">
        <H2>How it works</H2>
        <ol className="grid gap-6 md:grid-cols-4">
          {HOW_STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="font-display text-7xl font-extrabold leading-none text-primary/20" aria-hidden="true">{i + 1}</span>
              <h3 className="-mt-3 text-xl font-extrabold"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
              <p className="mt-2 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Stats */}
      <div className="border-y-2 border-ink bg-example py-14 text-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-extrabold sm:text-4xl">What learners could see</h2>
            <span className="rounded-full border-2 border-ink bg-surface px-3 py-1 text-sm font-bold">Illustrative demo data, not real results</span>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_STATS.map((s) => (<div key={s.value}><dd className="font-display text-5xl font-extrabold">{s.value}</dd><dt className="mt-1 font-semibold">{s.label}</dt></div>))}
          </dl>
        </div>
      </div>

      {/* Testimonials */}
      <Section label="Testimonials" className="py-16 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <H2 className="!mb-0">Words we hope to hear</H2>
          <DemoBadge>Sample content, not real people</DemoBadge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SAMPLE_TESTIMONIALS.map((x) => (
            <figure key={x.name} className={`flex flex-col rounded-card border-2 border-ink p-6 ${x.tone}`}>
              <blockquote className="flex-1 text-lg font-semibold leading-relaxed text-ink">“{x.quote}”</blockquote>
              <figcaption className="mt-4 text-ink"><b>{x.name}</b><br /><span className="text-sm opacity-80">{x.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section label="Get started" className="pb-16 sm:pb-24">
        <div className="rounded-panel border-2 border-ink bg-primary p-8 text-primary-on shadow-pop sm:p-14">
          <h2 className="max-w-2xl text-4xl font-extrabold sm:text-6xl">Ready to learn your way?</h2>
          <p className="mt-4 max-w-xl text-lg opacity-90">Create a demo profile or jump straight into the demo account. Everything works offline in your browser.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="btn btn-lg border-2 border-ink bg-surface text-ink hover:bg-example">Start Learning <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
            <Link to="/login?demo=1" className="btn btn-lg border-2 border-primary-on/70 text-primary-on hover:bg-primary-on/10"><BookOpenText className="h-5 w-5" aria-hidden="true" /> Explore the demo</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
