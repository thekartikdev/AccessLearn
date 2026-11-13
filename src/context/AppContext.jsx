import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClient.js';
import { usePersistentState } from '../hooks/usePersistentState.js';
import { DEFAULT_PREFS, seedProgress } from '../data/seed.js';
import { KEYS, read, write, clearAccessLearn } from '../utils/storage.js';
import { makeT } from '../utils/i18n.js';
import { allLessons, EMPTY_CUSTOM } from '../utils/lessons.js';
import { badgeStates } from '../utils/gamify.js';
import { computeStreak, dayKey, uid } from '../utils/dates.js';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const initialPrefs = () => ({
  ...DEFAULT_PREFS,
  reducedMotion: typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
});
const mergePrefs = (fallback, stored) => ({ ...fallback, ...stored, audio: { ...fallback.audio, ...(stored.audio || {}) } });
const mergeProgress = (fallback, stored) => ({ ...fallback, ...stored });
const bump = (activity, mins) => ({ ...activity, [dayKey()]: (activity[dayKey()] || 0) + mins });
const titleCase = (s) => s.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const roleHome = (role) => (role === 'parent' ? '/parent' : role === 'teacher' ? '/teacher' : '/dashboard');

export function AppProvider({ children }) {
  const [prefs, setPrefs] = usePersistentState(KEYS.prefs, initialPrefs, mergePrefs);
  const [user, setUser] = usePersistentState(KEYS.user, null);
  const [progress, setProgress] = usePersistentState(KEYS.progress, seedProgress, mergeProgress);
  const [custom, setCustom] = usePersistentState(KEYS.custom, EMPTY_CUSTOM);
  const [toasts, setToasts] = useState([]);

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  // Load progress, prefs, and global custom lessons from Supabase
  useEffect(() => {
    let isSubscribed = true;

    async function loadInitialData() {
      try {
        // 1. Fetch Global Custom Lessons (available to everyone)
        const { data: globalLessons, error: lError } = await supabase
          .from('custom_lessons')
          .select('*');

        if (!lError && isSubscribed) {
          const { data: globalQs, error: qError } = await supabase
            .from('custom_questions')
            .select('*');

          if (!qError) {
            const formattedQs = {};
            globalQs.forEach(q => {
              formattedQs[q.lesson_id] = [...(formattedQs[q.lesson_id] || []), q];
            });
            setCustom({ lessons: globalLessons || [], questions: formattedQs });
          }
        }

        // 2. Fetch User Specific Data
        if (!user || user.demo) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from('user_progress')
          .select('progress, prefs')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Failed to fetch remote progress:', error);
          return;
        }

        if (data && isSubscribed) {
          if (data.progress) setProgress((p) => mergeProgress(p, data.progress));
          if (data.prefs) setPrefs((p) => mergePrefs(p, data.prefs));
        } else if (!data && isSubscribed) {
          await supabase.from('user_progress').insert({
            user_id: session.user.id,
            progress: progressRef.current,
            prefs: prefsRef.current,
          });
        }
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
      }
    }

    loadInitialData();
    return () => { isSubscribed = false; };
  }, [user?.email, setProgress, setPrefs, setCustom]);

  // Sync progress & prefs to Supabase when changed
  useEffect(() => {
    if (!user || user.demo) return;

    const timer = setTimeout(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        await supabase.from('user_progress').upsert({
          user_id: session.user.id,
          progress,
          prefs,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error syncing to Supabase:', err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, progress, prefs]);

  const lang = prefs.language;
  const t = useMemo(() => makeT(lang), [lang]);
  const lessons = useMemo(() => allLessons(custom), [custom]);
  const streak = useMemo(() => computeStreak(progress.activity), [progress.activity]);

  // Apply accessibility preferences to the document.
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${prefs.textSize}%`;
    root.dataset.theme = prefs.theme;
    root.lang = prefs.language;
    root.classList.toggle('reading', !!prefs.readingMode);
    root.classList.toggle('reduce-motion', !!prefs.reducedMotion);
  }, [prefs]);

  /* ───────── toasts ───────── */
  const dismissToast = useCallback((id) => setToasts((l) => l.filter((x) => x.id !== id)), []);
  const toast = useCallback((message, type = 'success') => {
    const id = uid('t');
    setToasts((l) => [...l.slice(-3), { id, message, type }]);
    window.setTimeout(() => setToasts((l) => l.filter((x) => x.id !== id)), 4200);
  }, []);

  /* ───────── preferences ───────── */
  const updatePrefs = useCallback((patch) => setPrefs((p) => ({ ...p, ...patch })), [setPrefs]);
  const updateAudio = useCallback((patch) => setPrefs((p) => ({ ...p, audio: { ...p.audio, ...patch } })), [setPrefs]);

  /* ───────── simulated auth (no real accounts; passwords are never stored) ───────── */
  const login = useCallback(async ({ email, password, role }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // In a real app, you'd fetch user profile data from your DB here
    const u = { name: data.user.email.split('@')[0], email: data.user.email, role: role || 'college' };
    setUser(u);
    return { user: u, isNew: false };
  }, [setUser]);

  const signup = useCallback(async ({ name, email, password, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } }
    });
    if (error) throw error;

    const u = { name, email, role };
    setUser(u);
    setPrefs((p) => ({ ...p, role, onboarded: false }));
    return u;
  }, [setUser, setPrefs]);

  const loginDemo = useCallback(() => {
    const u = { name: 'Priya', email: 'demo@accesslearn.example', role: 'college', demo: true };
    setUser(u);
    setPrefs((p) => ({ ...p, onboarded: true, role: 'college', stage: 'college', topics: p.onboarded ? p.topics : ['Computer Science', 'Science'] }));
    return u;
  }, [setUser, setPrefs]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [setUser]);

  /* ───────── progress actions ───────── */
  const update = useCallback((fn) => setProgress((p) => {
    const patch = fn(p);
    return patch ? { ...p, ...patch } : p;
  }), [setProgress]);

  const trackLessonView = useCallback((lessonId, language) => update((p) => ({
    recent: [{ lessonId, at: Date.now() }, ...p.recent.filter((r) => r.lessonId !== lessonId)].slice(0, 8),
    langUsed: p.langUsed.includes(language) ? p.langUsed : [...p.langUsed, language],
  })), [update]);

  const trackFormat = useCallback((lessonId, format) => update((p) => {
    const lp = p.lessonProgress[lessonId] || { formats: [] };
    if (lp.formats.includes(format)) return null;
    return {
      lessonProgress: { ...p.lessonProgress, [lessonId]: { ...lp, formats: [...lp.formats, format] } },
      xp: p.xp + 5,
      activity: bump(p.activity, 2),
    };
  }), [update]);

  const trackListen = useCallback(() => update((p) => ({ listenedCount: p.listenedCount + 1 })), [update]);

  const toggleBookmark = useCallback((id) => {
    const has = progressRef.current.bookmarks.includes(id);
    update((p) => ({ bookmarks: has ? p.bookmarks.filter((b) => b !== id) : [...p.bookmarks, id] }));
    return !has;
  }, [update]);

  const completeLesson = useCallback((id, title) => {
    if (progressRef.current.completed.includes(id)) return false;
    update((p) => ({
      completed: [...p.completed, id],
      completedAt: { ...p.completedAt, [id]: Date.now() },
      xp: p.xp + 20,
      activity: bump(p.activity, 1),
      events: [{ id: uid('e'), type: 'lesson', text: `Completed ${title}`, at: Date.now() }, ...p.events].slice(0, 40),
    }));
    return true;
  }, [update]);

  const awardPractice = useCallback((qid) => update((p) => (p.answeredQs[qid] ? null : { answeredQs: { ...p.answeredQs, [qid]: true }, xp: p.xp + 3 })), [update]);

  const recordQuiz = useCallback(({ quizId, title, items }) => {
    const total = items.length;
    const score = items.filter((i) => i.correct).length;
    const before = progressRef.current.mastery;
    const per = {};
    items.forEach((i) => {
      const g = (per[i.lessonId] ||= { c: 0, t: 0 });
      g.t += 1;
      if (i.correct) g.c += 1;
    });
    const mastery = { ...before };
    const changes = {};
    Object.entries(per).forEach(([id, g]) => {
      const old = before[id] ?? 40;
      mastery[id] = Math.round(old * 0.4 + (g.c / g.t) * 100 * 0.6);
      changes[id] = { from: old, to: mastery[id] };
    });
    update((p) => {
      const weakTags = { ...p.weakTags };
      items.filter((i) => !i.correct).forEach((i) => { weakTags[i.tag.en] = (weakTags[i.tag.en] || 0) + 1; });
      return {
        mastery,
        weakTags,
        quizResults: [...p.quizResults, { id: uid('q'), quizId, title, score, total, at: Date.now() }],
        xp: p.xp + score * 4 + (score === total ? 20 : 0),
        activity: bump(p.activity, 4),
        events: [{ id: uid('e'), type: 'quiz', text: `Scored ${score}/${total} on ${title}`, at: Date.now() }, ...p.events].slice(0, 40),
      };
    });
    return { score, total, changes };
  }, [update]);

  const addActivity = useCallback((mins) => update((p) => ({ activity: bump(p.activity, mins) })), [update]);
  const addGoal = useCallback((text) => update((p) => ({ goals: [...p.goals, { id: uid('g'), text: text.trim(), done: false }] })), [update]);
  const toggleGoal = useCallback((id) => update((p) => ({ goals: p.goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)) })), [update]);
  const removeGoal = useCallback((id) => update((p) => ({ goals: p.goals.filter((g) => g.id !== id) })), [update]);

  /* Badge watcher — toasts when locally recorded activity unlocks something new. */
  useEffect(() => {
    const fresh = badgeStates(progress).filter((b) => b.unlocked && !progress.seenBadges.includes(b.id));
    if (!fresh.length) return;
    setProgress((p) => ({
      ...p,
      seenBadges: [...new Set([...p.seenBadges, ...fresh.map((b) => b.id)])],
      events: [...fresh.map((b) => ({ id: uid('e'), type: 'badge', text: `Earned the “${b.title}” badge`, at: Date.now() })), ...p.events].slice(0, 40),
    }));
    fresh.forEach((b) => toast(`Badge unlocked: ${b.title}`, 'badge'));
  }, [progress, setProgress, toast]);

  const resetProgress = useCallback(() => setProgress(seedProgress()), [setProgress]);
  const resetEverything = useCallback(() => {
    clearAccessLearn();
    setPrefs(initialPrefs());
    setProgress(seedProgress());
    setCustom(EMPTY_CUSTOM);
    setUser(null);
  }, [setPrefs, setProgress, setCustom, setUser]);

  const value = {
    t, lang, prefs, updatePrefs, updateAudio, user, login, signup, loginDemo, logout,
    progress, streak, lessons, custom, setCustom,
    trackLessonView, trackFormat, trackListen, toggleBookmark, completeLesson, awardPractice, recordQuiz,
    addActivity, addGoal, toggleGoal, removeGoal, resetProgress, resetEverything,
    toasts, toast, dismissToast,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
