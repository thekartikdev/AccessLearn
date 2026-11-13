import { forwardRef, useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Info, LoaderCircle } from 'lucide-react';

/* ───────── Button ───────── */
const VARIANTS = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
  danger: 'btn btn-danger',
};
const SIZES = { sm: 'btn-sm', lg: 'btn-lg', md: '' };

export function Button({ variant = 'primary', size = 'md', to, href, className = '', children, ...rest }) {
  const cls = `${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}

/* ───────── Surfaces ───────── */
export function Card({ as: Tag = 'div', className = '', pad = true, children, ...rest }) {
  return <Tag className={`card ${pad ? 'card-pad' : ''} ${className}`} {...rest}>{children}</Tag>;
}

export function Chip({ children, className = '', icon: Icon }) {
  return (
    <span className={`chip ${className}`}>
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function DemoBadge({ children = 'Demo data', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-dashed border-muted/60 px-2.5 py-0.5 text-xs font-bold text-muted ${className}`}>
      <Info className="h-3 w-3" aria-hidden="true" /> {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-1 text-sm font-bold text-primary">{eyebrow}</p>}
        <h1 className="h-page">{title}</h1>
        {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center rounded-card border-2 border-dashed border-line px-6 py-12 text-center">
      {Icon && <Icon className="mb-3 h-9 w-9 text-muted" aria-hidden="true" />}
      <h3 className="text-lg font-bold">{title}</h3>
      {children && <p className="mt-1 max-w-md text-muted">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ label = 'Loading' }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-muted">
      <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> <span>{label}</span>
    </span>
  );
}

/* ───────── Progress ───────── */
export function ProgressBar({ value, max = 100, label, colorClass = 'bg-primary', className = '', height = 'h-2.5' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full bg-sunken ${height} ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-500 ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Ring({ value, size = 88, stroke = 10, colorClass = 'text-primary', label, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={label ?? `${Math.round(pct)}%`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-sunken" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          className={`stroke-current transition-[stroke-dashoffset] duration-700 ${colorClass}`}
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center font-display text-lg font-extrabold">
        {children ?? `${Math.round(pct)}%`}
      </div>
    </div>
  );
}

/* ───────── Form controls ───────── */
export function Toggle({ checked, onChange, label, description, id }) {
  const auto = useId();
  const tid = id || auto;
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={tid} className="block cursor-pointer font-bold">{label}</label>
        {description && <p id={`${tid}-d`} className="text-sm text-muted">{description}</p>}
      </div>
      <button
        id={tid}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${tid}-d` : undefined}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-8 w-14 shrink-0 rounded-full border-2 border-ink transition-colors ${checked ? 'bg-primary' : 'bg-sunken'}`}
      >
        <span className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-ink bg-surface transition-all ${checked ? 'left-[1.9rem]' : 'left-1'}`} />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}

export function Segmented({ options, value, onChange, label, className = '', fill = false }) {
  return (
    <div role="radiogroup" aria-label={label} className={`${fill ? 'flex' : 'inline-flex flex-wrap'} gap-1 rounded-ctl border-2 border-line bg-sunken p-1 ${className}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg py-1.5 text-sm font-bold transition disabled:opacity-40 ${fill ? 'flex-1 justify-center px-1.5 sm:px-2' : 'px-3'} ${active ? 'bg-surface text-ink shadow-soft ring-2 ring-ink' : 'text-muted hover:text-ink'}`}
          >
            {o.icon && <o.icon className="h-4 w-4" aria-hidden="true" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export const Field = forwardRef(function Field({ label, error, hint, id, className = '', as: Tag = 'input', children, ...rest }, ref) {
  const auto = useId();
  const fid = id || auto;
  const describedBy = [error ? `${fid}-e` : null, hint ? `${fid}-h` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={fid} className="label">{label}</label>
      <Tag
        ref={ref}
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`input ${error ? '!border-danger' : ''}`}
        {...rest}
      >
        {children}
      </Tag>
      {hint && !error && <p id={`${fid}-h`} className="mt-1 text-sm text-muted">{hint}</p>}
      {error && <p id={`${fid}-e`} role="alert" className="mt-1 text-sm font-bold text-danger">{error}</p>}
    </div>
  );
});

/* ───────── Tabs (ARIA tablist with arrow-key support) ───────── */
export function Tabs({ tabs, value, onChange, label, className = '' }) {
  const refs = useRef({});
  const onKey = (e, i) => {
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[n].id);
    refs.current[tabs[n].id]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className={`no-scrollbar flex gap-1 overflow-x-auto border-b-2 border-line ${className}`}>
      {tabs.map((tb, i) => {
        const active = tb.id === value;
        return (
          <button
            key={tb.id}
            ref={(el) => { refs.current[tb.id] = el; }}
            role="tab"
            id={`tab-${tb.id}`}
            aria-selected={active}
            aria-controls={`panel-${tb.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tb.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`-mb-0.5 inline-flex min-h-[44px] shrink-0 items-center gap-2 border-b-4 px-4 py-2 font-bold transition ${active ? 'border-primary text-ink' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {tb.icon && <tb.icon className="h-4 w-4" aria-hidden="true" />}
            {tb.label}
          </button>
        );
      })}
    </div>
  );
}

/* ───────── Modal with focus trap ───────── */
export function Modal({ open, onClose, title, children, footer, size = 'md', description }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';
    const focusables = () => [...ref.current.querySelectorAll('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])')];
    const first = ref.current.querySelector('[data-autofocus]') || focusables()[0] || ref.current;
    first.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); }
      if (e.key === 'Tab') {
        const f = focusables();
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? `${titleId}-d` : undefined}
        tabIndex={-1}
        className={`relative flex max-h-[92vh] w-full animate-pop flex-col rounded-t-panel border-2 border-ink bg-surface shadow-pop sm:rounded-panel ${width}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 id={titleId} className="text-xl font-extrabold">{title}</h2>
            {description && <p id={`${titleId}-d`} className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm -mr-2 -mt-1 !px-2" aria-label="Close dialog">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line p-4">{footer}</div>}
      </div>
    </div>
  );
}
