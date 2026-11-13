import { BookOpenText, Shapes, Headphones, Lightbulb, ListChecks } from 'lucide-react';

// Each way of learning owns a colour. Class names are written out in full so Tailwind can see them.
export const FORMATS = [
  { id: 'simple', icon: BookOpenText, cls: { solid: 'bg-simple', soft: 'bg-simple-soft', deep: 'text-simple-deep', border: 'border-simple', text: 'text-simple' } },
  { id: 'visual', icon: Shapes, cls: { solid: 'bg-visual', soft: 'bg-visual-soft', deep: 'text-visual-deep', border: 'border-visual', text: 'text-visual' } },
  { id: 'listen', icon: Headphones, cls: { solid: 'bg-listen', soft: 'bg-listen-soft', deep: 'text-listen-deep', border: 'border-listen', text: 'text-listen' } },
  { id: 'example', icon: Lightbulb, cls: { solid: 'bg-example', soft: 'bg-example-soft', deep: 'text-example-deep', border: 'border-example', text: 'text-example' } },
  { id: 'practice', icon: ListChecks, cls: { solid: 'bg-practice', soft: 'bg-practice-soft', deep: 'text-practice-deep', border: 'border-practice', text: 'text-practice' } },
];
export const FORMAT_IDS = FORMATS.map((f) => f.id);
export const formatMeta = (id) => FORMATS.find((f) => f.id === id) || FORMATS[0];
