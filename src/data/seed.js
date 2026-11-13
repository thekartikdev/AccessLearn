import { dayKey } from '../utils/dates.js';
import { badgeStates } from '../utils/gamify.js';

const DAY = 86400000;

export const DEFAULT_PREFS = {
  onboarded: false,
  role: 'college',
  stage: 'college',
  language: 'en',
  accessibility: [],
  topics: ['Computer Science'],
  defaultFormat: 'simple',
  textSize: 100,
  theme: 'light',
  reducedMotion: false,
  readingMode: false,
  audio: { rate: 1, autoplay: false, highlight: true },
};

/** Illustrative starting progress so charts and cards are not empty. Replaced as the learner studies. */
export function seedProgress() {
  const now = Date.now();
  const dayAt = (offset) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - offset);
    return dayKey(d);
  };
  const mastery = { photosynthesis: 72, fractions: 58, 'binary-search': 35, 'recursion-basics': 30, recursion: 18, 'operating-systems': 44 };
  const progress = {
    version: 1,
    seeded: true,
    activity: { [dayAt(1)]: 25, [dayAt(2)]: 40, [dayAt(3)]: 15, [dayAt(5)]: 30, [dayAt(6)]: 20 },
    mastery,
    baseline: { ...mastery },
    completed: ['photosynthesis'],
    completedAt: { photosynthesis: now - 2 * DAY },
    lessonProgress: {
      photosynthesis: { formats: ['simple', 'visual', 'listen', 'example', 'practice'] },
      fractions: { formats: ['simple', 'visual'] },
    },
    recent: [
      { lessonId: 'fractions', at: now - 1 * DAY },
      { lessonId: 'photosynthesis', at: now - 2 * DAY },
    ],
    bookmarks: [],
    quizResults: [
      { id: 'seed-1', quizId: 'photosynthesis', title: 'Photosynthesis', score: 4, total: 5, at: now - 2 * DAY, seeded: true },
      { id: 'seed-2', quizId: 'fractions', title: 'Fractions', score: 3, total: 5, at: now - 4 * DAY, seeded: true },
    ],
    answeredQs: {},
    weakTags: {},
    xp: 140,
    listenedCount: 0,
    langUsed: ['en'],
    goals: [
      { id: 'g1', text: 'Understand recursion before my exam', done: false },
      { id: 'g2', text: 'Revise fractions for 15 minutes', done: false },
    ],
    events: [
      { id: 'e1', type: 'lesson', text: 'Completed Photosynthesis', at: now - 2 * DAY },
      { id: 'e2', type: 'quiz', text: 'Scored 4/5 on Photosynthesis', at: now - 2 * DAY },
      { id: 'e3', type: 'quiz', text: 'Scored 3/5 on Fractions', at: now - 4 * DAY },
    ],
    seenBadges: [],
  };
  progress.seenBadges = badgeStates(progress).filter((b) => b.unlocked).map((b) => b.id);
  return progress;
}
