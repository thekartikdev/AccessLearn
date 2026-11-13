import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CircleCheck, Lock, Mountain, TrendingDown, TrendingUp, Minus, BookCheck, ClipboardCheck, Award, Footprints } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Card, EmptyState, PageHeader, ProgressBar, Ring } from '../components/ui.jsx';
import BadgeIcon from '../components/BadgeIcon.jsx';
import { useChartColors } from '../hooks/useChartColors.js';
import { autoGoals, badgeStates, levelFromXp } from '../utils/gamify.js';
import { pick } from '../utils/i18n.js';

const EVENT_ICON = { lesson: BookCheck, quiz: ClipboardCheck, badge: Award };

export default function GrowthQuest() {
  const { lang, lessons, progress, streak } = useApp();
  const c = useChartColors();
  const badges = badgeStates(progress);
  const unlocked = badges.filter((b) => b.unlocked).length;
  const goals = autoGoals(progress);
  const mine = progress.goals;
  const masteryVals = lessons.map((l) => progress.mastery[l.id]).filter((v) => v != null);
  const avg = masteryVals.length ? Math.round(masteryVals.reduce((a, b) => a + b, 0) / masteryVals.length) : 0;
  const totalWays = Object.values(progress.lessonProgress).reduce((s, l) => s + (l.formats?.length || 0), 0);
  const trend = progress.quizResults.map((r, i) => ({ n: i + 1, pct: Math.round((r.score / r.total) * 100), title: r.title }));
  const best = trend.length ? Math.max(...trend.map((x) => x.pct)) : 0;
  const title = (id) => { const l = lessons.find((x) => x.id === id); return l ? pick(l.title, lang) : id; };

  return (
    <div className="space-y-8">
      <PageHeader title="GrowthQuest" subtitle="Your own journey, at your own pace. There are no rankings here and nobody to compare with: the only goal is a little better than before." />

      <section aria-label="Progress rings" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { v: (progress.completed.length / Math.max(1, lessons.length)) * 100, l: 'Lessons completed', s: `${progress.completed.length} of ${lessons.length}`, cls: 'text-visual' },
          { v: (totalWays / Math.max(1, lessons.length * 5)) * 100, l: 'Ways explored', s: `${totalWays} of ${lessons.length * 5}`, cls: 'text-simple' },
          { v: avg, l: 'Average mastery', s: `${avg}% across topics`, cls: 'text-example' },
          { v: (unlocked / badges.length) * 100, l: 'Badges earned', s: `${unlocked} of ${badges.length}`, cls: 'text-listen' },
        ].map((r) => (
          <Card key={r.l} className="flex flex-col items-center gap-3 text-center !p-5">
            <Ring value={r.v} size={104} stroke={12} colorClass={r.cls} label={`${r.l}: ${r.s}`} />
            <div><p className="font-extrabold">{r.l}</p><p className="text-sm text-muted">{r.s}</p></div>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card as="section" aria-labelledby="g-goals">
          <h2 id="g-goals" className="mb-4 text-xl font-extrabold">Learning goals</h2>
          <ul className="space-y-4">
            {goals.map((g) => (
              <li key={g.id}>
                <div className="mb-1 flex justify-between gap-2 font-bold"><span className="flex items-center gap-1.5">{g.value >= g.target && <CircleCheck className="h-4 w-4 text-visual-deep" aria-hidden="true" />}{g.label}</span><span>{g.value}{g.unit || ''} / {g.target}{g.unit || ''}</span></div>
                <ProgressBar value={g.value} max={g.target} label={g.label} colorClass={g.value >= g.target ? 'bg-visual' : 'bg-primary'} height="h-3" />
              </li>
            ))}
          </ul>
          <h3 className="mb-2 mt-6 font-extrabold">Your own goals ({mine.filter((g) => g.done).length} of {mine.length} done)</h3>
          {mine.length === 0 ? <p className="text-muted">Add personal goals from your dashboard.</p> : (
            <ul className="space-y-1.5">{mine.map((g) => <li key={g.id} className={`flex items-center gap-2 ${g.done ? 'text-muted line-through' : 'font-semibold'}`}>{g.done ? <CircleCheck className="h-4 w-4 text-visual-deep" aria-hidden="true" /> : <Footprints className="h-4 w-4" aria-hidden="true" />}{g.text}</li>)}</ul>
          )}
        </Card>

        <Card as="section" aria-labelledby="g-improve">
          <h2 id="g-improve" className="mb-4 text-xl font-extrabold">How you have improved</h2>
          <ul className="space-y-3">
            {lessons.filter((l) => progress.mastery[l.id] != null).map((l) => {
              const now = progress.mastery[l.id];
              const base = progress.baseline[l.id] ?? now;
              const d = now - base;
              const Icon = d > 0 ? TrendingUp : d < 0 ? TrendingDown : Minus;
              return (
                <li key={l.id} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1"><p className="truncate font-bold">{pick(l.title, lang)}</p><ProgressBar value={now} label={`${pick(l.title, lang)} ${now}%`} colorClass="bg-visual" className="mt-1" /></div>
                  <span className={`chip shrink-0 ${d > 0 ? 'border-visual bg-visual-soft text-visual-deep' : ''}`}><Icon className="h-4 w-4" aria-hidden="true" />{d > 0 ? '+' : ''}{d}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-muted">Change is measured against where you started on this device, not against anyone else.</p>
        </Card>
      </div>

      <Card as="section" aria-labelledby="g-trend">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 id="g-trend" className="text-xl font-extrabold">Your quiz scores over time</h2><span className="chip">Personal best {best}%</span></div>
        {trend.length < 2 ? <EmptyState icon={Mountain} title="Take a couple of quizzes to see your trend" /> : (
          <div role="img" aria-label={`Quiz scores: ${trend.map((x) => `${x.pct}%`).join(', ')}`} style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={c.grid} strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="n" tick={{ fill: c.text, fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: c.text, fontSize: 12 }} tickLine={false} axisLine={false} unit="%" />
                <Tooltip formatter={(v, _n, p) => [`${v}%`, p.payload.title]} labelFormatter={(n) => `Quiz ${n}`} contentStyle={{ background: c.surface, border: `2px solid ${c.ink}`, borderRadius: 12, color: c.ink, fontWeight: 700 }} />
                <Line type="monotone" dataKey="pct" stroke={c.primary} strokeWidth={3} dot={{ r: 5, fill: c.example, stroke: c.ink, strokeWidth: 2 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <section aria-labelledby="g-badges">
        <h2 id="g-badges" className="mb-4 text-xl font-extrabold">Achievement badges</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <li key={b.id} className={`card flex flex-col items-center gap-2 p-5 text-center ${b.unlocked ? 'border-2 !border-ink bg-example-soft' : 'opacity-80'}`}>
              <span className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${b.unlocked ? 'border-ink bg-example text-ink' : 'border-line bg-sunken text-muted'}`}>
                {b.unlocked ? <BadgeIcon name={b.icon} className="h-7 w-7" /> : <Lock className="h-6 w-6" aria-hidden="true" />}
              </span>
              <p className="font-extrabold">{b.title}</p>
              <p className="text-sm text-muted">{b.desc}</p>
              {b.unlocked ? <span className="chip border-visual bg-visual-soft text-visual-deep"><CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />Earned</span> : <span className="text-sm font-bold">{b.value} / {b.target}</span>}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card as="section" aria-labelledby="g-miles">
          <h2 id="g-miles" className="mb-4 text-xl font-extrabold">Personal milestones</h2>
          <p className="mb-4 text-sm text-muted">Level {levelFromXp(progress.xp)} · {progress.xp} XP · {streak}-day streak</p>
          <ol className="relative space-y-4 border-l-2 border-line pl-6">
            {progress.events.slice(0, 8).map((e) => {
              const Icon = EVENT_ICON[e.type] || CircleCheck;
              return (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[2.15rem] top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-surface"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                  <p className="font-bold">{e.text}</p>
                  <p className="text-sm text-muted">{new Date(e.at).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' })}</p>
                </li>
              );
            })}
          </ol>
        </Card>
        <Card as="section" aria-labelledby="g-done">
          <h2 id="g-done" className="mb-4 text-xl font-extrabold">Completed lessons</h2>
          {progress.completed.length === 0 ? <EmptyState icon={BookCheck} title="No completed lessons yet" /> : (
            <ul className="divide-y divide-line">
              {progress.completed.map((id) => (
                <li key={id} className="flex items-center justify-between gap-3 py-3">
                  <span className="flex items-center gap-2 font-bold"><CircleCheck className="h-5 w-5 text-visual-deep" aria-hidden="true" />{title(id)}</span>
                  <span className="text-sm text-muted">{progress.completedAt[id] ? new Date(progress.completedAt[id]).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' }) : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
