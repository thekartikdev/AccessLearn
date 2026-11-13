import { GraduationCap, School, UserRound, HeartHandshake, BookUser, Type, Volume2, Eye, BookOpenCheck, Contrast, Languages as LangIcon } from 'lucide-react';

export const ROLES = [
  { id: 'school', label: 'School student', desc: 'Learning at primary, middle or high school', icon: School, stage: 'high' },
  { id: 'college', label: 'College student', desc: 'College or university courses', icon: GraduationCap, stage: 'college' },
  { id: 'adult', label: 'Adult learner', desc: 'Picking up new skills at any age', icon: UserRound, stage: 'adult' },
  { id: 'parent', label: 'Parent or guardian', desc: 'Supporting a child’s learning at home', icon: HeartHandshake, stage: 'school' },
  { id: 'teacher', label: 'Teacher or tutor', desc: 'Creating lessons and tracking a class', icon: BookUser, stage: 'school' },
];

export const STAGES = [
  { id: 'primary', label: 'Primary school', hint: 'Classes 1 to 5' },
  { id: 'middle', label: 'Middle school', hint: 'Classes 6 to 8' },
  { id: 'high', label: 'High school', hint: 'Classes 9 to 12' },
  { id: 'college', label: 'College or university', hint: 'Degree and diploma courses' },
  { id: 'adult', label: 'Adult or lifelong learner', hint: 'Skills, careers and curiosity' },
];

export const ACCESS_OPTIONS = [
  { id: 'largeText', label: 'Larger text', desc: 'Starts lessons at 130% text size', icon: Type },
  { id: 'audio', label: 'Audio support', desc: 'Prefer listening and start audio automatically', icon: Volume2 },
  { id: 'reducedMotion', label: 'Reduced motion', desc: 'Fewer animations and no smooth scrolling', icon: Eye },
  { id: 'highContrast', label: 'High contrast', desc: 'Black background, strong outlines, bright accents', icon: Contrast },
  { id: 'readingMode', label: 'Reading-friendly mode', desc: 'Lexend font, wider spacing, calmer background', icon: BookOpenCheck },
  { id: 'simpleLanguage', label: 'Simple language first', desc: 'Open the simple explanation by default', icon: LangIcon },
];

export const FORMAT_OPTIONS = [
  { id: 'simple', label: 'Simple explanation', desc: 'Short, plain-language text' },
  { id: 'visual', label: 'Visual summary', desc: 'Diagrams you can explore' },
  { id: 'listen', label: 'Listen', desc: 'Have it read aloud to you' },
  { id: 'example', label: 'Real-life example', desc: 'An everyday comparison' },
  { id: 'practice', label: 'Practice', desc: 'Learn by answering questions' },
];
