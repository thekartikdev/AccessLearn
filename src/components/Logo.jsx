import { Link } from 'react-router-dom';

const BARS = [
  { x: 4.2, y: 14, h: 8, c: '#788CFF' },
  { x: 9.8, y: 9, h: 18, c: '#34C998' },
  { x: 15.4, y: 5, h: 22, c: '#FF7D69' },
  { x: 21, y: 9, h: 18, c: '#FFC846' },
  { x: 26.6, y: 14, h: 8, c: '#A882FF' },
];

/** Five bars, five ways of learning: one for each format colour. */
export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34.4 32" role="img" aria-label="AccessLearn logo" className="shrink-0 rounded-[10px] bg-[#111C33] p-[3px] ring-1 ring-line">
      {BARS.map((b) => (
        <rect key={b.x} x={b.x - 1.2} y={b.y} width="3.6" height={b.h} rx="1.8" fill={b.c} />
      ))}
    </svg>
  );
}

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="AccessLearn home">
      <LogoMark />
      <span className="font-display text-xl font-extrabold tracking-tight">AccessLearn</span>
    </Link>
  );
}
