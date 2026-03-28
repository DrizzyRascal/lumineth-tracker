import { useState } from 'react';

export default function SpellCard({ spell, lore }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: '#fff', border: `1px solid ${expanded ? lore.border : '#d4c9a8'}`, borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <button onClick={() => setExpanded(e => !e)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', width: '100%', background: expanded ? lore.bg : '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{ background: lore.color, color: '#fff', fontFamily: 'Cinzel,serif', fontSize: 14, fontWeight: 700, width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {spell.castValue}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, fontWeight: 700, color: expanded ? lore.color : '#1a1614' }}>{spell.name}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
              {spell.keywords.map(k => (
                <span key={k} style={{ fontSize: 10, background: lore.bg, border: `1px solid ${lore.border}`, padding: '1px 7px', borderRadius: 8, color: lore.color, fontFamily: 'Cinzel,serif', fontWeight: 600 }}>{k}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, color: '#8a7d65', letterSpacing: '0.08em', textAlign: 'right' }}>Your Hero Phase</div>
          <span style={{ color: '#a89878', fontSize: 14 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && (
        <div style={{ padding: '14px 16px 16px', borderTop: `1px solid ${lore.border}` }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: lore.color, marginBottom: 6, fontWeight: 600 }}>Declare</div>
            <div style={{ fontSize: 14, color: '#2e2820', lineHeight: 1.65 }}>{spell.declare}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: lore.color, marginBottom: 6, fontWeight: 600 }}>Effect</div>
            <div style={{ fontSize: 14, color: '#2e2820', lineHeight: 1.65 }}>{spell.effect}</div>
          </div>
        </div>
      )}
    </div>
  );
}
