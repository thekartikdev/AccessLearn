import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, CircleCheck, Clock, Search, SearchX, UserPen } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Button, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui.jsx';
import { pick } from '../utils/i18n.js';
import { SUBJECTS } from '../data/lessons.js';

export default function Lessons() {
  const { t, lang, lessons, progress, toggleBookmark, toast } = useApp();
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || '';
  const subject = sp.get('subject') || 'all';
  const level = sp.get('level') || 'all';
  const onlyBookmarked = sp.get('bookmarked') === '1';

  const setParam = (k, v) => {
    const next = new URLSearchParams(sp);
    if (!v || v === 'all') next.delete(k); else next.set(k, v);
    setSp(next, { replace: true });
  };

  const subjects = useMemo(() => [...new Set(lessons.map((l) => l.subject))], [lessons]);
  const filtered = lessons.filter((l) => {
    const hay = `${l.title.en} ${l.title.hi || ''} ${pick(l.tagline, 'en')} ${l.subject}`.toLowerCase();
    return (!q || hay.includes(q.toLowerCase())) && (subject === 'all' || l.subject === subject) && (level === 'all' || l.level === level) && (!onlyBookmarked || progress.bookmarks.includes(l.id));
  });
  const filtersOn = q || subject !== 'all' || level !== 'all' || onlyBookmarked;

  return (
    <div>
      <PageHeader title={t('lib.title')} subtitle={t('lib.count', { n: filtered.length })} />
      <Card className="mb-6 grid gap-4 !p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-end" role="search">
        <div>
          <label htmlFor="lib-q" className="label">{t('lib.search')}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input id="lib-q" type="search" className="input !pl-10" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Recursion, fractions…" />
          </div>
        </div>
        <div>
          <label htmlFor="lib-s" className="label">{t('lib.subject')}</label>
          <select id="lib-s" className="input" value={subject} onChange={(e) => setParam('subject', e.target.value)}>
            <option value="all">{t('common.all')}</option>
            {subjects.map((s) => <option key={s} value={s}>{SUBJECTS[s] ? pick(SUBJECTS[s], lang) : s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="lib-l" className="label">{t('lib.level')}</label>
          <select id="lib-l" className="input" value={level} onChange={(e) => setParam('level', e.target.value)}>
            <option value="all">{t('common.all')}</option>
            <option value="Beginner">{t('common.beginner')}</option>
            <option value="Intermediate">{t('common.intermediate')}</option>
          </select>
        </div>
        <button type="button" role="switch" aria-checked={onlyBookmarked} onClick={() => setParam('bookmarked', onlyBookmarked ? '' : '1')} className={`btn ${onlyBookmarked ? 'btn-primary' : 'btn-secondary'}`}>
          <Bookmark className="h-4 w-4" aria-hidden="true" /> {t('lib.bookmarked')}
        </button>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title={t('lib.empty')} action={filtersOn && <Button variant="secondary" onClick={() => setSp({}, { replace: true })}>{t('lib.clear')}</Button>} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => {
            const explored = progress.lessonProgress[l.id]?.formats?.length || 0;
            const done = progress.completed.includes(l.id);
            const marked = progress.bookmarks.includes(l.id);
            return (
              <li key={l.id}>
                <Card className="flex h-full flex-col !p-5 transition hover:border-ink">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="chip !text-xs">{SUBJECTS[l.subject] ? pick(SUBJECTS[l.subject], lang) : l.subject}</span>
                      <span className="chip !text-xs">{t(`common.${l.level.toLowerCase()}`)}</span>
                      {l.custom && <span className="chip !text-xs border-practice bg-practice-soft text-practice-deep"><UserPen className="h-3 w-3" aria-hidden="true" />{t('lib.teacherMade')}</span>}
                    </div>
                    <button
                      type="button"
                      aria-pressed={marked}
                      aria-label={`${marked ? t('common.bookmarked') : t('common.bookmark')}: ${pick(l.title, lang)}`}
                      onClick={() => toast(toggleBookmark(l.id) ? t('lesson.bookmarkAdded') : t('lesson.bookmarkRemoved'), 'info')}
                      className="-mr-1 -mt-1 rounded-lg p-2 hover:bg-sunken"
                    >
                      {marked ? <BookmarkCheck className="h-5 w-5 text-primary" aria-hidden="true" /> : <Bookmark className="h-5 w-5" aria-hidden="true" />}
                    </button>
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold"><Link to={`/learn/${l.id}`} className="hover:underline">{pick(l.title, lang)}</Link></h2>
                  <p className="mt-1 flex-1 text-muted">{pick(l.tagline, lang)}</p>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-sm font-bold">
                      <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden="true" /> {l.minutes} {t('common.min')}</span>
                      {done ? <span className="inline-flex items-center gap-1 text-visual-deep"><CircleCheck className="h-4 w-4" aria-hidden="true" /> {t('lesson.done')}</span> : <span>{t('lesson.explored', { n: explored })}</span>}
                    </div>
                    <ProgressBar value={explored} max={5} label={pick(l.title, lang)} colorClass={done ? 'bg-visual' : 'bg-ink'} />
                  </div>
                  <Button to={`/learn/${l.id}`} variant="secondary" size="sm" className="mt-4 self-start">{t('common.open')}</Button>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
