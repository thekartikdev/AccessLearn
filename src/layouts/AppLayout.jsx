import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Library, Sparkles, ClipboardCheck, FileUp, Mountain, HeartHandshake, GraduationCap, Settings2, LogOut, Menu, X, Flame } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useApp } from '../context/AppContext.jsx';
import { Segmented } from '../components/ui.jsx';

function NavItem({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex min-h-[44px] items-center gap-3 rounded-ctl px-3 py-2 font-bold transition ${isActive ? 'bg-ink text-bg' : 'text-ink hover:bg-sunken'}`
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  );
}

function SideNav({ onNavigate }) {
  const { t, user, logout, progress } = useApp();
  const navigate = useNavigate();
  const learnId = progress.recent[0]?.lessonId || 'photosynthesis';
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <Logo to="/dashboard" className="px-1 pt-1" />
      <nav aria-label="Main" className="flex flex-col gap-6">
        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs font-bold text-muted">{t('nav.learner')}</p>
          <NavItem to="/dashboard" icon={LayoutDashboard} label={t('nav.dashboard')} onNavigate={onNavigate} />
          <NavItem to="/lessons" icon={Library} label={t('nav.lessons')} onNavigate={onNavigate} />
          <NavItem to={`/learn/${learnId}`} icon={Sparkles} label={t('nav.learn')} onNavigate={onNavigate} />
          <NavItem to="/quiz" icon={ClipboardCheck} label={t('nav.quiz')} onNavigate={onNavigate} />
          <NavItem to="/transformer" icon={FileUp} label={t('nav.tools')} onNavigate={onNavigate} />
          <NavItem to="/growth" icon={Mountain} label={t('nav.growth')} onNavigate={onNavigate} />
        </div>
        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs font-bold text-muted">{t('nav.family')}</p>
          <NavItem to="/parent" icon={HeartHandshake} label={t('nav.parent')} onNavigate={onNavigate} />
          <NavItem to="/teacher" icon={GraduationCap} label={t('nav.teacher')} onNavigate={onNavigate} />
        </div>
        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs font-bold text-muted">{t('nav.account')}</p>
          <NavItem to="/settings" icon={Settings2} label={t('nav.settings')} onNavigate={onNavigate} />
        </div>
      </nav>
      <div className="mt-auto rounded-card border border-line bg-sunken p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-example font-display text-lg font-extrabold text-ink" aria-hidden="true">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.demo ? 'Demo account' : user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { logout(); onNavigate?.(); navigate('/'); }}
          className="btn btn-secondary btn-sm mt-3 w-full"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" /> {t('nav.logout')}
        </button>
        <p className="mt-2 text-[11px] leading-snug text-muted">Simulated sign-in. Demo only, no real accounts.</p>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const { t, prefs, updatePrefs, streak } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="min-h-screen lg:pl-72">
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>{t('nav.skip')}</a>

      <aside className="no-print fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-surface lg:block">
        <SideNav />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="relative h-full w-[19rem] max-w-[86vw] animate-slide border-r-2 border-ink bg-surface" aria-label="Menu">
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm absolute right-2 top-2 !px-2" aria-label={t('common.close')}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <SideNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <header className="no-print sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-bg/90 px-4 py-2.5 backdrop-blur sm:px-8">
        <button type="button" className="btn btn-secondary btn-sm lg:hidden" onClick={() => setOpen(true)} aria-expanded={open} aria-label={t('nav.menu')}>
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">{t('nav.menu')}</span>
        </button>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-3">
          <span className="chip" title="Study streak">
            <Flame className="h-4 w-4 text-listen" aria-hidden="true" />
            <b>{streak}</b> <span className="hidden sm:inline">{t('dash.streak')}</span>
          </span>
          <Segmented
            label={t('common.language')}
            value={prefs.language}
            onChange={(v) => updatePrefs({ language: v })}
            options={[{ value: 'en', label: 'EN' }, { value: 'hi', label: 'हिं' }]}
          />
        </div>
      </header>

      <main id="main" ref={mainRef} tabIndex={-1} className="mx-auto max-w-6xl px-4 py-6 outline-none sm:px-8 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
