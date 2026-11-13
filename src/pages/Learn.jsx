import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, CircleCheck, Pause, Play, Square, Minus, Plus, BookOpenCheck, TriangleAlert, ArrowRight, Clock, Link2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Button, Card, EmptyState, ProgressBar, Ring, Segmented } from '../components/ui.jsx';
import LessonVisual from '../components/Visuals.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import { FORMATS, FORMAT_IDS, formatMeta } from '../utils/formats.js';
import { hasLang, pick } from '../utils/i18n.js';
import { questionsFor } from '../utils/lessons.js';
import { useSpeech } from '../hooks/useSpeech.js';
import { SUBJECTS } from '../data/lessons.js';

const SIZES = [90, 100, 115, 130, 150];

/* ───────── Format panels ───────── */
function SimplePanel({ lesson, lang, t }) {
  const paras = pick(lesson.simple, lang);
  const points = pick(lesson.keyPoints, lang);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="max-w-[68ch] space-y-5 text-lg leading-relaxed">
        {paras.map((p, i) => <p key={i} className={i === 0 ? 'text-xl font-semibold' : ''}>{p}</p>)}
      </div>
      <aside className="h-fit rounded-card border-2 border-simple bg-simple-soft p-5" aria-label={t('lesson.keyPoints')}>
        <h3 className="mb-3 text-lg font-extrabold text-simple-deep">{t('lesson.keyPoints')}</h3>
        <ul className="space-y-2.5">
          {points.map((p, i) => (
            <li key={i} className="flex gap-2.5 font-semibold"><CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-simple-deep" aria-hidden="true" />{p}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function ListenPanel({ lesson, lang, t, onFirstPlay }) {
  const { prefs, updateAudio } = useApp();
  const rate = prefs.audio.rate;
  const sp = useSpeech({ lang, rate });
  const paras = pick(lesson.simple, lang);
  const points = pick(lesson.keyPoints, lang);
  const transcript = useMemo(() => [...paras, `${t('lesson.keyPoints')}. ${points.join('. ')}.`], [paras, points, t]);
  const played = useRef(false);

  const play = (start = 0) => {
    if (!played.current) { played.current = true; onFirstPlay(); }
    sp.speak(transcript, start);
  };
  useEffect(() => {
    if (prefs.audio.autoplay && sp.isSupported) {
      const id = window.setTimeout(() => play(0), 350);
      return () => window.clearTimeout(id);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playing = sp.status === 'playing';
  const paused = sp.status === 'paused';
  return (
    <div className="max-w-3xl">
      {!sp.isSupported && (
        <p role="alert" className="mb-4 flex gap-2 rounded-ctl border-2 border-example bg-example-soft p-3 font-semibold"><TriangleAlert className="h-5 w-5 shrink-0" aria-hidden="true" />{t('lesson.noSpeech')}</p>
      )}
      {sp.isSupported && lang === 'hi' && !sp.hasVoice && (
        <p role="alert" className="mb-4 flex gap-2 rounded-ctl border-2 border-example bg-example-soft p-3 font-semibold"><TriangleAlert className="h-5 w-5 shrink-0" aria-hidden="true" />{t('lesson.noVoice')}</p>
      )}
      <div className="flex flex-wrap items-center gap-3 rounded-card border-2 border-listen bg-listen-soft p-4">
        {playing || paused ? (
          <Button onClick={playing ? sp.pause : sp.resume} size="lg">
            {playing ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
            {playing ? t('lesson.pause') : t('lesson.resume')}
          </Button>
        ) : (
          <Button onClick={() => play(0)} size="lg" disabled={!sp.isSupported}><Play className="h-5 w-5" aria-hidden="true" /> {t('lesson.play')}</Button>
        )}
        <Button variant="secondary" onClick={sp.stop} disabled={sp.status === 'idle'}><Square className="h-4 w-4" aria-hidden="true" /> {t('lesson.stop')}</Button>
        <label className="ml-auto flex items-center gap-2 font-bold">
          {t('lesson.speed')}
          <select className="input !w-auto !py-1.5" value={rate} onChange={(e) => updateAudio({ rate: +e.target.value })}>
            {[0.75, 1, 1.25, 1.5].map((r) => <option key={r} value={r}>{r}×</option>)}
          </select>
        </label>
        <div className="flex h-8 w-full items-end gap-1" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} className={`w-full origin-bottom rounded-full bg-listen ${playing ? 'animate-wave' : ''}`} style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 90}ms`, opacity: playing ? 1 : 0.35 }} />
          ))}
        </div>
      </div>
      <h3 className="mb-3 mt-6 text-lg font-extrabold">{t('lesson.transcript')}</h3>
      <ol className="space-y-3 text-lg leading-relaxed">
        {transcript.map((p, i) => (
          <li key={i}>
            <button
              type="button"
              disabled={!sp.isSupported}
              onClick={() => play(i)}
              aria-current={sp.index === i ? 'true' : undefined}
              className={`w-full rounded-ctl border-2 px-4 py-3 text-left transition ${sp.index === i && prefs.audio.highlight ? 'border-ink bg-example-soft' : 'border-transparent hover:bg-sunken'}`}
            >
              {p}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ExamplePanel({ lesson, lang, t }) {
  const ex = lesson.example;
  const maps = pick(ex.mapsTo, lang) || [];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        <h3 className="mb-4 text-2xl font-extrabold">{pick(ex.title, lang)}</h3>
        <div className="max-w-[68ch] space-y-5 text-lg leading-relaxed">
          {pick(ex.body, lang).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
      {maps.length > 0 && (
        <aside className="h-fit rounded-card border-2 border-example bg-example-soft p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-example-deep"><Link2 className="h-5 w-5" aria-hidden="true" /> {t('lesson.connect')}</h3>
          <ul className="space-y-3">
            {maps.map((m, i) => (<li key={i} className="flex gap-2 font-semibold"><ArrowRight className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />{m}</li>))}
          </ul>
        </aside>
      )}
    </div>
  );
}

function PracticePanel({ lesson, lang, t }) {
  const { custom, awardPractice, completeLesson, progress, toast } = useApp();
  const qs = useMemo(() => questionsFor(lesson, custom).slice(0, 3), [lesson, custom]);
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers).length;
  const correct = qs.filter((q) => answers[q.id] === q.answer).length;
  const done = qs.length > 0 && answered === qs.length;

  const choose = (q, i) => {
    if (answers[q.id] != null) return;
    setAnswers((a) => ({ ...a, [q.id]: i }));
    if (i === q.answer) awardPractice(q.id);
  };
  useEffect(() => {
    if (done && correct >= Math.ceil(qs.length * 0.66) && !progress.completed.includes(lesson.id)) {
      if (completeLesson(lesson.id, pick(lesson.title, 'en'))) toast(t('lesson.completedToast'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (!qs.length) return <EmptyState icon={BookOpenCheck} title={t('quiz.noQuestions')} />;
  return (
    <div className="max-w-3xl">
      <p className="mb-5 text-muted">{t('lesson.practiceIntro')}</p>
      <div className="space-y-8">
        {qs.map((q, n) => (
          <div key={q.id} className="rounded-card border-2 border-line bg-surface p-5">
            <p className="mb-2 text-sm font-bold text-practice-deep">{t('quiz.qOf', { n: n + 1, t: qs.length })}</p>
            <QuestionCard q={q} lang={lang} t={t} name={`practice-${q.id}`} selected={answers[q.id]} onSelect={(i) => choose(q, i)} revealed={answers[q.id] != null} />
          </div>
        ))}
      </div>
      {done && (
        <div role="status" className="mt-6 animate-pop rounded-card border-2 border-practice bg-practice-soft p-5">
          <p className="text-xl font-extrabold">{t('lesson.practiceDone')}: {t('lesson.score', { c: correct, t: qs.length })}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button to={`/quiz/${lesson.id}`}>{t('lesson.takeQuiz')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            <Button variant="secondary" onClick={() => setAnswers({})}>{t('common.retry')}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Page ───────── */
export default function Learn() {
  const { lessonId } = useParams();
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang, prefs, updatePrefs, lessons, progress, trackLessonView, trackFormat, trackListen, toggleBookmark, completeLesson, toast } = useApp();

  const idx = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[idx];
  const urlFormat = sp.get('format');
  const format = FORMAT_IDS.includes(urlFormat) ? urlFormat : FORMAT_IDS.includes(prefs.defaultFormat) ? prefs.defaultFormat : 'simple';
  const meta = formatMeta(format);

  useEffect(() => { if (lesson) trackLessonView(lesson.id, lang); }, [lesson?.id, lang]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (lesson) trackFormat(lesson.id, format); }, [lesson?.id, format]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { document.title = lesson ? `${pick(lesson.title, lang)} · AccessLearn` : 'AccessLearn'; }, [lesson, lang]);

  const tabRefs = useRef({});
  const [showTools, setShowTools] = useState(false);
  if (!lesson) {
    return <EmptyState title={t('lesson.notFound')} action={<Button to="/lessons">{t('lesson.browse')}</Button>} />;
  }

  const setFormat = (f) => setSp({ format: f }, { replace: true });
  const onTabKey = (e, i) => {
    const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let n;
    if (e.key in map) n = (i + map[e.key] + FORMATS.length) % FORMATS.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = FORMATS.length - 1;
    else return;
    e.preventDefault();
    setFormat(FORMATS[n].id);
    tabRefs.current[FORMATS[n].id]?.focus();
  };

  const explored = progress.lessonProgress[lesson.id]?.formats || [];
  const completed = progress.completed.includes(lesson.id);
  const bookmarked = progress.bookmarks.includes(lesson.id);
  const mastery = progress.mastery[lesson.id];
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const langFallback = lang === 'hi' && !hasLang(lesson.simple, 'hi');
  const sizeIdx = Math.max(0, SIZES.indexOf(prefs.textSize));
  const bump = (d) => updatePrefs({ textSize: SIZES[Math.min(SIZES.length - 1, Math.max(0, (sizeIdx === -1 ? 1 : sizeIdx) + d))] });
  const go = (id) => navigate(`/learn/${id}?format=${format}`);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-3 text-sm font-bold text-muted">
        <Link to="/lessons" className="hover:text-ink hover:underline">{t('nav.lessons')}</Link> <span aria-hidden="true">/</span> <span className="text-ink">{pick(lesson.title, lang)}</span>
      </nav>

      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="h-page">{pick(lesson.title, lang)}</h1>
          <p className="mt-2 text-lg text-muted">{pick(lesson.tagline, lang)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{SUBJECTS[lesson.subject] ? pick(SUBJECTS[lesson.subject], lang) : lesson.subject}</span>
            <span className="chip">{t(`common.${lesson.level.toLowerCase()}`)}</span>
            <span className="chip"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {lesson.minutes} {t('common.min')}</span>
            {completed && <span className="chip border-visual bg-visual-soft text-visual-deep"><CircleCheck className="h-3.5 w-3.5" aria-hidden="true" /> {t('lesson.done')}</span>}
          </div>
        </div>
        <Button
          variant={bookmarked ? 'primary' : 'secondary'}
          aria-pressed={bookmarked}
          onClick={() => toast(toggleBookmark(lesson.id) ? t('lesson.bookmarkAdded') : t('lesson.bookmarkRemoved'), 'info')}
        >
          {bookmarked ? <BookmarkCheck className="h-5 w-5" aria-hidden="true" /> : <Bookmark className="h-5 w-5" aria-hidden="true" />}
          {bookmarked ? t('common.bookmarked') : t('common.bookmark')}
        </Button>
      </header>

      {/* Toolbar: topic, language, text size, reading mode */}
      <button type="button" className="btn btn-secondary mb-3 w-full md:hidden" aria-expanded={showTools} aria-controls="lesson-tools" onClick={() => setShowTools((v) => !v)}>
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> {t('lesson.options')}
      </button>
      <div id="lesson-tools" className={`card mb-6 flex-wrap items-end gap-x-6 gap-y-3 p-4 md:flex ${showTools ? 'flex' : 'hidden'}`}>
        <label className="min-w-[14rem] flex-1">
          <span className="label">{t('lesson.chooseTopic')}</span>
          <select className="input" value={lesson.id} onChange={(e) => go(e.target.value)}>
            {lessons.map((l) => <option key={l.id} value={l.id}>{pick(l.title, lang)}</option>)}
          </select>
        </label>
        <div>
          <span className="label">{t('common.language')}</span>
          <Segmented label={t('common.language')} value={lang} onChange={(v) => updatePrefs({ language: v })} options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी' }]} />
        </div>
        <div>
          <span className="label" id="ts-label">{t('lesson.textSize')}</span>
          <div className="flex items-center gap-1" role="group" aria-labelledby="ts-label">
            <button type="button" className="btn btn-secondary btn-sm !px-3" onClick={() => bump(-1)} disabled={sizeIdx <= 0} aria-label={t('lesson.smaller')}><Minus className="h-4 w-4" aria-hidden="true" /></button>
            <span className="w-14 text-center font-bold" aria-live="polite">{prefs.textSize}%</span>
            <button type="button" className="btn btn-secondary btn-sm !px-3" onClick={() => bump(1)} disabled={sizeIdx >= SIZES.length - 1} aria-label={t('lesson.larger')}><Plus className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </div>
        <div>
          <span className="label">{t('lesson.reading')}</span>
          <button type="button" role="switch" aria-checked={prefs.readingMode} onClick={() => updatePrefs({ readingMode: !prefs.readingMode })} className={`btn btn-sm ${prefs.readingMode ? 'btn-primary' : 'btn-secondary'}`}>
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" /> {prefs.readingMode ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[12rem] flex-1">
          <div className="mb-1 flex justify-between text-sm font-bold"><span>{t('lesson.progress')}</span><span>{t('lesson.explored', { n: explored.length })}</span></div>
          <ProgressBar value={explored.length} max={5} label={t('lesson.progress')} colorClass="bg-ink" height="h-3" />
        </div>
      </div>

      {/* Format selector: each way of learning has its own colour */}
      <h2 className="sr-only">{t('lesson.formatsTitle')}</h2>
      <div role="tablist" aria-label={t('lesson.formatsTitle')} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {FORMATS.map((f, i) => {
          const active = f.id === format;
          const seen = explored.includes(f.id);
          return (
            <button
              key={f.id}
              ref={(el) => { tabRefs.current[f.id] = el; }}
              role="tab"
              id={`tab-${f.id}`}
              aria-selected={active}
              aria-controls={`panel-${f.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setFormat(f.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`relative flex min-h-[64px] items-center gap-3 rounded-ctl border-2 px-3.5 py-3 text-left font-bold transition ${i === 4 ? 'col-span-2 sm:col-span-1' : ''} ${active ? `border-ink ${f.cls.soft} shadow-pop-sm` : 'border-line bg-surface hover:border-ink'}`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${f.cls.solid} text-ink`}><f.icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="leading-tight">{t(`lesson.${f.id}`)}</span>
              {seen && <CircleCheck className="absolute right-2 top-2 h-4 w-4 text-visual-deep" aria-label="explored" />}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[1fr_17rem]">
        <section
          role="tabpanel"
          id={`panel-${format}`}
          aria-labelledby={`tab-${format}`}
          tabIndex={0}
          key={`${lesson.id}-${format}-${lang}`}
          className="animate-rise overflow-hidden rounded-panel border-2 border-ink bg-surface p-5 sm:p-8"
        >
          <div className={`-mx-5 -mt-5 mb-6 h-2.5 sm:-mx-8 sm:-mt-8 ${meta.cls.solid}`} aria-hidden="true" />
          {langFallback && <p role="note" className="mb-5 rounded-ctl border-2 border-example bg-example-soft p-3 font-semibold">{t('lesson.fallback')}</p>}
          {format === 'simple' && <SimplePanel lesson={lesson} lang={lang} t={t} />}
          {format === 'visual' && (
            <div className="max-w-3xl">
              <p className="mb-4 text-muted">{t('lesson.visualHint')}</p>
              <LessonVisual lesson={lesson} lang={lang} />
            </div>
          )}
          {format === 'listen' && <ListenPanel key={`${lesson.id}-${lang}`} lesson={lesson} lang={lang} t={t} onFirstPlay={trackListen} />}
          {format === 'example' && <ExamplePanel lesson={lesson} lang={lang} t={t} />}
          {format === 'practice' && <PracticePanel key={`${lesson.id}-${lang}`} lesson={lesson} lang={lang} t={t} />}
        </section>

        <aside className="space-y-4" aria-label="Lesson sidebar">
          <Card className="flex items-center gap-4">
            <Ring value={mastery ?? 0} size={72} stroke={9} colorClass="text-visual" label={`${t('lesson.mastery')} ${mastery ?? 0}%`} />
            <div>
              <p className="font-bold">{t('lesson.mastery')}</p>
              <p className="text-sm text-muted">{t('lesson.masteryHint')}</p>
            </div>
          </Card>
          <Button to={`/quiz/${lesson.id}`} className="w-full">{t('lesson.takeQuiz')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          <Button
            variant={completed ? 'secondary' : 'primary'}
            className="w-full"
            disabled={completed}
            onClick={() => { if (completeLesson(lesson.id, pick(lesson.title, 'en'))) toast(t('lesson.completedToast')); }}
          >
            <CircleCheck className="h-4 w-4" aria-hidden="true" /> {completed ? t('lesson.done') : t('lesson.complete')}
          </Button>
        </aside>
      </div>

      <nav aria-label="Lesson navigation" className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
        {prev ? (
          <Button variant="secondary" onClick={() => go(prev.id)}><ChevronLeft className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">{t('lesson.prev')}:</span> {pick(prev.title, lang)}</Button>
        ) : <span />}
        {next ? (
          <Button variant="secondary" onClick={() => go(next.id)}><span className="hidden sm:inline">{t('lesson.nextL')}:</span> {pick(next.title, lang)} <ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>
        ) : <span />}
      </nav>
    </div>
  );
}
