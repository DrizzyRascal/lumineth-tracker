import { useState } from 'react';
import { UNIT_DATA } from '../data.js';
import { getKeywords } from '../utils.js';

const UNIT_META = Object.fromEntries(UNIT_DATA.map(u => [u.name, u]));

const POINT_LIMITS = [500, 1000, 1500, 2000, 2500, 3000];

const SECTION_LABEL = {
  fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em',
  textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10,
};

function UnitButton({ unit, onClick }) {
  const isScourge = unit.scourgeOfGhyran;
  const isHero    = unit.isHero && !isScourge;

  const base = {
    fontFamily: 'Cinzel,serif', cursor: 'pointer', borderRadius: 8,
    padding: '8px 12px', border: '1px solid', textAlign: 'left',
    display: 'flex', flexDirection: 'column', gap: 2, transition: 'filter .15s, box-shadow .15s',
  };

  const style = isScourge
    ? { ...base, background: 'rgba(34,139,34,0.12)', borderColor: 'rgba(34,139,34,0.35)', color: '#2d8b3a' }
    : isHero
    ? { ...base, background: 'var(--bg-accent-faint)', borderColor: 'var(--border-accent)', color: 'var(--accent)' }
    : { ...base, background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' };

  return (
    <button className="lrl-btn" onClick={onClick} style={style}>
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>{unit.name}</span>
      <span style={{ fontSize: 11, opacity: 0.75 }}>{unit.points} pts</span>
    </button>
  );
}

export default function RosterTab({ roster, game, addUnit, deleteUnit, toggleReinforce }) {
  const [limit, setLimit] = useState(2000);

  const totalPoints = roster.reduce((sum, u) => sum + (u.reinforced ? (u.points || 0) * 2 : (u.points || 0)), 0);
  const pct         = Math.min(totalPoints / limit, 1);
  const overLimit   = totalPoints > limit;
  const atLimit     = totalPoints === limit;
  const barColor    = overLimit ? '#b84040' : atLimit ? 'var(--accent)' : 'var(--accent)';

  const heroes  = UNIT_DATA.filter(u => u.isHero && !u.scourgeOfGhyran);
  const scourge = UNIT_DATA.filter(u => u.scourgeOfGhyran);
  const units   = UNIT_DATA.filter(u => !u.isHero);

  return (
    <div>

      {/* ── Points tracker ── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 28, boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: 28, fontWeight: 700, color: overLimit ? '#b84040' : 'var(--text-primary)', lineHeight: 1 }}>
              {totalPoints}
            </span>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: 'var(--text-muted)' }}>/ </span>
            <select value={limit} onChange={e => setLimit(+e.target.value)}
              style={{ fontFamily: 'Cinzel,serif', fontSize: 13, fontWeight: 600, color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', padding: '2px 0' }}>
              {POINT_LIMITS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: 'var(--text-muted)' }}>pts</span>
          </div>
          <span style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.1em', color: overLimit ? '#b84040' : 'var(--text-muted)', textTransform: 'uppercase' }}>
            {overLimit ? `+${totalPoints - limit} over` : atLimit ? 'Exact' : `${limit - totalPoints} remaining`}
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct * 100}%`, background: barColor, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* ── Add units ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...SECTION_LABEL, marginBottom: 14 }}>Heroes</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {heroes.map(u => <UnitButton key={u.name} unit={u} onClick={() => addUnit(u)} />)}
        </div>

        <div style={{ ...SECTION_LABEL, marginBottom: 8, color: '#2d8b3a' }}>Scourge of Ghyran</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Alternate matched play variants</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {scourge.map(u => <UnitButton key={u.name} unit={u} onClick={() => addUnit(u)} />)}
        </div>

        <div style={{ ...SECTION_LABEL, marginBottom: 14 }}>Units</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {units.map(u => <UnitButton key={u.name} unit={u} onClick={() => addUnit(u)} />)}
        </div>
      </div>

      {/* ── Roster list ── */}
      <div style={{ ...SECTION_LABEL }}>
        Roster — {roster.length} unit{roster.length !== 1 ? 's' : ''}
      </div>

      {roster.length === 0
        ? <div style={{ fontSize: 14, color: 'var(--text-placeholder)', fontStyle: 'italic' }}>Your roster is empty — add units above.</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {roster.map(unit => {
            const keywords  = getKeywords(unit.name);
            const isScourge = unit.name.includes('Scourge of Ghyran');
            const meta      = UNIT_META[unit.name];
            const canReinforce = meta?.canReinforce ?? false;
            const effectivePts = unit.reinforced ? (unit.points || 0) * 2 : (unit.points || 0);
            return (
              <div key={unit.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: `1px solid ${isScourge ? 'rgba(34,139,34,0.3)' : unit.reinforced ? 'var(--border-accent)' : 'var(--border)'}`, padding: '10px 16px', borderRadius: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, color: isScourge ? '#2d8b3a' : 'var(--text-primary)', fontFamily: 'Cinzel,serif', fontWeight: 600 }}>{unit.name}</span>
                    {unit.reinforced
                      ? <span style={{ fontSize: 11, fontFamily: 'Cinzel,serif', color: 'var(--accent)', fontWeight: 600 }}>{effectivePts} pts <span style={{ opacity: 0.7 }}>(2×{unit.points})</span></span>
                      : unit.points
                      ? <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Cinzel,serif' }}>{unit.points} pts</span>
                      : null}
                    {unit.reinforced && <span style={{ fontSize: 9, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', background: 'var(--bg-accent-medium)', color: 'var(--accent)', border: '1px solid var(--border-accent)', padding: '2px 7px', borderRadius: 8, textTransform: 'uppercase' }}>Reinforced</span>}
                  </div>
                  {keywords.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                      {keywords.map(k => (
                        <span key={k} style={{ fontSize: 10, background: 'var(--bg-subtle)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 8, color: 'var(--text-secondary)', fontFamily: 'Cinzel,serif' }}>{k}</span>
                      ))}
                    </div>
                  )}
                </div>
                {canReinforce && (
                  <button className="lrl-btn" onClick={() => toggleReinforce(unit.id)}
                    style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', border: '1px solid', background: unit.reinforced ? 'var(--bg-accent-medium)' : 'transparent', color: unit.reinforced ? 'var(--accent)' : 'var(--text-muted)', borderColor: unit.reinforced ? 'var(--border-accent)' : 'var(--border-subtle)' }}>
                    {unit.reinforced ? '× Undo' : '+ Reinforce'}
                  </button>
                )}
                <button onClick={() => deleteUnit(unit.id)} aria-label={`Remove ${unit.name}`}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-dim)', cursor: 'pointer', fontSize: 22, padding: '0 6px', lineHeight: 1, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#b84040'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--accent-dim)'}>×</button>
              </div>
            );
          })}
        </div>
      }

      {game && (
        <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--bg-accent-faint)', border: '1px solid var(--border-accent-faint)', fontSize: 13, color: 'var(--text-secondary)', borderRadius: 10 }}>
          ✦ Battle in progress (Round {game.round}). Roster changes won&apos;t affect the current battle.
        </div>
      )}
    </div>
  );
}
