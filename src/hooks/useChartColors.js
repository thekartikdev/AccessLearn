import { useApp } from '../context/AppContext.jsx';

const PALETTES = {
  light: { primary: '#3447D9', visual: '#14A076', listen: '#F05A46', example: '#FFB81C', practice: '#8B5CF6', grid: '#D6DCEA', text: '#54607A', ink: '#111C33', surface: '#FFFFFF' },
  dark: { primary: '#788CFF', visual: '#34C998', listen: '#FF7D69', example: '#FFC846', practice: '#A882FF', grid: '#344060', text: '#A0ACC6', ink: '#ECF0FA', surface: '#161E32' },
  contrast: { primary: '#FFDD00', visual: '#50FFBE', listen: '#FF9682', example: '#FFDD00', practice: '#C8A0FF', grid: '#666666', text: '#FFFFFF', ink: '#FFFFFF', surface: '#000000' },
};

/** Recharts needs concrete colours, so resolve them from the active theme. */
export function useChartColors() {
  const { prefs } = useApp();
  return PALETTES[prefs.theme] || PALETTES.light;
}
