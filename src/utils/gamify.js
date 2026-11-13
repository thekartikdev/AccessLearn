import { computeStreak } from './dates.js';

export const levelFromXp = (xp) => Math.floor(xp / 100) + 1;
export const xpIntoLevel = (xp) => xp % 100;

/** Goals that track themselves from locally recorded activity. */
export function autoGoals(progress) {
  const streak = computeStreak(progress.activity);
  const best = Math.max(0, ...progress.quizResults.map((r) => Math.round((r.score / r.total) * 100)));
  const exploredAll = Object.values(progress.lessonProgress).filter((l) => l.formats?.length >= 5).length;
  return [
    { id: 'lessons3', label: 'Complete 3 lessons', value: progress.completed.length, target: 3 },
    { id: 'streak5', label: 'Study 5 days in a row', value: streak, target: 5 },
    { id: 'quiz80', label: 'Score 80% on a quiz', value: Math.min(best, 80), target: 80, unit: '%' },
    { id: 'ways3', label: 'Explore all five ways in 3 lessons', value: exploredAll, target: 3 },
  ];
}

export const BADGES = [
  { id: 'first-lesson', icon: 'BookCheck', title: 'First lesson', desc: 'Complete your first lesson.', test: (p) => [p.completed.length, 1] },
  { id: 'many-ways', icon: 'Shapes', title: 'Many ways', desc: 'Explore all five formats in one lesson.', test: (p) => [Math.max(0, ...Object.values(p.lessonProgress).map((l) => l.formats?.length || 0)), 5] },
  { id: 'quiz-starter', icon: 'ListChecks', title: 'Quiz starter', desc: 'Finish a quiz.', test: (p) => [p.quizResults.length, 1] },
  { id: 'perfect', icon: 'Sparkles', title: 'Perfect score', desc: 'Get every question right in a quiz.', test: (p) => [p.quizResults.some((r) => r.score === r.total && r.total > 0) ? 1 : 0, 1] },
  { id: 'keeper', icon: 'Bookmark', title: 'Keeper', desc: 'Bookmark a lesson to revisit later.', test: (p) => [p.bookmarks.length, 1] },
  { id: 'streak-3', icon: 'Flame', title: 'Three-day streak', desc: 'Study three days in a row.', test: (p) => [computeStreak(p.activity), 3] },
  { id: 'streak-5', icon: 'Flame', title: 'Five-day streak', desc: 'Study five days in a row.', test: (p) => [computeStreak(p.activity), 5] },
  { id: 'triple', icon: 'Trophy', title: 'Triple', desc: 'Complete three lessons.', test: (p) => [p.completed.length, 3] },
  { id: 'comeback', icon: 'TrendingUp', title: 'Comeback', desc: 'Raise a topic 15 points above where you started.', test: (p) => [Math.max(0, ...Object.keys(p.mastery).map((k) => (p.mastery[k] ?? 0) - (p.baseline[k] ?? 0))), 15] },
  { id: 'listener', icon: 'Headphones', title: 'Good listener', desc: 'Listen to a lesson read aloud.', test: (p) => [p.listenedCount, 1] },
  { id: 'bilingual', icon: 'Languages', title: 'Bilingual learner', desc: 'Open lessons in both English and Hindi.', test: (p) => [['en', 'hi'].filter((l) => p.langUsed.includes(l)).length, 2] },
  { id: 'goal-getter', icon: 'Target', title: 'Goal getter', desc: 'Tick off one of your own goals.', test: (p) => [p.goals.filter((g) => g.done).length, 1] },
];

export function badgeStates(progress) {
  return BADGES.map((b) => {
    const [value, target] = b.test(progress);
    return { ...b, value: Math.min(value, target), target, unlocked: value >= target };
  });
}
