import { useState } from 'react';
import { Check, Moon, Sun, Contrast, Volume2, Trash2, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Button, Card, Modal, PageHeader, Segmented, Toggle } from '../components/ui.jsx';
import { LANGUAGES } from '../utils/i18n.js';
import { DEFAULT_PREFS } from '../data/seed.js';
import { FORMATS } from '../utils/formats.js';
import { useSpeech } from '../hooks/useSpeech.js';

const SIZES = [90, 100, 115, 130, 150];

export default function Settings() {
  const { t, lang, prefs, updatePrefs, updateAudio, resetProgress, resetEverything, toast } = useApp();
  const [confirm, setConfirm] = useState(null); // 'progress' | 'all' | 'prefs'
  const sp = useSpeech({ lang, rate: prefs.audio.rate });
  const sizeIdx = Math.max(0, SIZES.indexOf(prefs.textSize));

  const doConfirm = () => {
    if (confirm === 'progress') { resetProgress(); toast('Demo progress reset'); }
    if (confirm === 'prefs') { updatePrefs({ ...DEFAULT_PREFS, onboarded: true, language: prefs.language }); toast(t('set.saved')); }
    if (confirm === 'all') { resetEverything(); }
    setConfirm(null);
  };

  return (
    <div>
      <PageHeader title={t('set.title')} subtitle={t('set.sub')} />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card as="section" aria-labelledby="s-lang">
            <h2 id="s-lang" className="text-xl font-extrabold">{t('set.language')}</h2>
            <p className="mt-1 text-sm text-muted">{t('set.languageNote')}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={t('set.language')}>
              {LANGUAGES.map((l) => {
                const on = prefs.language === l.code;
                return (
                  <label key={l.code} className={`flex min-h-[56px] items-center gap-3 rounded-ctl border-2 px-4 py-2 font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${l.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-55'} ${on ? 'border-ink bg-primary-soft' : 'border-line'}`}>
                    <input type="radio" name="language" className="sr-only" checked={on} disabled={!l.available} onChange={() => updatePrefs({ language: l.code })} />
                    <span className="flex-1">{l.label} <span className="font-normal text-muted">· {l.native}</span></span>
                    {!l.available && <span className="chip !py-0.5 text-xs">{t('set.soon')}</span>}
                    {on && <Check className="h-5 w-5" aria-hidden="true" />}
                  </label>
                );
              })}
            </div>
          </Card>

          <Card as="section" aria-labelledby="s-text">
            <h2 id="s-text" className="text-xl font-extrabold">{t('set.textSize')}: {prefs.textSize}%</h2>
            <input aria-labelledby="s-text" type="range" min="0" max={SIZES.length - 1} step="1" value={sizeIdx} onChange={(e) => updatePrefs({ textSize: SIZES[+e.target.value] })} className="mt-4 w-full accent-primary" aria-valuetext={`${prefs.textSize}%`} />
            <div className="mt-1 flex justify-between text-sm font-bold text-muted" aria-hidden="true"><span>A</span><span className="text-lg">A</span><span className="text-2xl">A</span></div>
          </Card>

          <Card as="section" aria-labelledby="s-look" className="space-y-5">
            <h2 id="s-look" className="text-xl font-extrabold">{t('set.theme')}</h2>
            <Segmented label={t('set.theme')} value={prefs.theme} onChange={(v) => updatePrefs({ theme: v })} options={[{ value: 'light', label: t('set.light'), icon: Sun }, { value: 'dark', label: t('set.dark'), icon: Moon }, { value: 'contrast', label: t('set.contrast'), icon: Contrast }]} />
            <Toggle label={t('set.reading')} description={t('set.readingDesc')} checked={prefs.readingMode} onChange={(v) => updatePrefs({ readingMode: v })} />
            <Toggle label={t('set.motion')} description={t('set.motionDesc')} checked={prefs.reducedMotion} onChange={(v) => updatePrefs({ reducedMotion: v })} />
          </Card>

          <Card as="section" aria-labelledby="s-fmt">
            <h2 id="s-fmt" className="text-xl font-extrabold">{t('set.format')}</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5" role="radiogroup" aria-label={t('set.format')}>
              {FORMATS.map((f) => {
                const on = prefs.defaultFormat === f.id;
                return (
                  <label key={f.id} className={`flex min-h-[72px] cursor-pointer flex-col items-center justify-center gap-1 rounded-ctl border-2 p-2 text-center text-sm font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${on ? `border-ink ${f.cls.soft} shadow-pop-sm` : 'border-line hover:border-ink'}`}>
                    <input type="radio" name="format" className="sr-only" checked={on} onChange={() => updatePrefs({ defaultFormat: f.id })} />
                    <f.icon className="h-5 w-5" aria-hidden="true" />{t(`lesson.${f.id}Short`)}
                  </label>
                );
              })}
            </div>
          </Card>

          <Card as="section" aria-labelledby="s-audio" className="space-y-5">
            <h2 id="s-audio" className="text-xl font-extrabold">{t('set.audio')}</h2>
            <label className="flex flex-wrap items-center gap-3 font-bold">
              {t('set.rate')}
              <select className="input !w-auto" value={prefs.audio.rate} onChange={(e) => updateAudio({ rate: +e.target.value })}>
                {[0.75, 1, 1.25, 1.5].map((r) => <option key={r} value={r}>{r}×</option>)}
              </select>
            </label>
            <Toggle label={t('set.autoplay')} description="Some browsers need a tap on the page before audio can start." checked={prefs.audio.autoplay} onChange={(v) => updateAudio({ autoplay: v })} />
            <Toggle label={t('set.highlight')} checked={prefs.audio.highlight} onChange={(v) => updateAudio({ highlight: v })} />
            <div>
              <Button variant="secondary" size="sm" disabled={!sp.isSupported} onClick={() => (sp.status === 'playing' ? sp.stop() : sp.speak([t('set.previewText')]))}><Volume2 className="h-4 w-4" aria-hidden="true" /> {sp.status === 'playing' ? t('lesson.stop') : 'Test voice'}</Button>
              {!sp.isSupported && <p className="mt-2 text-sm text-muted">{t('lesson.noSpeech')}</p>}
            </div>
          </Card>

          <Card as="section" aria-labelledby="s-data">
            <h2 id="s-data" className="text-xl font-extrabold">{t('set.data')}</h2>
            <p className="mt-1 text-sm text-muted">{t('set.dataDesc')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => setConfirm('prefs')}><RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('set.reset')}</Button>
              <Button variant="secondary" size="sm" onClick={() => setConfirm('progress')}><RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('set.resetProgress')}</Button>
              <Button variant="danger" size="sm" onClick={() => setConfirm('all')}><Trash2 className="h-4 w-4" aria-hidden="true" /> {t('set.resetAll')}</Button>
            </div>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label={t('set.preview')}>
          <Card className="border-2 !border-ink shadow-pop">
            <h2 className="text-sm font-bold text-muted">{t('set.preview')}</h2>
            <h3 className="mt-2 text-2xl font-extrabold">{lang === 'hi' ? 'प्रकाश संश्लेषण' : 'Photosynthesis'}</h3>
            <p className="mt-3 text-lg leading-relaxed">{t('set.previewText')}</p>
            <div className="mt-4 flex gap-2" aria-hidden="true">
              {FORMATS.map((f) => <span key={f.id} className={`h-3 flex-1 rounded-full ${f.cls.solid}`} />)}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-sm text-muted"><Check className="h-4 w-4" aria-hidden="true" /> {t('set.saved')}</p>
          </Card>
        </aside>
      </div>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} size="sm" title={confirm === 'all' ? t('set.resetAll') : confirm === 'progress' ? t('set.resetProgress') : t('set.reset')}
        footer={<><Button variant="secondary" onClick={() => setConfirm(null)} data-autofocus>{t('common.cancel')}</Button><Button variant={confirm === 'all' ? 'danger' : 'primary'} onClick={doConfirm}>{t('common.continue')}</Button></>}>
        <p>{confirm === 'all' ? 'This clears your preferences, progress, bookmarks, teacher-made content and signs you out. It only affects this browser.' : confirm === 'progress' ? 'Your progress goes back to the sample demo data. Preferences and teacher-made content are kept.' : 'Text size, theme, reading mode, motion, format and audio return to their defaults.'}</p>
      </Modal>
    </div>
  );
}
