import { BookCheck, Shapes, ListChecks, Sparkles, Bookmark, Flame, Trophy, TrendingUp, Headphones, Languages, Target, Award } from 'lucide-react';

const MAP = { BookCheck, Shapes, ListChecks, Sparkles, Bookmark, Flame, Trophy, TrendingUp, Headphones, Languages, Target };
export default function BadgeIcon({ name, className = 'h-6 w-6' }) {
  const Icon = MAP[name] || Award;
  return <Icon className={className} aria-hidden="true" />;
}
