import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDown, ArrowUp, BookPlus, CircleHelp, ClipboardList, FileText, LayoutDashboard, Pencil, Plus, Printer, Search, Trash2, Users, TriangleAlert } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../utils/supabaseClient.js';
import { Button, Card, DemoBadge, EmptyState, Field, Modal, PageHeader, Ring, Tabs } from '../components/ui.jsx';
import { useChartColors } from '../hooks/useChartColors.js';
import { CLASS_TOPICS, QUIZ_TREND, SAMPLE_CLASS, STATUS_LABEL, STUDENTS, statusOf } from '../data/demo.js';
import { normalizeQuestion, questionsFor } from '../utils/lessons.js';
import { pick } from '../utils/i18n.js';
import { esc, printHtml } from '../utils/print.js';
import { uid } from '../utils/dates.js';

const STATUS_CLS = { support: 'border-listen bg-listen-soft text-listen-deep', ontrack: 'border-simple bg-simple-soft text-simple-deep', excelling: 'border-visual bg-visual-soft text-visual-deep' };
const EMPTY_LESSON = { title: '', subject: 'Science', level: 'Beginner', minutes: 6, simple: '', keyPoints: '', example: '' };
const EMPTY_Q = { tag: '', prompt: '', options: ['', '', '', ''], answer: 0, explain: '' };

const avg = (a) => Math.round(a.reduce((s, x) => s + x, 0) / a.length);

export default function Teacher() {
  const { lang, lessons, custom, setCustom, toast } = useApp();
  const c = useChartColors();
  const [tab, setTab] = useState('overview');

  /* students table */
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'mastery', dir: 'asc' });
  const [picked, setPicked] = useState(null);

  /* lessons */
  const [lessonForm, setLessonForm] = useState(null); // {id?, ...fields}
  const [lessonErr, setLessonErr] = useState({});
  const [delLesson, setDelLesson] = useState(null);

  /* questions */
  const [quizLessonId, setQuizLessonId] = useState('recursion');
  const [qForm, setQForm] = useState(null);
  const [qErr, setQErr] = useState({});

  const classAvg = avg(STUDENTS.map((s) => s.mastery));
  const needSupport = STUDENTS.filter((s) => statusOf(s.mastery) === 'support');
  const rows = useMemo(() => {
    const r = STUDENTS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) && (filter === 'all' || statusOf(s.mastery) === filter));
    return [...r].sort((a, b) => {
      const d = sort.key === 'name' ? a.name.localeCompare(b.name) : a[sort.key] - b[sort.key];
      return sort.dir === 'asc' ? d : -d;
    });
  }, [query, filter, sort]);
  const setSortKey = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  /* ── lesson CRUD ── */
  const openLesson = (l) => {
    setLessonErr({});
    setLessonForm(l ? { id: l.id, title: l.title, subject: l.subject, level: l.level, minutes: l.minutes, simple: l.simple, keyPoints: l.keyPoints, example: l.example } : { ...EMPTY_LESSON });
  };
  const saveLesson = async () => {
    const e = {};
    if (lessonForm.title.trim().length < 3) e.title = 'Give the lesson a title (at least 3 characters).';
    if (lessonForm.simple.trim().length < 30) e.simple = 'Write a short explanation (at least 30 characters).';
    const m = Number(lessonForm.minutes);
    if (!(m >= 1 && m <= 90)) e.minutes = 'Enter minutes between 1 and 90.';
    setLessonErr(e);
    if (Object.keys(e).length) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const teacherId = session?.user?.id || null;
      const lessonId = lessonForm.id || uid('lesson');
      const item = {
        id: lessonId,
        teacher_id: teacherId,
        title: lessonForm.title.trim(),
        subject: lessonForm.subject,
        level: lessonForm.level,
        minutes: m,
        simple: lessonForm.simple,
        key_points: lessonForm.keyPoints || '',
        example: lessonForm.example || '',
      };

      const { error } = await supabase.from('custom_lessons').upsert(item);
      if (error) throw error;

      // Update local context
      const localItem = {
        id: lessonId,
        title: lessonForm.title.trim(),
        subject: lessonForm.subject,
        level: lessonForm.level,
        minutes: m,
        simple: lessonForm.simple,
        keyPoints: lessonForm.keyPoints || '',
        example: lessonForm.example || '',
        stage: 'school',
      };

      setCustom((cur) => ({
        ...cur,
        lessons: lessonForm.id ? cur.lessons.map((l) => (l.id === lessonForm.id ? { ...l, ...localItem } : l)) : [...cur.lessons, localItem],
      }));
      toast(lessonForm.id ? 'Lesson updated' : 'Lesson created and saved to Supabase!');
      setLessonForm(null);
    } catch (err) {
      console.error(err);
      toast('Failed to save lesson: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  const removeLesson = async () => {
    try {
      await supabase.from('custom_lessons').delete().eq('id', delLesson.id);
      setCustom((cur) => { const q = { ...cur.questions }; delete q[delLesson.id]; return { lessons: cur.lessons.filter((l) => l.id !== delLesson.id), questions: q }; });
      toast('Lesson deleted', 'info');
      setDelLesson(null);
    } catch (err) {
      toast('Failed to delete lesson', 'error');
    }
  };

  /* ── question CRUD ── */
  const quizLesson = lessons.find((l) => l.id === quizLessonId) || lessons[0];
  const customQs = custom.questions?.[quizLesson.id] || [];
  const builtInQs = quizLesson.questions || [];
  const openQ = (q) => { setQErr({}); setQForm(q ? { ...q } : { ...EMPTY_Q, options: [...EMPTY_Q.options] }); };
  const saveQ = async () => {
    const e = {};
    if (qForm.prompt.trim().length < 5) e.prompt = 'Write the question (at least 5 characters).';
    if (qForm.options.some((o) => !o.trim())) e.options = 'Fill in all four answer options.';
    if (new Set(qForm.options.map((o) => o.trim().toLowerCase())).size < 4 && !e.options) e.options = 'Each option should be different.';
    setQErr(e);
    if (Object.keys(e).length) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const teacherId = session?.user?.id || null;
      const qId = qForm.id || uid('cq');
      const item = {
        id: qId,
        lesson_id: quizLesson.id,
        teacher_id: teacherId,
        prompt: qForm.prompt.trim(),
        options: qForm.options.map((o) => o.trim()),
        answer: qForm.answer,
        tag: qForm.tag.trim(),
        explain: qForm.explain.trim(),
      };

      const { error } = await supabase.from('custom_questions').upsert(item);
      if (error) throw error;

      const localItem = {
        id: qId,
        lessonId: quizLesson.id,
        prompt: qForm.prompt.trim(),
        options: qForm.options.map((o) => o.trim()),
        answer: qForm.answer,
        tag: qForm.tag.trim(),
        explain: qForm.explain.trim(),
      };

      setCustom((cur) => {
        const list = cur.questions?.[quizLesson.id] || [];
        const next = qForm.id ? list.map((x) => (x.id === qForm.id ? { ...x, ...localItem } : x)) : [...list, localItem];
        return { ...cur, questions: { ...cur.questions, [quizLesson.id]: next } };
      });
      toast(qForm.id ? 'Question updated' : 'Question added to Supabase!');
      setQForm(null);
    } catch (err) {
      console.error(err);
      toast('Failed to save question: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  const removeQ = async (id) => {
    try {
      await supabase.from('custom_questions').delete().eq('id', id);
      setCustom((cur) => ({ ...cur, questions: { ...cur.questions, [quizLesson.id]: (cur.questions?.[quizLesson.id] || []).filter((x) => x.id !== id) } }));
      toast('Question deleted', 'info');
    } catch (err) {
      toast('Failed to delete question', 'error');
    }
  };

  const printReport = () => printHtml('Class report', `
    <span class="tag">Sample data, not a real class</span><h1>${esc(SAMPLE_CLASS.name)}: weekly report</h1><p class="muted">${esc(SAMPLE_CLASS.note)}</p>
    <h2>Summary</h2><p>Class average mastery ${classAvg}%. ${needSupport.length} learners may benefit from a check-in.</p>
    <h2>Topic gaps</h2>${CLASS_TOPICS.map((t) => `<div>${esc(t.topic)} · ${t.pct}%</div><div class="bar"><i style="width:${t.pct}%"></i></div>`).join('')}
    <h2>Suggested actions</h2><ul><li>Re-teach recursion using the Russian-doll example before the next quiz.</li><li>Pair a visual binary-search walkthrough with short practice.</li><li>Check in with: ${needSupport.map((s) => esc(s.name)).join(', ')}.</li></ul>`);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'lessons', label: 'Lessons', icon: BookPlus },
    { id: 'quizzes', label: 'Quizzes', icon: CircleHelp },
    { id: 'report', label: 'Report', icon: FileText },
  ];
  const tooltipStyle = { background: c.surface, border: `2px solid ${c.ink}`, borderRadius: 12, color: c.ink, fontWeight: 700 };
  const SortHead = ({ k, children }) => (
    <th scope="col" aria-sort={sort.key === k ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-3 py-2.5 text-left">
      <button type="button" onClick={() => setSortKey(k)} className="inline-flex items-center gap-1 font-bold hover:underline">{children}{sort.key === k && (sort.dir === 'asc' ? <ArrowUp className="h-4 w-4" aria-hidden="true" /> : <ArrowDown className="h-4 w-4" aria-hidden="true" />)}</button>
    </th>
  );

  return (
    <div>
      <PageHeader title="Teacher dashboard" subtitle={`${SAMPLE_CLASS.name} · ${SAMPLE_CLASS.note}`} actions={<DemoBadge>Sample class: not real student data</DemoBadge>} />
      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Teacher sections" className="mb-6" />

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="flex items-center gap-4 !p-5"><Ring value={classAvg} size={84} stroke={10} colorClass="text-visual" label={`Class average ${classAvg}%`} /><div><p className="font-extrabold">Class average</p><p className="text-sm text-muted">mastery across topics</p></div></Card>
            <Card className="!p-5"><p className="font-display text-4xl font-extrabold">{STUDENTS.length}</p><p className="font-bold text-muted">sample learners</p></Card>
            <Card className="!p-5"><p className="font-display text-4xl font-extrabold text-listen-deep">{needSupport.length}</p><p className="font-bold text-muted">may need a check-in</p></Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="text-xl font-extrabold">Topic-level learning gaps</h2>
              <p className="mb-2 text-sm text-muted">Average mastery by topic. Lower bars are where a re-teach helps most.</p>
              <div role="img" aria-label={`Topic mastery: ${CLASS_TOPICS.map((t) => `${t.topic} ${t.pct}%`).join(', ')}`} style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CLASS_TOPICS} layout="vertical" margin={{ left: 20, right: 16, top: 4, bottom: 0 }}>
                    <CartesianGrid horizontal={false} stroke={c.grid} strokeDasharray="3 4" />
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: c.text, fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="topic" width={110} tick={{ fill: c.ink, fontSize: 13, fontWeight: 700 }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: c.grid, opacity: 0.4 }} contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Mastery']} />
                    <Bar dataKey="pct" radius={[0, 8, 8, 0]} isAnimationActive={false}>{CLASS_TOPICS.map((t) => <Cell key={t.topic} fill={t.pct < 50 ? c.listen : t.pct < 70 ? c.example : c.visual} stroke={c.ink} strokeWidth={1.5} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <h2 className="text-xl font-extrabold">Quiz performance</h2>
              <p className="mb-2 text-sm text-muted">Class average score on the last six quizzes.</p>
              <div role="img" aria-label={`Quiz averages: ${QUIZ_TREND.map((q) => `${q.quiz} ${q.avg}%`).join(', ')}`} style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={QUIZ_TREND} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={c.grid} strokeDasharray="3 4" />
                    <XAxis dataKey="quiz" tick={{ fill: c.text, fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis domain={[40, 100]} unit="%" tick={{ fill: c.text, fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Class average']} />
                    <Line type="monotone" dataKey="avg" stroke={c.primary} strokeWidth={3} dot={{ r: 5, fill: c.example, stroke: c.ink, strokeWidth: 2 }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          <section aria-labelledby="t-cards">
            <h2 id="t-cards" className="mb-3 text-xl font-extrabold">Students to check in with</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...STUDENTS].sort((a, b) => a.mastery - b.mastery).slice(0, 6).map((s) => (
                <li key={s.id}><Card className="!p-4">
                  <div className="flex items-center gap-3">
                    <Ring value={s.mastery} size={60} stroke={8} colorClass={s.mastery < 50 ? 'text-listen' : s.mastery < 75 ? 'text-example' : 'text-visual'} label={`${s.name} mastery ${s.mastery}%`}><span className="text-sm">{s.mastery}</span></Ring>
                    <div className="min-w-0"><p className="truncate font-extrabold">{s.name}</p><span className={`chip !py-0 text-xs ${STATUS_CLS[statusOf(s.mastery)]}`}>{STATUS_LABEL[statusOf(s.mastery)]}</span></div>
                  </div>
                  <p className="mt-3 text-sm text-muted">Practise next: <b className="text-ink">{s.weak}</b> · active {s.last.toLowerCase()}</p>
                </Card></li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* STUDENTS */}
      {tab === 'students' && (
        <Card role="tabpanel" id="panel-students" aria-labelledby="tab-students">
          <h2 className="mb-4 text-xl font-extrabold">Sample student list</h2>
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_14rem]">
            <div><label htmlFor="st-q" className="label">Search students</label><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" /><input id="st-q" type="search" className="input !pl-10" value={query} onChange={(e) => setQuery(e.target.value)} /></div></div>
            <div><label htmlFor="st-f" className="label">Status</label><select id="st-f" className="input" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All</option><option value="support">Needs support</option><option value="ontrack">On track</option><option value="excelling">Excelling</option></select></div>
          </div>
          {rows.length === 0 ? <EmptyState icon={Search} title="No students match" /> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse">
                <caption className="sr-only">Sample students, sortable by name, mastery and quiz average</caption>
                <thead className="border-b-2 border-ink"><tr><SortHead k="name">Name</SortHead><SortHead k="mastery">Mastery</SortHead><SortHead k="quizAvg">Quiz avg</SortHead><th scope="col" className="px-3 py-2.5 text-left font-bold">Status</th><th scope="col" className="px-3 py-2.5 text-left font-bold">Last active</th><th scope="col" className="px-3 py-2.5"><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>{rows.map((s) => (
                  <tr key={s.id} className="border-b border-line">
                    <th scope="row" className="px-3 py-3 text-left font-bold">{s.name}</th>
                    <td className="px-3 py-3">{s.mastery}%</td><td className="px-3 py-3">{s.quizAvg}%</td>
                    <td className="px-3 py-3"><span className={`chip !py-0 text-xs ${STATUS_CLS[statusOf(s.mastery)]}`}>{STATUS_LABEL[statusOf(s.mastery)]}</span></td>
                    <td className="px-3 py-3 text-muted">{s.last}</td>
                    <td className="px-3 py-3 text-right"><Button size="sm" variant="secondary" onClick={() => setPicked(s)}>View</Button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* LESSONS */}
      {tab === 'lessons' && (
        <div role="tabpanel" id="panel-lessons" aria-labelledby="tab-lessons" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-xl text-muted">Lessons you create are saved in this browser and appear in the learner’s Lessons library. Teacher-made lessons are English-only in this prototype.</p>
            <Button onClick={() => openLesson(null)}><Plus className="h-4 w-4" aria-hidden="true" /> Create lesson</Button>
          </div>
          {custom.lessons.length === 0 ? (
            <EmptyState icon={BookPlus} title="No lessons created yet" action={<Button onClick={() => openLesson(null)}>Create your first lesson</Button>}>Write a short explanation and an example, and learners can open it in all five formats.</EmptyState>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {custom.lessons.map((l) => (
                <li key={l.id}><Card className="!p-5">
                  <p className="text-sm font-bold text-muted">{l.subject} · {l.level} · {l.minutes} min</p>
                  <h3 className="mt-1 text-xl font-extrabold">{l.title}</h3>
                  <p className="mt-1 line-clamp-2 text-muted">{l.simple}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" to={`/learn/${l.id}`}>Preview</Button>
                    <Button size="sm" variant="secondary" onClick={() => openLesson(l)}><Pencil className="h-4 w-4" aria-hidden="true" /> Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => setDelLesson(l)}><Trash2 className="h-4 w-4" aria-hidden="true" /> Delete</Button>
                  </div>
                </Card></li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* QUIZZES */}
      {tab === 'quizzes' && (
        <div role="tabpanel" id="panel-quizzes" aria-labelledby="tab-quizzes" className="space-y-4">
          <Card className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-[14rem] flex-1"><label htmlFor="qz-l" className="label">Lesson</label>
              <select id="qz-l" className="input" value={quizLesson.id} onChange={(e) => setQuizLessonId(e.target.value)}>{lessons.map((l) => <option key={l.id} value={l.id}>{pick(l.title, 'en')}{l.custom ? ' (teacher-made)' : ''}</option>)}</select></div>
            <Button onClick={() => openQ(null)}><Plus className="h-4 w-4" aria-hidden="true" /> Add question</Button>
          </Card>
          <p className="text-sm text-muted">New questions join this lesson’s quiz straight away. Built-in questions can be viewed but not edited.</p>
          {customQs.length + builtInQs.length === 0 && <EmptyState icon={ClipboardList} title="No questions yet" />}
          <ol className="space-y-3">
            {customQs.map((q) => { const n = normalizeQuestion(q, quizLesson.id); return (
              <li key={q.id}><Card className="!p-4 border-2 !border-practice">
                <div className="flex flex-wrap items-start justify-between gap-2"><p className="font-extrabold">{q.prompt}</p><span className="chip !py-0 text-xs border-practice bg-practice-soft text-practice-deep">Your question</span></div>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">{n.options.en.map((o, i) => <li key={i} className={`rounded-lg px-3 py-1.5 ${i === q.answer ? 'bg-visual-soft font-bold text-visual-deep' : 'bg-sunken'}`}>{String.fromCharCode(65 + i)}. {o}{i === q.answer ? ' ✓' : ''}</li>)}</ul>
                <div className="mt-3 flex gap-2"><Button size="sm" variant="secondary" onClick={() => openQ(q)}><Pencil className="h-4 w-4" aria-hidden="true" /> Edit</Button><Button size="sm" variant="danger" onClick={() => removeQ(q.id)}><Trash2 className="h-4 w-4" aria-hidden="true" /> Delete</Button></div>
              </Card></li>); })}
            {builtInQs.map((q) => (
              <li key={q.id}><Card className="!p-4"><div className="flex flex-wrap items-start justify-between gap-2"><p className="font-bold">{pick(q.prompt, 'en')}</p><span className="chip !py-0 text-xs">Built-in</span></div></Card></li>
            ))}
          </ol>
          <p className="text-sm"><Link className="font-bold text-primary underline" to={`/quiz/${quizLesson.id}`}>Try this quiz as a learner</Link> ({questionsFor(quizLesson, custom).length} questions)</p>
        </div>
      )}

      {/* REPORT */}
      {tab === 'report' && (
        <div role="tabpanel" id="panel-report" aria-labelledby="tab-report">
          <Card className="mx-auto max-w-3xl border-2 !border-ink shadow-pop">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-2xl font-extrabold">{SAMPLE_CLASS.name}: weekly report</h2><p className="text-muted">Report preview</p></div><DemoBadge>Sample data</DemoBadge></div>
            <p className="mt-4 text-lg">Class average mastery is <b>{classAvg}%</b>. <b>{needSupport.length}</b> learners may benefit from a check-in this week.</p>
            <h3 className="mb-2 mt-5 font-extrabold">Topic gaps</h3>
            <ul className="space-y-1.5">{CLASS_TOPICS.map((t) => <li key={t.topic} className="flex justify-between border-b border-line py-1.5"><span>{t.topic}</span><b>{t.pct}%</b></li>)}</ul>
            <h3 className="mb-2 mt-5 font-extrabold">Suggested actions</h3>
            <ul className="list-disc space-y-1 pl-6"><li>Re-teach recursion using the Russian-doll example before the next quiz.</li><li>Pair a visual binary-search walkthrough with short practice questions.</li><li>Check in with: {needSupport.map((s) => s.name).join(', ')}.</li></ul>
            <p className="mt-5 flex gap-2 rounded-ctl border border-dashed border-muted/60 p-3 text-sm text-muted"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />This is a demonstration. AccessLearn has no real classroom analytics or student accounts.</p>
            <Button className="mt-5" onClick={printReport}><Printer className="h-4 w-4" aria-hidden="true" /> Print or save as PDF</Button>
          </Card>
        </div>
      )}

      {/* Lesson modal */}
      <Modal open={!!lessonForm} onClose={() => setLessonForm(null)} size="lg" title={lessonForm?.id ? 'Edit lesson' : 'Create lesson'}
        footer={<><Button variant="secondary" onClick={() => setLessonForm(null)}>Cancel</Button><Button onClick={saveLesson}>{lessonForm?.id ? 'Save changes' : 'Create lesson'}</Button></>}>
        {lessonForm && (
          <div className="space-y-4">
            <Field label="Title" data-autofocus value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} error={lessonErr.title} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field as="select" label="Subject" value={lessonForm.subject} onChange={(e) => setLessonForm({ ...lessonForm, subject: e.target.value })}>{['Science', 'Mathematics', 'Computer Science', 'General'].map((s) => <option key={s}>{s}</option>)}</Field>
              <Field as="select" label="Level" value={lessonForm.level} onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}><option>Beginner</option><option>Intermediate</option></Field>
              <Field label="Minutes" type="number" min="1" max="90" value={lessonForm.minutes} onChange={(e) => setLessonForm({ ...lessonForm, minutes: e.target.value })} error={lessonErr.minutes} />
            </div>
            <Field as="textarea" rows={5} label="Simple explanation" hint="Use a new line for each paragraph." value={lessonForm.simple} onChange={(e) => setLessonForm({ ...lessonForm, simple: e.target.value })} error={lessonErr.simple} />
            <Field as="textarea" rows={3} label="Key points (optional)" hint="One per line. If empty, the first paragraphs are used." value={lessonForm.keyPoints} onChange={(e) => setLessonForm({ ...lessonForm, keyPoints: e.target.value })} />
            <Field as="textarea" rows={3} label="Real-life example (optional)" value={lessonForm.example} onChange={(e) => setLessonForm({ ...lessonForm, example: e.target.value })} />
          </div>
        )}
      </Modal>

      {/* Question modal */}
      <Modal open={!!qForm} onClose={() => setQForm(null)} size="lg" title={qForm?.id ? 'Edit question' : 'Add question'} description={`For: ${pick(quizLesson.title, 'en')}`}
        footer={<><Button variant="secondary" onClick={() => setQForm(null)}>Cancel</Button><Button onClick={saveQ}>{qForm?.id ? 'Save changes' : 'Add question'}</Button></>}>
        {qForm && (
          <div className="space-y-4">
            <Field label="Question" data-autofocus value={qForm.prompt} onChange={(e) => setQForm({ ...qForm, prompt: e.target.value })} error={qErr.prompt} />
            <fieldset>
              <legend className="label">Answer options (select the correct one)</legend>
              <div className="space-y-2">{qForm.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="correct" aria-label={`Option ${String.fromCharCode(65 + i)} is correct`} checked={qForm.answer === i} onChange={() => setQForm({ ...qForm, answer: i })} className="h-5 w-5 shrink-0 accent-primary" />
                  <input className="input" aria-label={`Option ${String.fromCharCode(65 + i)}`} value={o} onChange={(e) => setQForm({ ...qForm, options: qForm.options.map((x, j) => (j === i ? e.target.value : x)) })} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                </div>))}</div>
              {qErr.options && <p role="alert" className="mt-1 text-sm font-bold text-danger">{qErr.options}</p>}
            </fieldset>
            <Field label="Concept tag (optional)" hint="Used for targeted study recommendations, e.g. “Base case”." value={qForm.tag} onChange={(e) => setQForm({ ...qForm, tag: e.target.value })} />
            <Field as="textarea" rows={2} label="Explanation shown after answering" value={qForm.explain} onChange={(e) => setQForm({ ...qForm, explain: e.target.value })} />
          </div>
        )}
      </Modal>

      <Modal open={!!delLesson} onClose={() => setDelLesson(null)} size="sm" title="Delete this lesson?"
        footer={<><Button variant="secondary" onClick={() => setDelLesson(null)} data-autofocus>Cancel</Button><Button variant="danger" onClick={removeLesson}>Delete</Button></>}>
        <p><b>{delLesson?.title}</b> and its custom quiz questions will be removed from this browser.</p>
      </Modal>

      <Modal open={!!picked} onClose={() => setPicked(null)} size="sm" title={picked?.name || ''} description="Sample learner">
        {picked && (
          <div className="space-y-3">
            <div className="flex items-center gap-4"><Ring value={picked.mastery} size={80} stroke={10} colorClass="text-visual" label={`Mastery ${picked.mastery}%`} /><div><p className="font-bold">{STATUS_LABEL[statusOf(picked.mastery)]}</p><p className="text-sm text-muted">Quiz average {picked.quizAvg}% · active {picked.last.toLowerCase()}</p></div></div>
            <p><b>Practise next:</b> {picked.weak}</p>
            <p className="rounded-ctl border-2 border-example bg-example-soft p-3 text-sm">Suggestion: share the <b>Real-life example</b> format first, then a short Practice set.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
