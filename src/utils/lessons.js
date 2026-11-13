import { LESSONS } from '../data/lessons.js';

export const EMPTY_CUSTOM = { lessons: [], questions: {} };

const paragraphs = (text = '') => text.split(/\n{2,}|\n/).map((s) => s.trim()).filter(Boolean);

/** Teacher-made lessons are English-only; this maps them to the same bilingual shape as built-ins. */
export function normalizeCustomLesson(c) {
  const body = paragraphs(c.simple);
  return {
    id: c.id,
    custom: true,
    subject: c.subject || 'General',
    stage: c.stage || 'school',
    level: c.level || 'Beginner',
    minutes: Number(c.minutes) || 5,
    visual: 'map',
    prereq: null,
    title: { en: c.title || 'Untitled lesson' },
    tagline: { en: c.subject || 'Teacher-made lesson' },
    simple: { en: body.length ? body : ['No explanation written yet.'] },
    keyPoints: { en: paragraphs(c.keyPoints).length ? paragraphs(c.keyPoints) : body.slice(0, 3) },
    example: {
      title: { en: 'Real-life example' },
      body: { en: paragraphs(c.example).length ? paragraphs(c.example) : ['No example written yet.'] },
      mapsTo: { en: [] },
    },
    questions: [],
  };
}

export function normalizeQuestion(q, lessonId) {
  return {
    id: q.id,
    lessonId,
    custom: true,
    tag: { en: q.tag || 'Teacher question' },
    prompt: { en: q.prompt },
    options: { en: q.options },
    answer: q.answer,
    explain: { en: q.explain || 'No explanation added.' },
  };
}

export function allLessons(custom = EMPTY_CUSTOM) {
  return [...LESSONS, ...(custom.lessons || []).map(normalizeCustomLesson)];
}

export const findLesson = (id, custom) => allLessons(custom).find((l) => l.id === id);

export function questionsFor(lesson, custom = EMPTY_CUSTOM) {
  if (!lesson) return [];
  const builtIn = lesson.questions.map((q) => ({ ...q, lessonId: lesson.id }));
  const extra = (custom.questions?.[lesson.id] || []).map((q) => normalizeQuestion(q, lesson.id));
  return [...builtIn, ...extra];
}

export function mixedQuestions(lessons, custom, mastery, count = 6) {
  const ranked = [...lessons]
    .map((l) => ({ l, qs: questionsFor(l, custom) }))
    .filter((x) => x.qs.length >= 2)
    .sort((a, b) => (mastery[a.l.id] ?? 50) - (mastery[b.l.id] ?? 50))
    .slice(0, 3);
  const pool = [];
  ranked.forEach(({ qs }) => {
    const shuffled = [...qs].sort(() => Math.random() - 0.5);
    pool.push(...shuffled.slice(0, 2));
  });
  return pool.slice(0, count);
}

export const stageBucket = (stage) =>
  ({ primary: 'school', middle: 'school', high: 'school', school: 'school', college: 'college', adult: 'adult' }[stage] || 'school');

export function lessonIndex(lessons, id) {
  return lessons.findIndex((l) => l.id === id);
}
