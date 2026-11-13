// Safe localStorage helpers — never throw, always fall back.
export const KEYS = {
  prefs: 'al.prefs',
  user: 'al.user',
  accounts: 'al.accounts',
  progress: 'al.progress',
  custom: 'al.custom',
  parent: 'al.parent',
  teacher: 'al.teacher',
  quizDraft: 'al.quizDraft',
};

export function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // private mode / quota — the app still works for the session
  }
}

export function clearAccessLearn(except = []) {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith('al.') && !except.includes(k))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
