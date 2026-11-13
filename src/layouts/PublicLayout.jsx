import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { Button } from '../components/ui.jsx';
import { useApp } from '../context/AppContext.jsx';

const LINKS = [
  { to: '/#features', label: 'Features' },
  { to: '/#many-ways', label: 'Many Ways' },
  { to: '/#parentbridge', label: 'ParentBridge' },
  { to: '/#accessibility', label: 'Accessibility' },
  { to: '/#how', label: 'How it works' },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-muted">One platform. Every learner. Every stage of life.</p>
          <p className="mt-4 max-w-md text-sm text-muted">AccessLearn is a frontend-only hackathon prototype. There is no backend, no real accounts and no AI service. All data stays in your browser.</p>
        </div>
        <nav aria-label="Product">
          <h2 className="mb-3 text-sm font-bold">Product</h2>
          <ul className="space-y-2">
            {LINKS.map((l) => (<li key={l.to}><Link className="text-muted hover:text-ink hover:underline" to={l.to}>{l.label}</Link></li>))}
          </ul>
        </nav>
        <nav aria-label="Get started">
          <h2 className="mb-3 text-sm font-bold">Get started</h2>
          <ul className="space-y-2">
            <li><Link className="text-muted hover:text-ink hover:underline" to="/signup">Create a demo account</Link></li>
            <li><Link className="text-muted hover:text-ink hover:underline" to="/login">Log in</Link></li>
            <li><Link className="text-muted hover:text-ink hover:underline" to="/login?demo=1">Explore the demo</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-sm text-muted">Built for a hackathon. Statistics and testimonials on this site are sample content.</div>
    </footer>
  );
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useApp();
  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link">Skip to main content</a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <Logo />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (<Link key={l.to} to={l.to} className="whitespace-nowrap rounded-ctl px-3 py-2 font-bold text-muted hover:bg-sunken hover:text-ink">{l.label}</Link>))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <Button to="/dashboard" size="sm">Open dashboard</Button>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm" className="whitespace-nowrap">Log in</Button>
                <Button to="/signup" size="sm" className="whitespace-nowrap">Start Learning</Button>
              </>
            )}
          </div>
          <button type="button" className="btn btn-secondary btn-sm lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="animate-pop border-t border-line bg-surface px-4 pb-4 lg:hidden">
            <ul className="flex flex-col py-2">
              {LINKS.map((l) => (<li key={l.to}><Link to={l.to} onClick={() => setOpen(false)} className="flex min-h-[44px] items-center rounded-ctl px-3 font-bold hover:bg-sunken">{l.label}</Link></li>))}
            </ul>
            <div className="flex gap-2">
              {user ? <Button to="/dashboard" className="flex-1">Open dashboard</Button> : (<><Button to="/login" variant="secondary" className="flex-1">Log in</Button><Button to="/signup" className="flex-1">Start Learning</Button></>)}
            </div>
          </nav>
        )}
      </header>
      <main id="main"><Outlet /></main>
      <Footer />
    </div>
  );
}
