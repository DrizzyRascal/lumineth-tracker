import { RUNES, RUNE_ORDER } from '../data.js';
import RuneSymbol from './RuneSymbol.jsx';

export default function BattleScripture({ game, activeUnits, allScriptureIds, uniqueRuneCount, removeEntry }) {
  const currentRoundIds = new Set(
    game.battleScripture.filter(e => e.round === game.round && !e.teclisOnly).map(e => e.runeId)
  );
  const virtualEntries = [];
  if (game.sevirethAuraOn)  virtualEntries.push({ runeId: 'oreali',  source: 'Sevireth' });
  if (game.lyriorAuraOn)    virtualEntries.push({ runeId: 'varinor', source: 'Lyrior' });
  if (game.avalenorAuraOn)  virtualEntries.push({ runeId: 'alaithi', source: 'Avalenor' });

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 16, marginBottom: 6, borderRadius: 6, boxShadow: 'var(--shadow-panel)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Battle Scripture</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {uniqueRuneCount >= 4 && allScriptureIds.has('thalari') && (
            <span style={{ color: 'var(--accent)', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 700 }}>✦ THALARI BONUS</span>
          )}
          <span>{uniqueRuneCount} unique</span>
        </div>
      </div>

      {/* Rune tracker row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 4, border: '1px solid var(--border-subtle)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {RUNE_ORDER.map(id => {
          const on = allScriptureIds.has(id);
          const now = currentRoundIds.has(id);
          const realCount = game.battleScripture.filter(e => e.runeId === id).length;
          const vCount = virtualEntries.filter(v => v.runeId === id).length;
          return (
            <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: on ? 1 : 0.22 }}>
              <RuneSymbol runeId={id} size={28} active={on} />
              {/* Colorblind-friendly text label */}
              <span className="lrl-rune-chip-label" style={{ color: on ? RUNES[id].color : 'var(--text-muted)' }}>{RUNES[id].name}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {realCount > 0 && <span style={{ fontSize: 9, color: RUNES[id].color, fontFamily: 'Cinzel,serif', fontWeight: 600 }}>×{realCount}</span>}
                {vCount > 0 && <span style={{ fontSize: 9, color: RUNES[id].color, fontFamily: 'Cinzel,serif', opacity: 0.6 }}>+{vCount}✦</span>}
              </div>
              {now && <span style={{ fontSize: 8, background: RUNES[id].color, color: '#fff', padding: '1px 5px', borderRadius: 8, fontFamily: 'Cinzel,serif', whiteSpace: 'nowrap' }}>THIS ROUND</span>}
            </div>
          );
        })}
        {virtualEntries.length > 0 && <div style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: 'auto', alignSelf: 'center' }}>✦ = virtual (aura)</div>}
      </div>

      {game.battleScripture.length === 0
        ? <div style={{ fontSize: 14, color: 'var(--text-placeholder)', fontStyle: 'italic' }}>No runes depicted yet.</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...game.battleScripture].reverse().map(entry => {
            const rune = RUNES[entry.runeId];
            const isNow = entry.round === game.round && !entry.teclisOnly;
            const isTeclis = !!entry.teclisOnly;
            const units = activeUnits.filter(u => entry.unitIds.includes(u.id));
            return (
              <div key={entry.id} className="lrl-entry"
                style={{ background: isNow ? rune.bg : isTeclis ? 'var(--bg-accent-faint)' : 'var(--bg-subtle)', border: `1px solid ${isNow ? rune.border : isTeclis ? 'var(--border-accent-faint)' : 'var(--border-subtle)'}`, padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 4, opacity: isNow ? 1 : 0.7 }}>
                <RuneSymbol runeId={entry.runeId} size={28} active={isNow} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Cinzel,serif', fontSize: 13, fontWeight: 700, color: isNow ? rune.color : 'var(--text-muted)' }}>{rune.name}</span>
                    {isNow && <span style={{ fontSize: 10, background: rune.color, color: '#fff', padding: '1px 8px', borderRadius: 10, fontFamily: 'Cinzel,serif', fontWeight: 600 }}>Active this round</span>}
                    {isTeclis && <span style={{ fontSize: 10, background: 'var(--bg-accent-medium)', color: 'var(--accent)', padding: '1px 8px', borderRadius: 10, fontFamily: 'Cinzel,serif', fontWeight: 600 }}>Teclis — scripture only</span>}
                    {!isNow && !isTeclis && <span style={{ fontSize: 10, background: 'var(--border-subtle)', color: 'var(--text-muted)', padding: '1px 8px', borderRadius: 10 }}>Scripture only</span>}
                    <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Rd {entry.round}</span>
                  </div>
                  {units.length > 0 && <div style={{ fontSize: 12, color: isNow ? 'var(--text-secondary)' : 'var(--text-dim)', marginTop: 3 }}>{units.map(u => u.name).join(', ')}</div>}
                  {!isNow && !isTeclis && <div style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic', marginTop: 2 }}>Enables enhanced effects for future runes</div>}
                  {isTeclis && <div style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic', marginTop: 2 }}>Enables enhanced effects — no unit buffs resolved</div>}
                </div>
                <button className="lrl-rmv" onClick={() => removeEntry(entry.id)} aria-label={`Remove ${rune.name} entry`}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px', opacity: 0, transition: 'opacity .15s', flexShrink: 0, minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
