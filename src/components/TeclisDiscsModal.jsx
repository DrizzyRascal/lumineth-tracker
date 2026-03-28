import { useState } from 'react';
import { RUNE_ORDER, RUNES } from '../data.js';
import RuneSymbol from './RuneSymbol.jsx';
import ModalShell from './ModalShell.jsx';

export default function TeclisDiscsModal({ game, confirmTeclisDiscs, onClose }) {
  const [picked, setPicked] = useState(null);

  return (
    <ModalShell title="Discs of the Aelementiri" onClose={onClose}>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>Choose a rune to add to scripture.</div>
      <div style={{ padding: '10px 14px', background: 'var(--bg-accent-faint)', border: '1px solid var(--border-accent-faint)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.55 }}>
        <strong>Important:</strong> Do <em>not</em> resolve the Depict Rune effect. The rune is added purely for scripture presence — enabling enhanced effects for subsequent runes, but no unit buffs are applied.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
        {RUNE_ORDER.map(runeId => {
          const rune = RUNES[runeId];
          const sel = picked === runeId;
          const alreadyTeclis = game.battleScripture.some(e => e.runeId === runeId && e.teclisOnly);
          return (
            <button key={runeId} className="lrl-btn" onClick={() => setPicked(runeId)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', background: sel ? rune.bg : 'var(--bg-subtle)', border: `1px solid ${sel ? rune.border : 'var(--border)'}`, cursor: 'pointer', textAlign: 'left', width: '100%', borderRadius: 6 }}>
              <RuneSymbol runeId={runeId} size={36} active={sel} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 14, fontWeight: 700, color: sel ? rune.color : 'var(--text-secondary)' }}>{rune.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rune.subtitle}</span>
                  {alreadyTeclis && <span style={{ fontSize: 10, color: 'var(--text-dim)', background: 'var(--bg-page)', border: '1px solid var(--border-medium)', padding: '1px 7px', borderRadius: 10 }}>Already on scripture</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Scripture only — no effect resolved</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: sel ? 'var(--accent)' : 'var(--border-subtle)', border: `2px solid ${sel ? 'var(--accent)' : 'var(--accent-dim)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {sel && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="lrl-btn" onClick={onClose}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: 6 }}>
          Cancel
        </button>
        <button className="lrl-btn" onClick={() => picked && confirmTeclisDiscs(picked)} disabled={!picked}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 24px', background: picked ? 'var(--accent)' : 'var(--border)', color: picked ? '#fff' : 'var(--text-dim)', border: 'none', cursor: picked ? 'pointer' : 'default', fontWeight: 700, borderRadius: 6 }}>
          Add to Scripture
        </button>
      </div>
    </ModalShell>
  );
}
