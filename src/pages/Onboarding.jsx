import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Pencil } from 'lucide-react';
import { useApp, roleHome } from '../context/AppContext.jsx';
import Logo from '../components/Logo.jsx';
import { Button, ProgressBar } from '../components/ui.jsx';
import { ACCESS_OPTIONS, FORMAT_OPTIONS, ROLES, STAGES } from '../data/options.js';
import { TOPIC_INTERESTS } from '../data/lessons.js';
import { LANGUAGES } from '../utils/i18n.js';
import { formatMeta } from '../utils/formats.js';

const STEPS = ['Role', 'Stage', 'Language', 'Accessibility', 'Topics', 'Format', 'Review'];

function Choice({ type = 'radio', name, checked, onChange, icon: Icon, label, desc, disabled, badge, children }) {
  return (
    <label className={`relative flex min-h-[64px] items-start gap-3 rounded-ctl border-2 p-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer'} ${checked ? 'border-ink bg-primary-soft shadow-pop-sm' : 'border-line bg-surface hover:border-ink'}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} disabled={disabled} className="sr-only" />
      {Icon && <Icon className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />}
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{label}</span>
        {desc && <span className="block text-sm text-muted">{desc}</span>}
        {children}
      </span>
      {badge && <span className="chip !py-0.5 text-xs">{badge}</span>}
      {checked && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-bg" aria-hidden="true"><Check className="h-4 w-4" /></span>}
    </label>
  );
}

export default function Onboarding() {
  const { prefs, updatePrefs, user, toast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const headRef = useRef(null);

  useEffect(() => { document.title = 'Set up · AccessLearn'; }, []);
  useEffect(() => { headRef.current?.focus(); }, [step]);

  const go = (n) => { setStep(n); setReached((r) => Math.max(r, n)); };

  // Accessibility choices apply live so the learner can feel the effect straight away.
  const setAccess = (id, on) => {
    const set = new Set(prefs.accessibility);
    on ? set.add(id) : set.delete(id);
    const a = [...set];
    updatePrefs({
      accessibility: a,
      textSize: a.includes('largeText') ? 130 : 100,
      reducedMotion: a.includes('reducedMotion'),
      readingMode: a.includes('readingMode'),
      theme: a.includes('highContrast') ? 'contrast' : prefs.theme === 'contrast' ? 'light' : prefs.theme,
      audio: { ...prefs.audio, autoplay: a.includes('audio') },
      ...(a.includes('simpleLanguage') && prefs.defaultFormat !== 'simple' ? { defaultFormat: 'simple' } : {}),
    });
  };
  const toggleTopic = (id) => updatePrefs({ topics: prefs.topics.includes(id) ? prefs.topics.filter((x) => x !== id) : [...prefs.topics, id] });

  const finish = () => {
    updatePrefs({ onboarded: true });
    toast('You are all set. Your preferences are saved on this device.');
    navigate(roleHome(prefs.role), { replace: true });
  };

  const role = ROLES.find((r) => r.id === prefs.role);
  const stage = STAGES.find((s) => s.id === prefs.stage);
  const lang = LANGUAGES.find((l) => l.code === prefs.language);
  const fmt = FORMAT_OPTIONS.find((f) => f.id === prefs.defaultFormat);

  const titles = [
    ['Who are you learning as?', 'This tailors your dashboard and what we recommend first.'],
    ['Which learning stage fits best?', 'Parents and teachers: pick the stage of the learners you support.'],
    ['Which language do you prefer?', 'English and Hindi are fully available in the core learner experience.'],
    ['Anything that makes learning easier?', 'Choose any that help. Each one applies immediately and you can change them later in Settings.'],
    ['What are you curious about?', 'Pick a few topics. We will recommend lessons that match.'],
    ['How do you like to learn?', 'This is the format a lesson opens in. You can always switch.'],
    ['Check your answers', 'Select Edit to change anything before you start.'],
  ];

  const summary = [
    { label: 'Role', value: role?.label, to: 0 },
    { label: 'Stage', value: stage?.label, to: 1 },
    { label: 'Language', value: `${lang?.label} (${lang?.native})`, to: 2 },
    { label: 'Accessibility', value: prefs.accessibility.length ? prefs.accessibility.map((id) => ACCESS_OPTIONS.find((o) => o.id === id)?.label).join(', ') : 'No adjustments', to: 3 },
    { label: 'Topics', value: prefs.topics.length ? prefs.topics.join(', ') : 'None chosen yet', to: 4 },
    { label: 'Preferred format', value: fmt?.label, to: 5 },
  ];

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <Logo />
        <p className="text-sm text-muted">Signed in as <b className="text-ink">{user?.name}</b></p>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <nav aria-label="Setup progress" className="mb-6">
          <ProgressBar value={step + 1} max={STEPS.length} label={`Step ${step + 1} of ${STEPS.length}`} colorClass="bg-ink" height="h-3" />
          <ol className="mt-3 flex justify-between gap-1">
            {STEPS.map((s, i) => (
              <li key={s} className="min-w-0 flex-1 text-center">
                <button type="button" disabled={i > reached} onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined} className={`w-full rounded-lg px-1 py-1.5 text-xs font-bold sm:text-sm ${i === step ? 'bg-ink text-bg' : i <= reached ? 'text-ink hover:bg-sunken' : 'text-muted/60'}`}>
                  <span className="sm:hidden">{i + 1}</span><span className="hidden sm:inline">{s}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <section className="card border-2 !border-ink p-5 shadow-pop sm:p-8" aria-labelledby="step-h">
          <p className="text-sm font-bold text-primary">Step {step + 1} of {STEPS.length}</p>
          <h1 id="step-h" ref={headRef} tabIndex={-1} className="mt-1 text-3xl font-extrabold outline-none">{titles[step][0]}</h1>
          <p className="mt-2 text-muted">{titles[step][1]}</p>

          <div className="mt-6">
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Role">
                {ROLES.map((r) => (
                  <Choice key={r.id} name="role" checked={prefs.role === r.id} onChange={() => updatePrefs({ role: r.id, stage: r.stage })} icon={r.icon} label={r.label} desc={r.desc} />
                ))}
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Learning stage">
                {STAGES.map((s) => <Choice key={s.id} name="stage" checked={prefs.stage === s.id} onChange={() => updatePrefs({ stage: s.id })} label={s.label} desc={s.hint} />)}
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Language">
                {LANGUAGES.map((l) => (
                  <Choice key={l.code} name="lang" checked={prefs.language === l.code} onChange={() => updatePrefs({ language: l.code })} disabled={!l.available} label={`${l.label} · ${l.native}`} desc={l.available ? 'Fully available in lessons and quizzes' : 'Not available yet'} />
                ))}
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Accessibility preferences">
                {ACCESS_OPTIONS.map((o) => <Choice key={o.id} type="checkbox" checked={prefs.accessibility.includes(o.id)} onChange={(e) => setAccess(o.id, e.target.checked)} icon={o.icon} label={o.label} desc={o.desc} />)}
              </div>
            )}
            {step === 4 && (
              <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Topics of interest">
                {TOPIC_INTERESTS.map((o) => <Choice key={o.id} type="checkbox" checked={prefs.topics.includes(o.id)} onChange={() => toggleTopic(o.id)} label={o.en} />)}
              </div>
            )}
            {step === 5 && (
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Preferred format">
                {FORMAT_OPTIONS.map((f) => {
                  const m = formatMeta(f.id);
                  return (
                    <Choice key={f.id} name="format" checked={prefs.defaultFormat === f.id} onChange={() => updatePrefs({ defaultFormat: f.id })} icon={m.icon} label={f.label} desc={f.desc} />
                  );
                })}
              </div>
            )}
            {step === 6 && (
              <dl className="divide-y divide-line rounded-ctl border-2 border-line">
                {summary.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0"><dt className="text-sm font-bold text-muted">{s.label}</dt><dd className="font-bold">{s.value}</dd></div>
                    <Button variant="secondary" size="sm" onClick={() => go(s.to)} aria-label={`Edit ${s.label}`}><Pencil className="h-4 w-4" aria-hidden="true" /> Edit</Button>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => go(step - 1)} disabled={step === 0}><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => go(step + 1)}>Next <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            ) : (
              <Button onClick={finish} size="lg"><Check className="h-5 w-5" aria-hidden="true" /> Start learning</Button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
