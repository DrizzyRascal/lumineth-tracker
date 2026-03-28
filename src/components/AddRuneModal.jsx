import { RUNE_ORDER, RUNES } from '../data.js';
import RuneSymbol from './RuneSymbol.jsx';
import ModalShell from './ModalShell.jsx';

export default function AddRuneModal({
  game, activeUnits, allScriptureIds,
  addStep, setAddStep,
  pendingRune, setPendingRune,
  pendingUnits, togglePendUnit,
  confirmRune, onClose,
}) {
  if (addStep === 1) return (
    <ModalShell title="Depict Rune" onClose={onClose}>
      <div style={{ fontSize: 14, color: '#5a4e3a', marginBottom: 4 }}>
        Choose a rune. Its effect lasts until end of Round {game.round}.
      </div>
      <div style={{ fontSize: 12, color: '#a89878', marginBottom: 16 }}>
        Rune stays on scripture permanently to enable enhanced effects.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RUNE_ORDER.map(runeId => {
          const rune = RUNES[runeId];
          const count = game.battleScripture.filter(e => e.runeId === runeId).length;
          const usedThisRound = game.battleScripture.some(e => e.runeId === runeId && e.round === game.round && !e.teclisOnly);
          return (
            <button key={runeId} className="lrl-rune-pick"
              onClick={() => { setPendingRune(runeId); setAddStep(2); }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: rune.bg, border: `1px solid ${rune.border}`, cursor: 'pointer', textAlign: 'left', width: '100%', borderRadius: 6, minHeight: 64 }}>
              <RuneSymbol runeId={runeId} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 15, fontWeight: 700, color: rune.color }}>{rune.name}</span>
                  <span style={{ fontSize: 12, color: '#8a7d65' }}>{rune.subtitle}</span>
                  {usedThisRound && <span style={{ fontSize: 10, color: rune.color, background: '#fff', border: `1px solid ${rune.border}`, padding: '2px 8px', fontFamily: 'Cinzel,serif', fontWeight: 600, borderRadius: 10 }}>Already this round</span>}
                  {!usedThisRound && count > 0 && <span style={{ fontSize: 10, color: '#8a7d65', background: '#f0ece0', border: '1px solid #e0d8c4', padding: '2px 8px', borderRadius: 10 }}>On scripture ×{count}</span>}
                </div>
                <div style={{ fontSize: 13, color: '#5a4e3a', marginTop: 3 }}>{rune.short}</div>
                {rune.armyWide && <div style={{ fontSize: 12, color: rune.color, marginTop: 2, fontStyle: 'italic' }}>★ Army-wide this round</div>}
              </div>
              <span style={{ color: '#a89878', fontSize: 20 }}>›</span>
            </button>
          );
        })}
      </div>
    </ModalShell>
  );

  const rune = RUNES[pendingRune];
  const acolyteUnit = activeUnits.find(u => u.id === game.acolyteHeroId);

  return (
    <ModalShell title={`${rune.name} · Assign Units`} onClose={onClose}>
      {/* Rune summary */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16, padding: 14, background: rune.bg, border: `1px solid ${rune.border}`, borderRadius: 6 }}>
        <RuneSymbol runeId={pendingRune} size={48} />
        <div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 15, fontWeight: 700, color: rune.color, marginBottom: 4 }}>{rune.name} — {rune.subtitle}</div>
          <div style={{ fontSize: 14, color: '#2e2820', lineHeight: 1.55 }}>{rune.effect}</div>
          <div style={{ fontSize: 12, color: '#8a7d65', marginTop: 5, fontStyle: 'italic' }}>Effect lasts Round {game.round} only. Rune stays on scripture.</div>
          {rune.armyWide && <div style={{ fontSize: 12, color: rune.color, marginTop: 4, fontStyle: 'italic' }}>★ Army-wide this round.</div>}
        </div>
      </div>

      {/* Enhanced effects */}
      {rune.enhanced && (
        <div style={{ marginBottom: 16, padding: '12px 14px', background: '#f5f1e8', border: '1px solid #e0d8c4', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: '#8a7d65', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Cinzel,serif' }}>Enhanced Effects</div>
          {Object.entries(rune.enhanced).map(([condId, data]) => {
            const active = allScriptureIds.has(condId);
            return (
              <div key={condId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <RuneSymbol runeId={condId} size={18} active={active} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 12, fontWeight: 700, color: active ? RUNES[condId].color : '#c4b98a' }}>{RUNES[condId].name}: </span>
                  <span style={{ fontSize: 12, color: active ? RUNES[condId].color : '#c4b98a', fontStyle: 'italic' }}>{data.short}</span>
                </div>
                {active
                  ? <span style={{ fontSize: 10, background: RUNES[condId].color, color: '#fff', padding: '2px 8px', borderRadius: 10, fontFamily: 'Cinzel,serif', fontWeight: 600, whiteSpace: 'nowrap' }}>✦ Will apply</span>
                  : <span style={{ fontSize: 10, color: '#c4b98a', whiteSpace: 'nowrap' }}>Not on scripture</span>
                }
              </div>
            );
          })}
        </div>
      )}

      {/* Unit assignment */}
      <div style={{ fontSize: 14, color: '#5a4e3a', marginBottom: 4 }}>
        Assign up to 2 units:{' '}
        <span style={{ fontSize: 13, color: '#8a7d65' }}>{pendingUnits.filter(id => id !== game.acolyteHeroId).length}/2 selected</span>
      </div>
      {acolyteUnit && (
        <div style={{ fontSize: 12, color: '#7a520a', marginBottom: 10 }}>
          ✦ {acolyteUnit.name} is available as a bonus Acolyte target (3rd slot).
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        {activeUnits.map(unit => {
          const isAcolyte = unit.id === game.acolyteHeroId;
          const sel = pendingUnits.includes(unit.id);
          const normalSelected = pendingUnits.filter(id => id !== game.acolyteHeroId);
          const disabled = !sel && !isAcolyte && normalSelected.length >= 2;
          return (
            <label key={unit.id}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', background: sel ? rune.bg : '#fff', border: `1px solid ${sel ? rune.border : isAcolyte ? 'rgba(122,82,10,0.25)' : '#d4c9a8'}`, opacity: disabled ? 0.38 : 1, cursor: disabled ? 'default' : 'pointer', borderRadius: 6, minHeight: 52 }}>
              <input type="checkbox" checked={sel} onChange={() => !disabled && togglePendUnit(unit.id)} style={{ accentColor: rune.color, width: 20, height: 20 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, color: sel ? '#1a1614' : '#5a4e3a' }}>{unit.name}</div>
                {isAcolyte && <div style={{ fontSize: 11, color: '#7a520a', fontFamily: 'Cinzel,serif', marginTop: 1 }}>✦ Acolyte bonus target</div>}
              </div>
            </label>
          );
        })}
        {activeUnits.length === 0 && <div style={{ fontSize: 14, color: '#b0a080', fontStyle: 'italic' }}>No units deployed.</div>}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="lrl-btn" onClick={() => setAddStep(1)}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', background: '#fff', color: '#5a4e3a', border: '1px solid #d4c9a8', cursor: 'pointer', borderRadius: 6 }}>
          ← Back
        </button>
        <button className="lrl-btn" onClick={confirmRune}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 24px', background: rune.color, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 6 }}>
          Depict Rune
        </button>
      </div>
    </ModalShell>
  );
}
