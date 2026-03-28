import { getKeywords } from '../utils.js';
import ModalShell from './ModalShell.jsx';

export default function StartModal({ roster, startSel, toggleStartSel, startGame, onClose }) {
  return (
    <ModalShell title="Begin Battle" onClose={onClose}>
      <div style={{ fontSize: 15, color: '#5a4e3a', marginBottom: 16 }}>Select the units deployed in this battle.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        {roster.map(unit => {
          const sel = startSel.includes(unit.id);
          const kws = getKeywords(unit.name);
          return (
            <label key={unit.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: sel ? 'rgba(122,82,10,0.07)' : '#fff', border: `1px solid ${sel ? 'rgba(122,82,10,0.3)' : '#d4c9a8'}`, borderRadius: 6, cursor: 'pointer', minHeight: 52 }}>
              <input type="checkbox" checked={sel} onChange={() => toggleStartSel(unit.id)} style={{ accentColor: '#7a520a', width: 20, height: 20 }} />
              <div>
                <div style={{ fontSize: 16, color: sel ? '#1a1614' : '#5a4e3a' }}>{unit.name}</div>
                {kws.length > 0 && (
                  <div style={{ display: 'flex', gap: 3, marginTop: 2, flexWrap: 'wrap' }}>
                    {kws.map(k => <span key={k} style={{ fontSize: 9, background: '#f0ece0', border: '1px solid #d4c9a8', padding: '1px 5px', borderRadius: 8, color: '#5a4e3a', fontFamily: 'Cinzel,serif' }}>{k}</span>)}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#8a7d65' }}>{startSel.length} selected</span>
        <button className="lrl-btn" onClick={startGame} disabled={startSel.length === 0}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '14px 28px', background: startSel.length ? '#7a520a' : '#d4c9a8', color: startSel.length ? '#fff' : '#a89878', border: 'none', cursor: startSel.length ? 'pointer' : 'default', fontWeight: 700, borderRadius: 6 }}>
          Begin Battle
        </button>
      </div>
    </ModalShell>
  );
}
