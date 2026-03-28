import { getKeywords } from '../utils.js';
import ModalShell from './ModalShell.jsx';

export default function StartModal({ roster, startSel, toggleStartSel, startGame, onClose }) {
  return (
    <ModalShell title="Begin Battle" onClose={onClose}>
      <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>Select the units deployed in this battle.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        {roster.map(unit => {
          const sel = startSel.includes(unit.id);
          const kws = getKeywords(unit.name);
          return (
            <label key={unit.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: sel ? 'var(--bg-accent-soft)' : 'var(--bg-card)', border: `1px solid ${sel ? 'var(--border-accent-stronger)' : 'var(--border)'}`, borderRadius: 6, cursor: 'pointer', minHeight: 52 }}>
              <input type="checkbox" checked={sel} onChange={() => toggleStartSel(unit.id)} style={{ accentColor: 'var(--accent)', width: 20, height: 20 }} />
              <div>
                <div style={{ fontSize: 16, color: sel ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{unit.name}</div>
                {kws.length > 0 && (
                  <div style={{ display: 'flex', gap: 3, marginTop: 2, flexWrap: 'wrap' }}>
                    {kws.map(k => <span key={k} style={{ fontSize: 9, background: 'var(--bg-subtle)', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: 8, color: 'var(--text-secondary)', fontFamily: 'Cinzel,serif' }}>{k}</span>)}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{startSel.length} selected</span>
        <button className="lrl-btn" onClick={startGame} disabled={startSel.length === 0}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '14px 28px', background: startSel.length ? 'var(--accent)' : 'var(--border)', color: startSel.length ? '#fff' : 'var(--text-dim)', border: 'none', cursor: startSel.length ? 'pointer' : 'default', fontWeight: 700, borderRadius: 6 }}>
          Begin Battle
        </button>
      </div>
    </ModalShell>
  );
}
