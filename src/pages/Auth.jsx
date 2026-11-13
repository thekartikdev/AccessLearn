import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CircleAlert, CircleCheck, Eye, EyeOff, Info, Sparkles } from 'lucide-react';
import { useApp, roleHome } from '../context/AppContext.jsx';
import Logo, { LogoMark } from '../components/Logo.jsx';
import { Button, Field } from '../components/ui.jsx';
import { ROLES } from '../data/options.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(mode, v) {
  const e = {};
  if (mode === 'signup' && v.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).';
  if (!v.email.trim()) e.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address does not look right. Try name@example.com.';
  if (!v.password) e.password = 'Enter a password.';
  else if (v.password.length < 8) e.password = 'Use at least 8 characters.';
  else if (mode === 'signup' && !(/[A-Za-z]/.test(v.password) && /\d/.test(v.password))) e.password = 'Include at least one letter and one number.';
  if (mode === 'signup') {
    if (!v.confirm) e.confirm = 'Type your password again.';
    else if (v.confirm !== v.password) e.confirm = 'The passwords do not match.';
  }
  return e;
}

export default function Auth({ mode }) {
  const isSignup = mode === 'signup';
  const { user, prefs, login, signup, loginDemo } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '', role: prefs.role || 'college' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(null); // {type, text}
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = `${isSignup ? 'Sign up' : 'Log in'} · AccessLearn`; }, [isSignup]);
  useEffect(() => { setErrors({}); setTouched({}); setStatus(null); }, [mode]);

  const enterDemo = () => {
    loginDemo();
    navigate('/dashboard');
  };
  useEffect(() => {
    if (sp.get('demo') === '1') enterDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched[k] || Object.keys(errors).length) setErrors(validate(mode, next));
  };
  const blur = (k) => () => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validate(mode, v)); };
  const shown = (k) => (touched[k] || status?.type === 'error') && errors[k];

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(mode, v);
    setErrors(errs);
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (Object.keys(errs).length) {
      setStatus({ type: 'error', text: `Please fix ${Object.keys(errs).length === 1 ? 'the highlighted field' : 'the highlighted fields'} and try again.` });
      return;
    }
    setBusy(true);
    setStatus({ type: 'success', text: isSignup ? 'Demo account created on this device. Taking you to set up your preferences…' : 'Signed in (simulated). Opening your dashboard…' });
    window.setTimeout(async () => {
      try {
        if (isSignup) {
          await signup({ name: v.name, email: v.email, password: v.password, role: v.role });
          navigate('/onboarding');
        } else {
          await login({ email: v.email, password: v.password, role: v.role });
          const dest = location.state?.from || roleHome(v.role);
          navigate(prefs.onboarded ? dest : '/onboarding');
        }
      } catch (err) {
        setStatus({ type: 'error', text: err.message || 'An error occurred during authentication.' });
        setBusy(false);
      }
    }, 700);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <a href="#main" className="skip-link">Skip to main content</a>
      <aside className="relative hidden overflow-hidden bg-ink p-10 text-bg lg:flex lg:flex-col lg:justify-between" aria-hidden="false">
        <Link to="/" className="inline-flex items-center gap-2.5"><LogoMark size={40} /><span className="font-display text-2xl font-extrabold">AccessLearn</span></Link>
        <div>
          <p className="font-display text-5xl font-extrabold leading-[1.05]">One concept.<br />Five ways in.</p>
          <p className="mt-5 max-w-sm text-lg opacity-80">Read it simply, see it, hear it, connect it to real life, then practise it. You choose how it clicks.</p>
          <div className="mt-8 flex items-end gap-3" aria-hidden="true">
            {['bg-simple', 'bg-visual', 'bg-listen', 'bg-example', 'bg-practice'].map((c, i) => (
              <span key={c} className={`w-12 rounded-full ${c}`} style={{ height: [60, 110, 150, 110, 60][i] }} />
            ))}
          </div>
        </div>
        <p className="text-sm opacity-70">Frontend-only prototype. Nothing you type here leaves your browser.</p>
      </aside>

      <main id="main" className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-2 text-muted">{isSignup ? 'Set up a demo profile in under a minute.' : 'Log in to pick up where you left off.'}</p>

          <p className="mt-4 flex gap-2 rounded-ctl border-2 border-dashed border-muted/60 p-3 text-sm text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span><b className="text-ink">Secure Authentication.</b> Powered by Supabase Auth with real database storage.</span>
          </p>

          {user && (
            <p className="mt-4 rounded-ctl border border-line bg-sunken p-3 text-sm">
              You are signed in as <b>{user.name}</b>. <Link className="font-bold text-primary underline" to={roleHome(user.role)}>Go to your dashboard</Link>
            </p>
          )}

          <form onSubmit={submit} noValidate className="mt-6 space-y-4" aria-describedby={status ? 'form-status' : undefined}>
            <div id="form-status" role={status?.type === 'error' ? 'alert' : 'status'} aria-live="polite">
              {status && (
                <p className={`flex items-start gap-2 rounded-ctl border-2 p-3 font-bold ${status.type === 'error' ? 'border-danger bg-danger-soft text-danger' : 'border-visual bg-visual-soft text-visual-deep'}`}>
                  {status.type === 'error' ? <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
                  {status.text}
                </p>
              )}
            </div>

            {isSignup && <Field label="Full name" autoComplete="name" value={v.name} onChange={set('name')} onBlur={blur('name')} error={shown('name')} />}
            <Field label="Email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} onBlur={blur('email')} error={shown('email')} placeholder="name@example.com" />
            <div>
              <div className="relative">
                <Field label="Password" type={show ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={v.password} onChange={set('password')} onBlur={blur('password')} error={shown('password')} hint={isSignup ? 'At least 8 characters, with a letter and a number.' : undefined} className="[&_input]:pr-12" />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} className="absolute right-1.5 top-[1.95rem] flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-sunken hover:text-ink">
                  {show ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>
            {isSignup && <Field label="Confirm password" type={show ? 'text' : 'password'} autoComplete="new-password" value={v.confirm} onChange={set('confirm')} onBlur={blur('confirm')} error={shown('confirm')} />}

            <fieldset>
              <legend className="label">{isSignup ? 'I am a…' : 'Continue as'}</legend>
              <div className={`grid gap-2 ${isSignup ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
                {(isSignup ? ROLES : ROLES.filter((r) => ['college', 'parent', 'teacher'].includes(r.id))).map((r) => (
                  <label key={r.id} className={`flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-ctl border-2 px-3 py-2 font-bold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${v.role === r.id ? 'border-ink bg-primary-soft' : 'border-line hover:border-ink'}`}>
                    <input type="radio" name="role" value={r.id} checked={v.role === r.id} onChange={set('role')} className="sr-only" />
                    <r.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="text-sm leading-tight">{isSignup ? r.label : r.id === 'college' ? 'Learner' : r.id === 'parent' ? 'Parent' : 'Teacher'}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? 'One moment…' : isSignup ? 'Create account' : 'Log in'}</Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-sm text-muted"><span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" /></div>
          <Button variant="secondary" className="w-full" onClick={enterDemo}><Sparkles className="h-4 w-4" aria-hidden="true" /> Explore with the demo account</Button>

          <p className="mt-6 text-center">
            {isSignup ? <>Already have an account? <Link className="font-bold text-primary underline" to="/login">Log in</Link></> : <>New to AccessLearn? <Link className="font-bold text-primary underline" to="/signup">Create an account</Link></>}
          </p>
        </div>
      </main>
    </div>
  );
}
