import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useChartColors } from '../hooks/useChartColors.js';
import { lastDays, weekdayLabel } from '../utils/dates.js';

export function weeklyData(activity, lang) {
  return lastDays(7).map((d) => ({ day: weekdayLabel(d.date, lang), minutes: activity[d.key] || 0, today: d.offset === 0 }));
}

export default function WeeklyChart({ data, label, unit = 'min', height = 220, color }) {
  const c = useChartColors();
  const fill = color || c.primary;
  return (
    <figure>
      <div role="img" aria-label={`${label}: ${data.map((d) => `${d.day} ${d.minutes} ${unit}`).join(', ')}`} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={c.grid} strokeDasharray="3 4" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: c.text, fontSize: 13, fontWeight: 700 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: c.text, fontSize: 12 }} allowDecimals={false} />
            <Tooltip cursor={{ fill: c.grid, opacity: 0.4 }} formatter={(v) => [`${v} ${unit}`, label]} contentStyle={{ background: c.surface, border: `2px solid ${c.ink}`, borderRadius: 12, color: c.ink, fontWeight: 700 }} />
            <Bar dataKey="minutes" radius={[8, 8, 0, 0]} isAnimationActive={false}>
              {data.map((d, i) => <Cell key={i} fill={d.today ? c.example : fill} stroke={c.ink} strokeWidth={d.today ? 2 : 0} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
