import { RUNES } from '../data.js';
import { getUnitBuffs, getWarscrollReminders } from '../utils.js';
import RuneSymbol from './RuneSymbol.jsx';

export default function UnitCard({ unit, game, expandedId, setExpandedId }) {
  const buffs = getUnitBuffs(unit.id, unit.name, game.battleScripture, game.round, game);
  const isExpanded = expandedId === unit.id;
  const hasBuff = buffs.length > 0;
  const reminders = getWarscrollReminders(unit.name, game.battleScripture, game);
  const hadPrev = !hasBuff && game.battleScripture.some(e => e.unitIds.includes(unit.id) && e.round < game.round && !e.teclisOnly);
  const isAcolyte = game.acolyteHeroId === unit.id;
  const interactive = hasBuff || !!reminders;

  return (
    <div className="lrl-unit-card"
      onClick={() => interactive && setExpandedId(isExpanded ? null : unit.id)}
      aria-expanded={interactive ? isExpanded : undefined}
      style={{ background: 'var(--bg-card)', border: `1px solid ${interactive ? 'var(--border)' : 'var(--border-faint)'}`, padding: 14, cursor: interactive ? 'pointer' : 'default', borderRadius: 6, boxShadow: 'var(--shadow-card)', position: 'relative' }}>

      {isAcolyte && (
        <div style={{ position: 'absolute', top: -1, right: -1, background: 'var(--accent)', color: '#fff', fontSize: 9, fontFamily: 'Cinzel,serif', padding: '2px 8px', borderRadius: '0 6px 0 6px', letterSpacing: '0.1em' }}>ACOLYTE</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: interactive ? 10 : 4 }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, fontWeight: 600, color: interactive ? 'var(--text-primary)' : 'var(--text-dim)' }}>{unit.name}</div>
        {interactive && <span style={{ fontSize: 13, color: 'var(--text-dim)' }} aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>}
      </div>

      {!hasBuff && !reminders && (
        <div style={{ fontSize: 13, color: 'var(--accent-dim)', fontStyle: 'italic' }}>{hadPrev ? 'No rune depicted this round' : 'No active buffs'}</div>
      )}

      {hasBuff && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: reminders ? 8 : 0 }}>
          {buffs.map(b => {
            const rune = RUNES[b.runeId];
            return (
              <div key={b.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: rune.bg, border: `1px solid ${rune.border}`, borderRadius: 4 }}>
                <RuneSymbol runeId={b.runeId} size={14} active />
                <span className="lrl-rune-chip-label" style={{ color: rune.color }}>{b.army && '★ '}{b.short}</span>
                {b.enhanced?.length > 0 && <span style={{ fontSize: 10, color: rune.color, opacity: 0.7 }}>+{b.enhanced.length}</span>}
              </div>
            );
          })}
        </div>
      )}

      {reminders && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {reminders.map((r, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: r.active ? 'rgba(92,58,158,0.08)' : 'var(--bg-subtle)', border: `1px solid ${r.active ? 'rgba(92,58,158,0.25)' : 'var(--border-medium)'}`, borderRadius: 4 }}>
              <RuneSymbol runeId="oreali" size={12} active={r.active} />
              <span style={{ fontSize: 11, color: r.active ? '#5c3a9e' : 'var(--text-muted)', fontFamily: 'Cinzel,serif', fontWeight: r.active ? 600 : 400 }}>{r.text}</span>
            </div>
          ))}
        </div>
      )}

      {isExpanded && interactive && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
          {buffs.map(b => {
            const rune = RUNES[b.runeId];
            return (
              <div key={b.key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <RuneSymbol runeId={b.runeId} size={22} />
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 13, fontWeight: 700, color: rune.color }}>{b.army ? `${rune.name} ★ Army-wide` : rune.name}</span>
                  {!b.army && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· Rd {b.round}</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.6, marginLeft: 22 }}>{b.effect}</div>
                {b.enhanced?.map(e => (
                  <div key={e.condId} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginLeft: 22, marginTop: 6, padding: '6px 10px', background: RUNES[e.condId].bg, borderLeft: `3px solid ${RUNES[e.condId].color}55`, borderRadius: '0 4px 4px 0' }}>
                    <span style={{ color: RUNES[e.condId].color, fontSize: 13, marginTop: 1, flexShrink: 0 }}>✦</span>
                    <div>
                      <span style={{ fontFamily: 'Cinzel,serif', fontSize: 12, fontWeight: 700, color: RUNES[e.condId].color }}>{e.condName}{e.virtual ? ' (aura)' : ''}: </span>
                      <span style={{ fontSize: 12, color: RUNES[e.condId].color, fontStyle: 'italic' }}>{e.full}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic', borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>Effects last until end of Round {game.round}.</div>
        </div>
      )}
    </div>
  );
}
