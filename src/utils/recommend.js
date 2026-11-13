import { stageBucket, questionsFor } from './lessons.js';

/** Rule-based lesson recommendations from the learner's profile and local progress. */
export function recommendLessons({ lessons, prefs, progress, limit = 3 }) {
  const bucket = stageBucket(prefs.stage);
  return lessons
    .map((lesson) => {
      const done = progress.completed.includes(lesson.id);
      const mastery = progress.mastery[lesson.id] ?? 40;
      const started = (progress.lessonProgress[lesson.id]?.formats?.length || 0) > 0;
      let score = 0;
      if (lesson.stage === bucket) score += 2;
      if (prefs.topics.includes(lesson.subject)) score += 2;
      score += (100 - mastery) / 40;
      if (done) score -= 3;
      if (started && !done) score += 1.5;
      const reason = started && !done ? 'rec.continue' : mastery < 50 ? 'rec.low' : 'rec.profile';
      return { lesson, score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Local rules for what to study after a quiz.
 *  - under 60% on a lesson that has a beginner prerequisite you haven't finished → recommend the prerequisite
 *  - under 100% otherwise → revisit that lesson in another format, naming the missed concepts
 *  - everything correct → suggest the lowest-mastery lesson you haven't just practised
 */
export function quizRecommendations({ items, lessons, prefs, progress }) {
  const byLesson = {};
  items.forEach((it) => {
    const g = (byLesson[it.lessonId] ||= { correct: 0, total: 0, tags: [] });
    g.total += 1;
    if (it.correct) g.correct += 1;
    else if (!g.tags.some((t) => t.en === it.tag.en)) g.tags.push(it.tag);
  });

  const recs = [];
  const preferred = prefs.defaultFormat && prefs.defaultFormat !== 'practice' ? prefs.defaultFormat : 'visual';
  Object.entries(byLesson).forEach(([lessonId, g]) => {
    if (g.correct === g.total) return;
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;
    const pct = g.correct / g.total;
    const prereq = lesson.prereq && lessons.find((l) => l.id === lesson.prereq);
    if (pct < 0.6 && prereq && !progress.completed.includes(prereq.id)) {
      recs.push({ lessonId: prereq.id, format: 'example', kind: 'prereq', tags: g.tags });
    } else {
      recs.push({ lessonId, format: pct < 0.6 ? 'simple' : preferred, kind: 'revisit', tags: g.tags });
    }
  });

  if (!recs.length) {
    const practised = new Set(Object.keys(byLesson));
    const next = [...lessons]
      .filter((l) => !practised.has(l.id) && questionsFor(l).length)
      .sort((a, b) => (progress.mastery[a.id] ?? 40) - (progress.mastery[b.id] ?? 40))[0];
    if (next) recs.push({ lessonId: next.id, format: preferred, kind: 'next', tags: [] });
  }
  return recs.slice(0, 3);
}
