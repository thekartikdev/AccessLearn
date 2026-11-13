import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CircleCheck, CircleX, ClipboardCheck, RotateCcw, Shuffle, X, TrendingUp, Save } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Button, Card, EmptyState, Modal, PageHeader, ProgressBar, Ring } from '../components/ui.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import { pick } from '../utils/i18n.js';
import { mixedQuestions, questionsFor } from '../utils/lessons.js';
import { quizRecommendations } from '../utils/recommend.js';

/* ───────── Picker ───────── */
function Picker() {
  const { t, lang, lessons, custom, progress } = useApp();
  const quizzes = lessons.map((l) => ({ lesson: l, count: questionsFor(l, custom).length })).filter((x) => x.count > 0);
  const stats = (id) => {
    const rs = progress.quizResults.filter((r) => r.quizId === id);
    if (!rs.length) return null;
    const last = rs[rs.length - 1];
    const best = Math.max(...rs.map((r) => Math.round((r.score / r.total) * 100)));
    return { last: `${last.score}/${last.total}`, best };
  };
  return (
    <div>
      <PageHeader title={t('quiz.title')} subtitle={t('quiz.pick')} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col border-2 !border-ink bg-primary-soft shadow-pop">
          <Shuffle className="mb-3 h-7 w-7 text-primary-deep" aria-hidden="true" />
          <h2 className="text-xl font-extrabold">{t('quiz.mixed')}</h2>
          <p className="mt-1 flex-1 text-muted">{t('quiz.mixedDesc')}</p>
          <Button to="/quiz/mixed" className="mt-4">{t('common.start')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
        </Card>
        {quizzes.map(({ lesson, count }) => {
          const st = stats(lesson.id);
          const m = progress.mastery[lesson.id] ?? 0;
          return (
            <Card key={lesson.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold">{pick(lesson.title, lang)}</h2>
                  <p className="mt-1 text-sm text-muted">{t('quiz.questions', { n: count })} · {lesson.subject}</p>
                </div>
                <Ring value={m} size={56} stroke={7} colorClass="text-visual" label={`${t('lesson.mastery')} ${m}%`}><span className="text-sm">{m}%</span></Ring>
              </div>
              <p className="mt-3 flex-1 text-sm">
                {st ? <>{t('quiz.last')}: <b>{st.last}</b> · {t('quiz.best')}: <b>{st.best}%</b></> : <span className="text-muted">{t('quiz.notTaken')}</span>}
              </p>
              <Button to={`/quiz/${lesson.id}`} variant="secondary" className="mt-4">{t('common.start')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Runner ───────── */
function Runner({ quizId }) {
  const { t, lang, prefs, lessons, custom, progress, recordQuiz } = useApp();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === quizId);
  const isMixed = quizId === 'mixed';
  const title = isMixed ? t('quiz.mixed') : lesson ? pick(lesson.title, lang) : '';
  const lessonTitle = (id) => { const l = lessons.find((x) => x.id === id); return l ? pick(l.title, lang) : id; };

  const build = () => (isMixed ? mixedQuestions(lessons, custom, progress.mastery) : questionsFor(lesson, custom));
  const [qs, setQs] = useState(build);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState(null);
  const [leave, setLeave] = useState(false);
  const headRef = useRef(null);
  const recorded = useRef(false);

  useEffect(() => { headRef.current?.focus(); }, [i, result]);

  if (!isMixed && !lesson) return <EmptyState title={t('lesson.notFound')} action={<Button to="/quiz">{t('quiz.pick')}</Button>} />;
  if (!qs.length) return <EmptyState icon={ClipboardCheck} title={t('quiz.noQuestions')} action={<Button to="/quiz">{t('quiz.pick')}</Button>} />;

  const q = qs[i];
  const answeredCount = Object.keys(picks).length;
  const restart = (list) => { setQs(list); setI(0); setPicks({}); setRevealed(false); setResult(null); recorded.current = false; };

  const finish = () => {
    if (recorded.current) return;
    recorded.current = true;
    const items = qs.map((x) => ({ qid: x.id, lessonId: x.lessonId, tag: x.tag, correct: picks[x.id] === x.answer }));
    const res = recordQuiz({ quizId, title: qs.length < build().length ? `${title} (retry)` : title, items });
    const recs = quizRecommendations({ items, lessons, prefs, progress });
    setResult({ ...res, items, recs });
  };

  const onNext = () => {
    if (i + 1 < qs.length) { setI(i + 1); setRevealed(false); } else finish();
  };

  /* ── Results ── */
  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    const missed = qs.filter((x) => picks[x.id] !== x.answer);
    const verdict = pct >= 80 ? t('quiz.excellent') : pct >= 50 ? t('quiz.good') : t('quiz.keepGoing');
    const byLesson = {};
    result.items.forEach((it) => { const g = (byLesson[it.lessonId] ||= { c: 0, t: 0 }); g.t += 1; if (it.correct) g.c += 1; });
    return (
      <div className="mx-auto max-w-3xl">
        <h1 ref={headRef} tabIndex={-1} className="h-page outline-none">{t('quiz.results')}</h1>
        <Card className="mt-5 flex flex-wrap items-center gap-6 border-2 !border-ink shadow-pop">
          <Ring value={pct} size={128} stroke={14} colorClass={pct >= 80 ? 'text-visual' : pct >= 50 ? 'text-example' : 'text-listen'} label={`${pct}%`} />
          <div className="min-w-0 flex-1">
            <p className="text-3xl font-extrabold">{t('lesson.score', { c: result.score, t: result.total })}</p>
            <p className="mt-1 text-lg font-semibold">{verdict}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted"><Save className="h-4 w-4" aria-hidden="true" /> {t('quiz.progressSaved')}</p>
          </div>
        </Card>

        <h2 className="mb-3 mt-8 text-xl font-extrabold">{t('quiz.topicBreakdown')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(byLesson).map(([id, g]) => {
            const ch = result.changes[id];
            return (
              <Card key={id} className="!p-4">
                <p className="font-bold">{lessonTitle(id)}</p>
                <p className="text-sm text-muted">{t('lesson.score', { c: g.c, t: g.t })}</p>
                <ProgressBar value={g.c} max={g.t} label={lessonTitle(id)} colorClass="bg-visual" className="mt-2" />
                {ch && <p className="mt-2 flex items-center gap-1.5 text-sm font-bold"><TrendingUp className="h-4 w-4" aria-hidden="true" /> {t('quiz.masteryUpdate')}: {ch.from}% → {ch.to}%</p>}
              </Card>
            );
          })}
        </div>

        <h2 className="mb-3 mt-8 text-xl font-extrabold">{t('quiz.nextSteps')}</h2>
        <ul className="space-y-3">
          {result.recs.map((r, n) => {
            const l = lessons.find((x) => x.id === r.lessonId);
            if (!l) return null;
            const tags = r.tags.map((x) => pick(x, lang)).join(', ');
            const reason = r.kind === 'prereq' ? t('rec.prereq', { tags }) : r.kind === 'revisit' ? t('rec.revisit', { tags }) : t('rec.next');
            return (
              <li key={n} className="card flex flex-wrap items-center justify-between gap-3 border-2 !border-example !bg-example-soft p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold">{pick(l.title, lang)} <span className="chip ml-1 align-middle text-xs">{t(`common.${l.level.toLowerCase()}`)}</span></p>
                  <p className="mt-1">{reason}</p>
                  <p className="mt-1 text-sm font-bold text-example-deep">{t('quiz.reviewFormat', { format: t(`lesson.${r.format}`) })}</p>
                </div>
                <Button to={`/learn/${l.id}?format=${r.format}`} size="sm">{t('quiz.open')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
              </li>
            );
          })}
        </ul>

        <h2 className="mb-3 mt-8 text-xl font-extrabold">{t('quiz.review')}</h2>
        <ol className="space-y-4">
          {qs.map((x, n) => {
            const ok = picks[x.id] === x.answer;
            const opts = pick(x.options, lang);
            return (
              <li key={x.id} className="card p-5">
                <p className="mb-1 flex items-center gap-2 text-sm font-bold">
                  {ok ? <CircleCheck className="h-5 w-5 text-visual-deep" aria-hidden="true" /> : <CircleX className="h-5 w-5 text-danger" aria-hidden="true" />}
                  {n + 1}. {ok ? t('quiz.correct') : t('quiz.wrong')} · <span className="text-muted">{pick(x.tag, lang)}</span>
                </p>
                <p className="text-lg font-bold">{pick(x.prompt, lang)}</p>
                <p className="mt-2"><b>{t('quiz.yours')}:</b> {opts[picks[x.id]]}</p>
                {!ok && <p><b>{t('quiz.right')}:</b> {opts[x.answer]}</p>}
                <p className="mt-2 text-muted"><b>{t('quiz.explanation')}:</b> {pick(x.explain, lang)}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => restart(isMixed ? mixedQuestions(lessons, custom, { ...progress.mastery, ...Object.fromEntries(Object.entries(result.changes).map(([k, v]) => [k, v.to])) }) : questionsFor(lesson, custom))}><RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('quiz.retryAll')}</Button>
          {missed.length > 0 && <Button variant="secondary" onClick={() => restart(missed)}>{t('quiz.retryMissed')} ({missed.length})</Button>}
          <Button variant="ghost" to="/quiz">{t('quiz.pick')}</Button>
        </div>
      </div>
    );
  }

  /* ── Question ── */
  const chosen = picks[q.id];
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-muted">{t('quiz.title')}</p>
          <h1 className="text-2xl font-extrabold">{title}</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => (answeredCount ? setLeave(true) : navigate('/quiz'))}><X className="h-4 w-4" aria-hidden="true" /> {t('quiz.leave')}</Button>
      </div>
      <div className="mb-2 flex justify-between text-sm font-bold">
        <span>{t('quiz.qOf', { n: i + 1, t: qs.length })}</span>
        {isMixed && <span className="text-muted">{lessonTitle(q.lessonId)}</span>}
      </div>
      <ProgressBar value={i + (revealed ? 1 : 0)} max={qs.length} label={t('lesson.progress')} colorClass="bg-ink" height="h-3" />

      <Card className="mt-5 border-2 !border-ink shadow-pop">
        <h2 ref={headRef} tabIndex={-1} className="sr-only">{t('quiz.qOf', { n: i + 1, t: qs.length })}</h2>
        <QuestionCard key={q.id} q={q} lang={lang} t={t} name={`quiz-${q.id}`} selected={chosen} revealed={revealed} onSelect={(n) => setPicks((p) => ({ ...p, [q.id]: n }))} />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {!revealed && chosen == null && <p className="text-sm text-muted">{t('quiz.selectOne')}</p>}
          <span />
          {!revealed ? (
            <Button onClick={() => setRevealed(true)} disabled={chosen == null}>{t('quiz.check')}</Button>
          ) : (
            <Button onClick={onNext}>{i + 1 < qs.length ? t('quiz.next') : t('quiz.see')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          )}
        </div>
      </Card>

      <Modal open={leave} onClose={() => setLeave(false)} title={t('quiz.leave')} description={t('quiz.leaveBody')} size="sm"
        footer={<><Button variant="secondary" onClick={() => setLeave(false)} data-autofocus>{t('quiz.stay')}</Button><Button variant="danger" onClick={() => navigate('/quiz')}>{t('quiz.leave')}</Button></>}>
        <p>{t('quiz.leaveBody')}</p>
      </Modal>
    </div>
  );
}

export default function Quiz() {
  const { quizId } = useParams();
  return quizId ? <Runner key={quizId} quizId={quizId} /> : <Picker />;
}
