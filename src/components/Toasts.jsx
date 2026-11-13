import { CircleCheck, CircleAlert, Award, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const ICONS = { success: CircleCheck, error: CircleAlert, badge: Award, info: Info };
const TONE = {
  success: 'bg-visual-soft text-visual-deep border-visual',
  error: 'bg-danger-soft text-danger border-danger',
  badge: 'bg-example-soft text-example-deep border-example',
  info: 'bg-primary-soft text-primary-deep border-primary',
};

export default function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      {toasts.map((x) => {
        const Icon = ICONS[x.type] || Info;
        return (
          <div key={x.id} className={`pointer-events-auto flex w-full max-w-md animate-pop items-center gap-3 rounded-ctl border-2 px-4 py-3 font-bold shadow-pop-sm ${TONE[x.type] || TONE.info}`}>
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="flex-1">{x.message}</span>
            <button type="button" onClick={() => dismissToast(x.id)} aria-label="Dismiss notification" className="rounded p-1 hover:bg-ink/10">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
