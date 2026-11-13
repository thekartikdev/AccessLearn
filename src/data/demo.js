// All sample data for ParentBridge and the Teacher dashboard. None of it describes real people.

export const CHILDREN = [
  {
    id: 'aarav', name: 'Aarav', grade: 'Class 6', age: 11, color: 'bg-simple', overall: 68, lessonsThisWeek: 3, minutes: 135, streak: 5,
    week: [20, 25, 0, 30, 15, 35, 10],
    topics: [{ name: 'Reading comprehension', pct: 84 }, { name: 'Photosynthesis', pct: 72 }, { name: 'Fractions', pct: 58 }],
    strengths: ['Reads carefully and notices details', 'Keeps a steady five-day learning habit', 'Asks “why” questions during science'],
    practise: ['Comparing fractions with different denominators', 'Using science words in his own sentences'],
    recommendations: [
      'Celebrate the five-day habit. A small, specific “I noticed you kept going” goes a long way.',
      'Try the Visual summary for Fractions together. Moving the sliders is more fun than a worksheet.',
      'Ask him to explain photosynthesis to you as if you were a younger sibling.',
    ],
    activities: [
      { id: 'a1', title: 'Pizza fractions', minutes: 10, desc: 'Cut a roti or pizza into 8 pieces. Take turns saying what fraction you ate and what fraction is left.' },
      { id: 'a2', title: 'Window-sill plant', minutes: 5, desc: 'Put one plant in sunlight and one in a dark cupboard for a week. Predict, then compare.' },
      { id: 'a3', title: 'Teach it back', minutes: 10, desc: 'After a lesson, ask him to teach you one idea. You just listen and ask one curious question.' },
      { id: 'a4', title: 'Kitchen measuring', minutes: 15, desc: 'Double a recipe together and talk about halves and quarters as you measure.' },
    ],
  },
  {
    id: 'meera', name: 'Meera', grade: 'Class 9', age: 14, color: 'bg-visual', overall: 76, lessonsThisWeek: 4, minutes: 180, streak: 8,
    week: [30, 25, 20, 30, 35, 25, 15],
    topics: [{ name: 'Problem solving', pct: 82 }, { name: 'Binary search', pct: 61 }, { name: 'Operating systems', pct: 70 }],
    strengths: ['Breaks big problems into steps', 'Very consistent: eight days in a row', 'Enjoys the Listen format on the bus'],
    practise: ['Explaining her reasoning in words, not just answers', 'Tracing binary search by hand'],
    recommendations: [
      'Ask her to “think out loud” on one problem a week. Explaining is the best revision.',
      'Suggest the Practice format right after a lesson while the idea is fresh.',
      'Protect her streak without pressure: a rest day is fine.',
    ],
    activities: [
      { id: 'b1', title: 'Guess the number', minutes: 10, desc: 'Play “I am thinking of a number from 1 to 100”. Notice how halving finds it fast.' },
      { id: 'b2', title: 'Phone as a manager', minutes: 10, desc: 'Open the task manager together and talk about which apps are sharing the processor.' },
      { id: 'b3', title: 'Explain it twice', minutes: 10, desc: 'She explains one idea simply, then once with a technical word. Which was clearer?' },
      { id: 'b4', title: 'Dictionary race', minutes: 10, desc: 'Find a word in a paper dictionary in under six flips, and say how you chose each page.' },
    ],
  },
  {
    id: 'kabir', name: 'Kabir', grade: 'Class 4', age: 9, color: 'bg-listen', overall: 61, lessonsThisWeek: 2, minutes: 80, streak: 3,
    week: [10, 0, 15, 20, 0, 25, 10],
    topics: [{ name: 'Fractions (intro)', pct: 55 }, { name: 'Plants and food', pct: 68 }, { name: 'Listening and memory', pct: 78 }],
    strengths: ['Remembers stories and examples really well', 'Loves pictures and patterns', 'Enjoys being read to'],
    practise: ['Naming halves and quarters', 'Finishing a lesson in one sitting'],
    recommendations: [
      'Lean on what works: use the Listen and Real-life example formats first.',
      'Keep sessions to ten minutes. Two short sessions beat one long one at this age.',
      'Let him choose the topic. Choice builds motivation.',
    ],
    activities: [
      { id: 'c1', title: 'Share the snack', minutes: 5, desc: 'Share a snack with a sibling and say together: “half for you, half for me”.' },
      { id: 'c2', title: 'Seed in a cup', minutes: 10, desc: 'Plant a bean in a clear cup with damp cotton. Draw what you see every two days.' },
      { id: 'c3', title: 'Story of a leaf', minutes: 10, desc: 'Make up a short story about how a leaf cooks its food. Act it out.' },
    ],
  },
];

export const PARENT_GUIDES = [
  { q: 'Better questions than “What did you learn today?”', a: ['“What was the trickiest part? What did you try?”', '“Can you show me one thing you made or solved?”', '“If you were the teacher, how would you explain it?”', 'Then listen without fixing. Curiosity is more useful than correction.'] },
  { q: 'When they say “I don’t get it”', a: ['Stay calm and say: “Not yet. Let’s try it a different way.”', 'Switch format: if reading did not work, try Listen or the Visual summary.', 'Shrink the step. Ask for just the first small thing they do understand.', 'Take a break. Coming back after ten minutes often helps.'] },
  { q: 'How to read the percentages', a: ['They show practice progress, not a grade or a ranking.', 'A low number means “still growing”, and it goes up with short, regular practice.', 'Look at the trend over weeks, not one day.'] },
  { q: 'A calm routine in 15 minutes', a: ['Same time each day, same place, no screens on in the background.', 'Five minutes to warm up with a lesson, five to practise, five to say what they learned.', 'End on something they can do well.'] },
];

export const SAMPLE_CLASS = { name: 'Learning Lab B', note: 'Sample class of 12 learners', students: 12 };

export const STUDENTS = [
  { id: 's1', name: 'Isha Verma', mastery: 86, quizAvg: 88, last: 'Today', weak: 'Binary search' },
  { id: 's2', name: 'Rohan Das', mastery: 79, quizAvg: 81, last: 'Today', weak: 'Recursion' },
  { id: 's3', name: 'Fatima Sheikh', mastery: 72, quizAvg: 74, last: 'Yesterday', weak: 'Fractions' },
  { id: 's4', name: 'Arjun Nair', mastery: 64, quizAvg: 66, last: 'Yesterday', weak: 'Recursion' },
  { id: 's5', name: 'Sneha Pillai', mastery: 58, quizAvg: 60, last: '2 days ago', weak: 'Operating systems' },
  { id: 's6', name: 'Dev Malhotra', mastery: 47, quizAvg: 52, last: '3 days ago', weak: 'Binary search' },
  { id: 's7', name: 'Zoya Khan', mastery: 91, quizAvg: 93, last: 'Today', weak: 'None this week' },
  { id: 's8', name: 'Kiran Rao', mastery: 39, quizAvg: 44, last: '5 days ago', weak: 'Recursion' },
  { id: 's9', name: 'Tanvi Joshi', mastery: 68, quizAvg: 70, last: 'Today', weak: 'Fractions' },
  { id: 's10', name: 'Harsh Patel', mastery: 54, quizAvg: 55, last: '2 days ago', weak: 'Binary search' },
  { id: 's11', name: 'Lakshmi Iyer', mastery: 77, quizAvg: 80, last: 'Yesterday', weak: 'Operating systems' },
  { id: 's12', name: 'Manav Bose', mastery: 43, quizAvg: 46, last: '4 days ago', weak: 'Recursion' },
];

export const statusOf = (m) => (m < 50 ? 'support' : m >= 75 ? 'excelling' : 'ontrack');
export const STATUS_LABEL = { support: 'Needs support', ontrack: 'On track', excelling: 'Excelling' };

export const CLASS_TOPICS = [
  { topic: 'Fractions', pct: 64 }, { topic: 'Photosynthesis', pct: 78 }, { topic: 'Binary search', pct: 41 }, { topic: 'Recursion', pct: 33 }, { topic: 'Operating systems', pct: 52 },
];
export const QUIZ_TREND = [{ quiz: 'Q1', avg: 58 }, { quiz: 'Q2', avg: 61 }, { quiz: 'Q3', avg: 64 }, { quiz: 'Q4', avg: 63 }, { quiz: 'Q5', avg: 70 }, { quiz: 'Q6', avg: 72 }];
