import { isHero } from '../utils.js';
import ModalShell from './ModalShell.jsx';

export default function AcolytePickModal({ activeUnits, game, setGame, onClose }) {
  const heroes = activeUnits.filter(u => isHero(u.name));
  const list = heroes.length > 0 ? heroes : activeUnits;

  return (
    <ModalShell title="Set Acolyte Hero Target" onClose={onClose}>
      <div style={{ fontSize: 14, color: '#5a4e3a', marginBottom: 4 }}>
        Pick the LUMINETH HERO who will be an additional (3rd) target for the next Depict Rune.
      </div>
      <div style={{ fontSize: 12, color: '#a89878', marginBottom: 16 }}>
        This clears automatically after the next Depict Rune is used.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {list.map(unit => {
          const sel = game.acolyteHeroId === unit.id;
          return (
            <button key={unit.id} className="lrl-btn"
              onClick={() => { setGame(g => ({ ...g, acolyteHeroId: unit.id })); onClose(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: sel ? 'rgba(122,82,10,0.08)' : '#fff', border: `1px solid ${sel ? 'rgba(122,82,10,0.3)' : '#d4c9a8'}`, borderRadius: 6, cursor: 'pointer', textAlign: 'left', minHeight: 52 }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: sel ? '#7a520a' : '#e8e0cc', border: `2px solid ${sel ? '#7a520a' : '#c4b98a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {sel && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
              </div>
              <span style={{ fontSize: 16, color: sel ? '#1a1614' : '#5a4e3a' }}>{unit.name}</span>
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}
