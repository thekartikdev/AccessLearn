import { CircleCheck, CircleX } from 'lucide-react';
import { pick } from '../utils/i18n.js';

/**
 * Accessible multiple-choice question using native radio inputs.
 * Feedback never relies on colour alone: icons and text label correct / incorrect options.
 */
export default function QuestionCard({ q, lang, t, selected, onSelect, revealed, name }) {
  const options = pick(q.options, lang);
  const isRight = selected === q.answer;
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-lg font-bold leading-snug">{pick(q.prompt, lang)}</legend>
      <div className="space-y-2.5">
        {options.map((opt, i) => {
          const chosen = selected === i;
          const correct = revealed && i === q.answer;
          const wrong = revealed && chosen && i !== q.answer;
          let tone = 'border-line bg-surface hover:border-ink';
          if (!revealed && chosen) tone = 'border-ink bg-primary-soft';
          if (correct) tone = 'border-visual bg-visual-soft';
          if (wrong) tone = 'border-danger bg-danger-soft';
          return (
            <label key={i} className={`flex cursor-pointer items-center gap-3 rounded-ctl border-2 px-4 py-3 font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${tone} ${revealed ? 'cursor-default' : ''}`}>
              <input type="radio" name={name} className="sr-only" checked={chosen} disabled={revealed} onChange={() => onSelect(i)} />
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold ${chosen || correct ? 'border-ink bg-ink text-bg' : 'border-line'}`} aria-hidden="true">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {correct && <span className="inline-flex items-center gap-1 text-sm font-bold text-visual-deep"><CircleCheck className="h-5 w-5" aria-hidden="true" /> {t('quiz.right')}</span>}
              {wrong && <span className="inline-flex items-center gap-1 text-sm font-bold text-danger"><CircleX className="h-5 w-5" aria-hidden="true" /> {t('quiz.yours')}</span>}
            </label>
          );
        })}
      </div>
      {revealed && (
        <div role="status" className={`mt-4 animate-pop rounded-ctl border-2 p-4 ${isRight ? 'border-visual bg-visual-soft' : 'border-example bg-example-soft'}`}>
          <p className="flex items-center gap-2 font-extrabold">
            {isRight ? <CircleCheck className="h-5 w-5 text-visual-deep" aria-hidden="true" /> : <CircleX className="h-5 w-5 text-example-deep" aria-hidden="true" />}
            {isRight ? t('quiz.correct') : t('quiz.wrong')}
          </p>
          <p className="mt-1"><b>{t('quiz.explanation')}: </b>{pick(q.explain, lang)}</p>
        </div>
      )}
    </fieldset>
  );
}
