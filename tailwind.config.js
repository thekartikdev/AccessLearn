const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const fmt = (n) => ({ DEFAULT: v(n), soft: v(`${n}-soft`), deep: v(`${n}-deep`) });

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        sunken: v('sunken'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        primary: { DEFAULT: v('primary'), soft: v('primary-soft'), deep: v('primary-deep'), on: v('on-primary') },
        danger: { DEFAULT: v('danger'), soft: v('danger-soft') },
        // One colour per way of learning — the product's visual system.
        simple: fmt('simple'),
        visual: fmt('visual'),
        listen: fmt('listen'),
        example: fmt('example'),
        practice: fmt('practice'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
        sans: ['"Atkinson Hyperlegible"', 'system-ui', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: { ctl: '0.75rem', card: '1.25rem', panel: '1.75rem' },
      boxShadow: {
        pop: '4px 4px 0 0 rgb(var(--ink))',
        'pop-sm': '3px 3px 0 0 rgb(var(--ink))',
        soft: '0 1px 2px rgb(var(--ink) / 0.06), 0 8px 24px -12px rgb(var(--ink) / 0.18)',
      },
      keyframes: {
        rise: { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'none' } },
        pop: { from: { opacity: 0, transform: 'scale(.96)' }, to: { opacity: 1, transform: 'none' } },
        wave: { '0%,100%': { transform: 'scaleY(.35)' }, '50%': { transform: 'scaleY(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        slide: { from: { opacity: 0, transform: 'translateX(24px)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: {
        rise: 'rise .6s cubic-bezier(.2,.7,.2,1) both',
        pop: 'pop .18s ease-out both',
        wave: 'wave 1s ease-in-out infinite',
        shimmer: 'shimmer 1.4s infinite',
        slide: 'slide .25s ease-out both',
      },
    },
  },
  plugins: [],
};
