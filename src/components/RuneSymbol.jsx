import { RUNES } from '../data.js';

export default function RuneSymbol({ runeId, size = 40, active = true }) {
  const rune = RUNES[runeId];
  const c = active ? rune.color : rune.dimColor;
  const sw = Math.max(2, size / 13);

  const shapes = {
    varinor: <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="24" y1="4" x2="24" y2="76"/><line x1="5" y1="32" x2="43" y2="32"/><line x1="5" y1="50" x2="43" y2="50"/><line x1="24" y1="4" x2="8" y2="20"/><line x1="24" y1="4" x2="40" y2="20"/></g>,
    alaithi: <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,74 6,42 24,6 42,42 42,74"/><line x1="6" y1="74" x2="42" y2="74"/><line x1="24" y1="30" x2="13" y2="15"/><line x1="24" y1="30" x2="35" y2="15"/></g>,
    ydriliqi: <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="24" y1="38" x2="24" y2="76"/><line x1="24" y1="38" x2="6" y2="6"/><line x1="24" y1="38" x2="42" y2="6"/><path d="M 24,67 Q 40,67 40,52 Q 40,38 30,38"/></g>,
    oreali: <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="8" x2="30" y2="8"/><line x1="8" y1="8" x2="8" y2="76"/><path d="M 30,8 Q 45,8 45,26 Q 45,44 28,44 Q 16,44 16,34 Q 16,24 27,24"/></g>,
    thalari: <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="16" x2="44" y2="16"/><line x1="24" y1="16" x2="24" y2="76"/><line x1="12" y1="46" x2="36" y2="46"/><line x1="8" y1="76" x2="40" y2="76"/></g>,
  };

  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 48 80" style={{ display: 'block', flexShrink: 0 }}>
      {shapes[runeId]}
    </svg>
  );
}
