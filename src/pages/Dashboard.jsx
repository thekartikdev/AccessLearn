import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Bookmark, ClipboardCheck, Flame, FileUp, Plus, Settings2, Trash2, Zap, Play, History } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Button, Card, DemoBadge, EmptyState, ProgressBar, Ring } from '../components/ui.jsx';
import WeeklyChart, { weeklyData } from '../components/WeeklyChart.jsx';
import BadgeIcon from '../components/BadgeIcon.jsx';
import { pick } from '../utils/i18n.js';
import { badgeStates, levelFromXp, xpIntoLevel } from '../utils/gamify.js';
import { recommendLessons } from '../utils/recommend.js';
import { FORMAT_IDS } from '../utils/formats.js';
import { timeAgo } from '../utils/dates.js';

function SectionTitle({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-xl font-extrabold">{children}</h2>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const { t, lang, user, prefs, progress, streak, lessons, addGoal, toggleGoal, removeGoal } = useApp();
  const [goalText, setGoalText] = useState('');

  const recs = useMemo(() => recommendLessons({ lessons, prefs, progress }), [lessons, prefs, progress]);
  const badges = badgeStates(progress);
  const unlocked = badges.filter((b) => b.unlocked);
  const weekly = weeklyData(progress.activity, lang);
  const weekTotal = weekly.reduce((s, d) => s + d.minutes, 0);
  const level = levelFromXp(progress.xp);

  const title = (id) => { const l = lessons.find((x) => x.id === id); return l ? pick(l.title, lang) : id; };
  const current = progress.recent.map((r) => lessons.find((l) => l.id === r.lessonId)).find((l) => l && !progress.completed.includes(l.id)) || recs[0]?.lesson;
  const explored = current ? progress.lessonProgress[current.id]?.formats || [] : [];
  const nextFormat = FORMAT_IDS.find((f) => !explored.includes(f)) || 'simple';
  const recent = progress.recent.map((r) => ({ ...r, lesson: lessons.find((l) => l.id === r.lessonId) })).filter((r) => r.lesson).slice(0, 4);
  const mastered = lessons.filter((l) => progress.mastery[l.id] != null);

  const submitGoal = (e) => {
    e.preventDefault();
    if (!goalText.trim()) return;
    addGoal(goalText);
    setGoalText('');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="h-page">{t('dash.hello', { name: user?.name || '' })}</h1>
          <p className="mt-2 text-lg text-muted">{t('dash.sub')}</p>
        </div>
        {progress.seeded && <DemoBadge>{t('common.demo')}: sample progress included</DemoBadge>}
      </header>

      {/* Hero row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="relative overflow-hidden border-2 !border-ink bg-ink text-bg shadow-pop lg:col-span-2">
          {current ? (
            <>
              <p className="text-sm font-bold opacity-80">{t('dash.continue')}</p>
              <h2 className="mt-1 text-3xl font-extrabold">{pick(current.title, lang)}</h2>
              <p className="mt-1 max-w-lg opacity-80">{pick(current.tagline, lang)}</p>
              <div className="mt-5 max-w-md">
                <div className="mb-1 flex justify-between text-sm font-bold"><span>{t('lesson.progress')}</span><span>{t('lesson.explored', { n: explored.length })}</span></div>
                <ProgressBar value={explored.length} max={5} label={t('lesson.progress')} colorClass="bg-example" className="!bg-bg/20" height="h-3" />
              </div>
              <Link to={`/learn/${current.id}?format=${nextFormat}`} className="btn mt-6 border-2 border-bg bg-example text-ink hover:brightness-95">
                <Play className="h-4 w-4" aria-hidden="true" /> {t('dash.continue')}
              </Link>
            </>
          ) : (
            <p>{t('dash.emptyRecent')}</p>
          )}
          <div className="pointer-events-none absolute -right-6 -top-6 flex gap-2 opacity-90" aria-hidden="true">
            {['bg-simple', 'bg-visual', 'bg-listen', 'bg-example', 'bg-practice'].map((c, i) => <span key={c} className={`w-6 rounded-full ${c}`} style={{ height: 70 + (i % 3) * 30 + (i === 2 ? 30 : 0) }} />)}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <Card className="flex items-center gap-4 !p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-ctl bg-listen-soft text-listen"><Flame className="h-7 w-7" aria-hidden="true" /></span>
            <div><p className="font-display text-3xl font-extrabold leading-none">{streak}</p><p className="text-sm font-bold text-muted">{t('dash.streak')}</p></div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-ctl bg-example-soft text-example-deep"><Zap className="h-7 w-7" aria-hidden="true" /></span>
              <div><p className="font-display text-2xl font-extrabold leading-none">{progress.xp} {t('dash.xp')}</p><p className="text-sm font-bold text-muted">{t('dash.level', { n: level })}</p></div>
            </div>
            <ProgressBar value={xpIntoLevel(progress.xp)} label={t('dash.xp')} colorClass="bg-example" className="mt-3" />
          </Card>
        </div>
      </div>

      {/* Achievements strip */}
      <Card className="flex flex-wrap items-center gap-4 !p-4">
        <Award className="h-6 w-6 text-example-deep" aria-hidden="true" />
        <p className="font-bold">{unlocked.length} / {badges.length} <Link to="/growth" className="underline hover:text-primary">GrowthQuest</Link></p>
        <ul className="flex flex-wrap gap-2" aria-label="Unlocked badges">
          {unlocked.slice(0, 8).map((b) => (<li key={b.id} title={b.title} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-example-soft text-example-deep"><BadgeIcon name={b.icon} className="h-5 w-5" /><span className="sr-only">{b.title}</span></li>))}
        </ul>
      </Card>

      {/* Recommended */}
      <section aria-labelledby="rec-h">
        <SectionTitle><span id="rec-h">{t('dash.recommended')}</span></SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {recs.map(({ lesson, reason }) => (
            <Card key={lesson.id} className="flex flex-col !p-5">
              <p className="text-sm font-bold text-muted">{lesson.subject} · {t(`common.${lesson.level.toLowerCase()}`)} · {lesson.minutes} {t('common.min')}</p>
              <h3 className="mt-1 text-xl font-extrabold">{pick(lesson.title, lang)}</h3>
              <p className="mt-2 flex-1 text-sm text-muted"><b className="text-ink">{t('dash.whyRec')}:</b> {t(reason)}</p>
              <Button to={`/learn/${lesson.id}`} variant="secondary" size="sm" className="mt-4 self-start">{t('common.open')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly + goals */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <SectionTitle action={<span className="chip">{weekTotal} {t('common.min')}</span>}>{t('dash.weekly')}</SectionTitle>
          <WeeklyChart data={weekly} label={t('dash.minutesLabel')} unit={t('common.min')} />
          <p className="mt-2 text-xs text-muted">{t('dash.estimated')}</p>
        </Card>
        <Card className="lg:col-span-2">
          <SectionTitle>{t('dash.goals')}</SectionTitle>
          {progress.goals.length === 0 && <p className="mb-3 text-muted">{t('dash.noGoals')}</p>}
          <ul className="space-y-2">
            {progress.goals.map((g) => (
              <li key={g.id} className="flex items-center gap-3 rounded-ctl border border-line p-2.5">
                <input id={`goal-${g.id}`} type="checkbox" checked={g.done} onChange={() => toggleGoal(g.id)} className="h-5 w-5 shrink-0 accent-primary" />
                <label htmlFor={`goal-${g.id}`} className={`flex-1 cursor-pointer font-semibold ${g.done ? 'text-muted line-through' : ''}`}>{g.text}</label>
                <button type="button" onClick={() => removeGoal(g.id)} className="rounded-lg p-2 text-muted hover:bg-sunken hover:text-danger" aria-label={`${t('common.delete')}: ${g.text}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
              </li>
            ))}
          </ul>
          <form onSubmit={submitGoal} className="mt-4 flex gap-2">
            <label htmlFor="new-goal" className="sr-only">{t('dash.goalPlaceholder')}</label>
            <input id="new-goal" className="input" value={goalText} onChange={(e) => setGoalText(e.target.value)} placeholder={t('dash.goalPlaceholder')} maxLength={80} />
            <Button type="submit" onClick={undefined} aria-label={t('dash.addGoal')}><Plus className="h-5 w-5" aria-hidden="true" /></Button>
          </form>
        </Card>
      </div>

      {/* Mastery */}
      <section aria-labelledby="mastery-h">
        <SectionTitle><span id="mastery-h">{t('dash.mastery')}</span></SectionTitle>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {mastered.map((l) => {
            const m = progress.mastery[l.id];
            return (
              <Link key={l.id} to={`/learn/${l.id}`} className="card flex flex-col items-center gap-3 p-4 text-center transition hover:-translate-y-0.5 hover:border-ink">
                <Ring value={m} size={84} stroke={10} colorClass={m >= 70 ? 'text-visual' : m >= 40 ? 'text-example' : 'text-listen'} label={`${pick(l.title, lang)} ${m}%`} />
                <span className="font-bold leading-tight">{pick(l.title, lang)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle>{t('dash.recent')}</SectionTitle>
          {recent.length === 0 ? <EmptyState icon={History} title={t('dash.emptyRecent')} /> : (
            <ul className="divide-y divide-line">
              {recent.map((r) => (
                <li key={r.lessonId}>
                  <Link to={`/learn/${r.lessonId}`} className="flex min-h-[52px] items-center justify-between gap-3 py-2 hover:text-primary">
                    <span className="font-bold">{pick(r.lesson.title, lang)}</span>
                    <span className="text-sm text-muted">{timeAgo(r.at, lang)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <SectionTitle>{t('dash.quick')}</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { to: '/quiz', icon: ClipboardCheck, label: t('dash.quickQuiz'), cls: 'bg-practice-soft text-practice-deep' },
              { to: '/transformer', icon: FileUp, label: t('dash.quickStudy'), cls: 'bg-visual-soft text-visual-deep' },
              { to: '/lessons?bookmarked=1', icon: Bookmark, label: `${t('dash.quickBookmarks')} (${progress.bookmarks.length})`, cls: 'bg-example-soft text-example-deep' },
              { to: '/settings', icon: Settings2, label: t('dash.quickAccess'), cls: 'bg-simple-soft text-simple-deep' },
            ].map((q) => (
              <Link key={q.to} to={q.to} className={`flex min-h-[64px] items-center gap-3 rounded-ctl border-2 border-transparent p-3 font-bold transition hover:border-ink ${q.cls}`}>
                <q.icon className="h-6 w-6 shrink-0" aria-hidden="true" /> {q.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
