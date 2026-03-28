import { useState } from 'react';
import { RUNE_ORDER, RUNES } from '../data.js';
import RuneSymbol from './RuneSymbol.jsx';
import ModalShell from './ModalShell.jsx';

export default function TeclisDiscsModal({ game, confirmTeclisDiscs, onClose }) {
  const [picked, setPicked] = useState(null);

  return (
    <ModalShell title="Discs of the Aelementiri" onClose={onClose}>
      <div style={{ fontSize: 14, color: '#5a4e3a', marginBottom: 4 }}>Choose a rune to add to scripture.</div>
      <div style={{ padding: '10px 14px', background: 'rgba(122,82,10,0.06)', border: '1px solid rgba(122,82,10,0.2)', borderRadius: 6, fontSize: 12, color: '#5a4e3a', marginBottom: 16, lineHeight: 1.55 }}>
        <strong>Important:</strong> Do <em>not</em> resolve the Depict Rune effect. The rune is added purely for scripture presence — enabling enhanced effects for subsequent runes, but no unit buffs are applied.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
        {RUNE_ORDER.map(runeId => {
          const rune = RUNES[runeId];
          const sel = picked === runeId;
          const alreadyTeclis = game.battleScripture.some(e => e.runeId === runeId && e.teclisOnly);
          return (
            <button key={runeId} className="lrl-btn" onClick={() => setPicked(runeId)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', background: sel ? rune.bg : '#f9f6ef', border: `1px solid ${sel ? rune.border : '#d4c9a8'}`, cursor: 'pointer', textAlign: 'left', width: '100%', borderRadius: 6 }}>
              <RuneSymbol runeId={runeId} size={36} active={sel} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 14, fontWeight: 700, color: sel ? rune.color : '#5a4e3a' }}>{rune.name}</span>
                  <span style={{ fontSize: 12, color: '#8a7d65' }}>{rune.subtitle}</span>
                  {alreadyTeclis && <span style={{ fontSize: 10, color: '#a89878', background: '#f0ece0', border: '1px solid #e0d8c4', padding: '1px 7px', borderRadius: 10 }}>Already on scripture</span>}
                </div>
                <div style={{ fontSize: 12, color: '#8a7d65', marginTop: 2 }}>Scripture only — no effect resolved</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: sel ? '#7a520a' : '#e8e0cc', border: `2px solid ${sel ? '#7a520a' : '#c4b98a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {sel && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="lrl-btn" onClick={onClose}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', background: '#fff', color: '#5a4e3a', border: '1px solid #d4c9a8', cursor: 'pointer', borderRadius: 6 }}>
          Cancel
        </button>
        <button className="lrl-btn" onClick={() => picked && confirmTeclisDiscs(picked)} disabled={!picked}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 24px', background: picked ? '#7a520a' : '#d4c9a8', color: picked ? '#fff' : '#a89878', border: 'none', cursor: picked ? 'pointer' : 'default', fontWeight: 700, borderRadius: 6 }}>
          Add to Scripture
        </button>
      </div>
    </ModalShell>
  );
}
