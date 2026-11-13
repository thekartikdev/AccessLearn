export const dayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function lastDays(n = 7) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push({ key: dayKey(d), date: d, offset: i });
  }
  return out;
}

export const weekdayLabel = (date, lang) =>
  date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short' });

export function computeStreak(activity = {}) {
  let streak = 0;
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  if (!(activity[dayKey(d)] > 0)) d.setDate(d.getDate() - 1); // today may not be studied yet
  while (activity[dayKey(d)] > 0) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function timeAgo(ts, lang = 'en') {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.round(diff / 60000);
  const hrs = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);
  if (lang === 'hi') {
    if (mins < 1) return 'अभी';
    if (mins < 60) return `${mins} मिनट पहले`;
    if (hrs < 24) return `${hrs} घंटे पहले`;
    return `${days} दिन पहले`;
  }
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (hrs < 24) return `${hrs} hr ago`;
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}`;
