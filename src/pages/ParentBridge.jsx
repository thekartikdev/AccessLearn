import { useState } from 'react';
import { ChevronDown, CircleCheck, FileText, Heart, Printer, Sprout, Sparkles, Home, Users } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { usePersistentState } from '../hooks/usePersistentState.js';
import { Button, Card, DemoBadge, Modal, PageHeader, ProgressBar, Ring } from '../components/ui.jsx';
import WeeklyChart from '../components/WeeklyChart.jsx';
import { CHILDREN, PARENT_GUIDES } from '../data/demo.js';
import { KEYS } from '../utils/storage.js';
import { lastDays, weekdayLabel } from '../utils/dates.js';
import { esc, printHtml } from '../utils/print.js';

export default function ParentBridge() {
  const { lang, toast } = useApp();
  const [childId, setChildId] = usePersistentState(`${KEYS.parent}.child`, 'aarav', (f, s) => s);
  const [checks, setChecks] = usePersistentState(KEYS.parent, {}, (f, s) => (s && typeof s === 'object' ? s : f));
  const [report, setReport] = useState(false);
  const child = CHILDREN.find((c) => c.id === childId) || CHILDREN[0];
  const done = checks[child.id] || [];
  const days = lastDays(7);
  const week = days.map((d, i) => ({ day: weekdayLabel(d.date, lang), minutes: child.week[i], today: d.offset === 0 }));

  const toggle = (id) => setChecks((c) => ({ ...c, [child.id]: done.includes(id) ? done.filter((x) => x !== id) : [...done, id] }));

  const printIt = () => {
    printHtml(`${child.name} weekly report`, `
      <span class="tag">Sample data, not a real child</span>
      <h1>${esc(child.name)}'s week</h1><p class="muted">${esc(child.grade)} · ParentBridge sample report</p>
      <h2>Summary</h2><p>${esc(child.name)} studied for ${child.minutes} minutes over ${child.lessonsThisWeek} lessons and has a ${child.streak}-day learning habit.</p>
      <h2>Going well</h2><ul>${child.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <h2>Growing next</h2><ul>${child.practise.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <h2>Topics</h2>${child.topics.map((t) => `<div>${esc(t.name)} · ${t.pct}%</div><div class="bar"><i style="width:${t.pct}%"></i></div>`).join('')}
      <h2>One thing to try this week</h2><p>${esc(child.activities[0].title)}: ${esc(child.activities[0].desc)}</p>`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="ParentBridge"
        subtitle="A calm window into learning at home: what is going well, what is growing, and one small thing to try."
        actions={<DemoBadge>Sample data: not a real child or account</DemoBadge>}
      />

      <div role="radiogroup" aria-label="Choose a sample child profile" className="grid gap-3 sm:grid-cols-3">
        {CHILDREN.map((c) => {
          const on = c.id === child.id;
          return (
            <label key={c.id} className={`flex cursor-pointer items-center gap-3 rounded-card border-2 p-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${on ? 'border-ink bg-primary-soft shadow-pop-sm' : 'border-line bg-surface hover:border-ink'}`}>
              <input type="radio" name="child" className="sr-only" checked={on} onChange={() => setChildId(c.id)} />
              <span className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink font-display text-xl font-extrabold text-ink ${c.color}`} aria-hidden="true">{c.name[0]}</span>
              <span><span className="block text-lg font-extrabold">{c.name} <span className="text-sm font-bold text-muted">(sample)</span></span><span className="text-sm text-muted">{c.grade} · age {c.age}</span></span>
            </label>
          );
        })}
      </div>

      <section aria-labelledby="pb-sum" className="grid gap-4 lg:grid-cols-4">
        <h2 id="pb-sum" className="sr-only">Progress summary for {child.name}</h2>
        <Card className="flex items-center gap-4 lg:col-span-2">
          <Ring value={child.overall} size={110} stroke={13} colorClass="text-visual" label={`Overall progress ${child.overall}%`} />
          <div>
            <p className="text-2xl font-extrabold">{child.name} is growing steadily</p>
            <p className="mt-1 text-muted">Progress shows practice, not a grade. It rises with short, regular sessions.</p>
          </div>
        </Card>
        <Card className="!p-5"><p className="font-display text-4xl font-extrabold">{child.lessonsThisWeek}</p><p className="font-bold text-muted">lessons this week</p></Card>
        <Card className="!p-5"><p className="font-display text-4xl font-extrabold">{child.minutes}<span className="text-xl"> min</span></p><p className="font-bold text-muted">{child.streak}-day learning habit</p></Card>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 !border-visual bg-visual-soft">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-visual-deep"><Sprout className="h-6 w-6" aria-hidden="true" /> Going well</h2>
          <ul className="mt-3 space-y-2 font-semibold">{child.strengths.map((s) => <li key={s} className="flex gap-2"><CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-visual-deep" aria-hidden="true" />{s}</li>)}</ul>
        </Card>
        <Card className="border-2 !border-example bg-example-soft">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-example-deep"><Sparkles className="h-6 w-6" aria-hidden="true" /> Growing next</h2>
          <ul className="mt-3 space-y-2 font-semibold">{child.practise.map((s) => <li key={s} className="flex gap-2"><Sprout className="mt-0.5 h-5 w-5 shrink-0 text-example-deep" aria-hidden="true" />{s}</li>)}</ul>
          <p className="mt-3 text-sm">These are the next small steps, not shortcomings.</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h2 className="mb-2 text-xl font-extrabold">This week’s learning</h2>
          <WeeklyChart data={week} label="Minutes studied" unit="min" />
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-extrabold">Topic confidence</h2>
          <ul className="space-y-4">{child.topics.map((t) => (
            <li key={t.name}><div className="mb-1 flex justify-between font-bold"><span>{t.name}</span><span>{t.pct}%</span></div><ProgressBar value={t.pct} label={t.name} colorClass="bg-visual" height="h-3" /></li>
          ))}</ul>
        </Card>
      </div>

      <Card as="section" aria-labelledby="pb-rec">
        <h2 id="pb-rec" className="mb-3 flex items-center gap-2 text-xl font-extrabold"><Heart className="h-6 w-6 text-listen" aria-hidden="true" /> Supportive ideas for you</h2>
        <ul className="grid gap-3 md:grid-cols-3">{child.recommendations.map((r) => <li key={r} className="rounded-ctl border border-line bg-sunken p-4 font-semibold">{r}</li>)}</ul>
      </Card>

      <section aria-labelledby="pb-help" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 id="pb-help" className="mb-1 flex items-center gap-2 text-xl font-extrabold"><Users className="h-6 w-6 text-primary" aria-hidden="true" /> Help me help my child</h2>
          <p className="mb-4 text-muted">Short guides in plain words. No subject knowledge needed.</p>
          <div className="space-y-2">
            {PARENT_GUIDES.map((g) => (
              <details key={g.q} className="group rounded-ctl border-2 border-line open:border-ink">
                <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 font-bold [&::-webkit-details-marker]:hidden">
                  {g.q}<ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <ul className="list-disc space-y-1.5 px-9 pb-4">{g.a.map((x) => <li key={x}>{x}</li>)}</ul>
              </details>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-1 flex items-center gap-2 text-xl font-extrabold"><Home className="h-6 w-6 text-visual" aria-hidden="true" /> Home activities for {child.name}</h2>
          <p className="mb-3 text-muted">{done.length} of {child.activities.length} tried this week</p>
          <ProgressBar value={done.length} max={child.activities.length} label="Activities tried" colorClass="bg-visual" height="h-3" className="mb-4" />
          <ul className="space-y-3">
            {child.activities.map((a) => (
              <li key={a.id} className={`rounded-ctl border-2 p-3 ${done.includes(a.id) ? 'border-visual bg-visual-soft' : 'border-line'}`}>
                <div className="flex items-start gap-3">
                  <input id={`act-${a.id}`} type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-primary" checked={done.includes(a.id)} onChange={() => { toggle(a.id); if (!done.includes(a.id)) toast('Nice. Small steps add up.'); }} />
                  <label htmlFor={`act-${a.id}`} className="cursor-pointer"><span className="block font-extrabold">{a.title} <span className="font-semibold text-muted">· {a.minutes} min</span></span><span className="text-sm">{a.desc}</span></label>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-4 border-2 !border-ink shadow-pop">
        <div><h2 className="text-xl font-extrabold">Sample weekly report</h2><p className="text-muted">A two-minute summary you could share with a teacher or keep for yourself.</p></div>
        <Button onClick={() => setReport(true)}><FileText className="h-4 w-4" aria-hidden="true" /> Preview report</Button>
      </Card>

      <Modal open={report} onClose={() => setReport(false)} size="lg" title={`${child.name}’s week`} description={`${child.grade} · sample report`}
        footer={<><Button variant="secondary" onClick={() => setReport(false)}>Close</Button><Button onClick={printIt}><Printer className="h-4 w-4" aria-hidden="true" /> Print or save as PDF</Button></>}>
        <DemoBadge className="mb-4">Sample data, not a real child</DemoBadge>
        <p className="text-lg"><b>{child.name}</b> studied for <b>{child.minutes} minutes</b> across <b>{child.lessonsThisWeek} lessons</b> and has kept a <b>{child.streak}-day</b> learning habit.</p>
        <h3 className="mb-1 mt-5 font-extrabold">Going well</h3>
        <ul className="list-disc space-y-1 pl-6">{child.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        <h3 className="mb-1 mt-5 font-extrabold">Growing next</h3>
        <ul className="list-disc space-y-1 pl-6">{child.practise.map((s) => <li key={s}>{s}</li>)}</ul>
        <h3 className="mb-2 mt-5 font-extrabold">Topics</h3>
        {child.topics.map((t) => <div key={t.name} className="mb-3"><div className="flex justify-between font-bold"><span>{t.name}</span><span>{t.pct}%</span></div><ProgressBar value={t.pct} label={t.name} colorClass="bg-primary" /></div>)}
        <div className="mt-5 rounded-ctl border-2 border-example bg-example-soft p-4"><p className="font-extrabold">One thing to try this week</p><p><b>{child.activities[0].title}:</b> {child.activities[0].desc}</p></div>
      </Modal>
    </div>
  );
}
