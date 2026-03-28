import { useState } from 'react';
import { isHero } from '../utils.js';

function ToggleBtn({ on, onClick, label, sub }) {
  return (
    <button className="lrl-btn" onClick={onClick} aria-pressed={on}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: on ? 'var(--bg-accent-medium)' : 'var(--bg-subtle)', border: `1px solid ${on ? 'var(--border-accent-stronger)' : 'var(--border)'}`, borderRadius: 6, cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: 6 }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: on ? 'var(--accent)' : 'var(--border-subtle)', border: `2px solid ${on ? 'var(--accent)' : 'var(--accent-dim)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {on && <span style={{ color: '#fff', fontSize: 12, lineHeight: 1 }}>✓</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, fontWeight: 600, color: on ? 'var(--accent)' : 'var(--text-secondary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>}
      </div>
    </button>
  );
}

export default function SpecialAbilitiesPanel({ game, activeUnits, setGame, openTeclisDiscs, openAcolytePick }) {
  const [open, setOpen] = useState(true);

  const sevirethDeployed  = activeUnits.some(u => u.name.includes('Sevireth'));
  const lyriorDeployed    = activeUnits.some(u => u.name.includes('Lyrior'));
  const avalenorDeployed  = activeUnits.some(u => u.name.includes('Avalenor'));
  const teclisDeployed    = activeUnits.some(u => u.name.includes('Teclis'));
  const heroUnits         = activeUnits.filter(u => isHero(u.name));
  const hasAnything       = sevirethDeployed || lyriorDeployed || avalenorDeployed || teclisDeployed || heroUnits.length > 0;

  if (!hasAnything) return null;

  const acolyteUnit = activeUnits.find(u => u.id === game.acolyteHeroId);
  const toggle = (key) => setGame(g => ({ ...g, [key]: !g[key] }));

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 6, overflow: 'hidden', boxShadow: 'var(--shadow-panel)' }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', width: '100%', background: 'var(--bg-muted)', border: 'none', cursor: 'pointer', borderBottom: open ? '1px solid var(--border-subtle)' : 'none' }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Special Abilities</div>
        <span style={{ color: 'var(--text-dim)', fontSize: 14 }} aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '14px 16px' }}>
          {/* Acolyte */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>Acolyte of the Runes — Heroic Trait</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>At Start of Battle Round, pick a friendly LUMINETH HERO within 12&quot;. That hero may be picked as an additional (3rd) target for the next Depict Rune ability.</div>
            {acolyteUnit
              ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-accent-soft)', border: '1px solid var(--border-accent-strong)', borderRadius: 6 }}>
                <span style={{ fontSize: 14, flex: 1, color: 'var(--text-primary)' }}>✦ <strong>{acolyteUnit.name}</strong> — bonus target for next Depict Rune</span>
                <button className="lrl-btn" onClick={() => setGame(g => ({ ...g, acolyteHeroId: null }))}
                  style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 12px', background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: 4, whiteSpace: 'nowrap' }}>Clear</button>
              </div>
              : <button className="lrl-btn" onClick={openAcolytePick}
                style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '11px 18px', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: 6, width: '100%' }}>
                Set Acolyte Hero Target…
              </button>
            }
          </div>

          {/* Passive auras */}
          {(sevirethDeployed || lyriorDeployed || avalenorDeployed) && (
            <>
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '14px 0' }} />
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>Passive Auras</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
                These add +1 virtual rune instance for units with matching keywords (includes the source model itself). Counts for warscroll abilities and enables enhanced effects.
              </div>
              {sevirethDeployed && <ToggleBtn on={!!game.sevirethAuraOn} onClick={() => toggle('sevirethAuraOn')} label={'Sevireth — +1 virtual Oreali'} sub={'HURAKAN units within 12" (including Sevireth himself)'} />}
              {lyriorDeployed   && <ToggleBtn on={!!game.lyriorAuraOn}   onClick={() => toggle('lyriorAuraOn')}   label={'Lyrior — +1 virtual Varinor'}  sub={'VANARI units within 12" (including Lyrior himself)'} />}
              {avalenorDeployed && <ToggleBtn on={!!game.avalenorAuraOn} onClick={() => toggle('avalenorAuraOn')} label={'Avalenor — +1 virtual Alaithi'} sub={'ALARITH units within 12" (including Avalenor himself)'} />}
            </>
          )}

          {/* Teclis Discs */}
          {teclisDeployed && (
            <>
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '14px 0' }} />
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>Teclis — Discs of the Aelementiri</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>Once Per Battle. Depict a rune on your battle scripture <em>without</em> resolving its effect — purely for scripture presence and enhanced effect conditions.</div>
              {game.teclisDiscsUsed
                ? <div style={{ fontSize: 13, color: 'var(--text-placeholder)', fontStyle: 'italic', padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>Discs of the Aelementiri — already used this battle.</div>
                : <button className="lrl-btn" onClick={openTeclisDiscs}
                  style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '11px 18px', background: 'var(--bg-accent-medium)', color: 'var(--accent)', border: '1px solid var(--border-accent-stronger)', cursor: 'pointer', borderRadius: 6, width: '100%', fontWeight: 600 }}>
                  ✦ Use Discs of the Aelementiri…
                </button>
              }
            </>
          )}
        </div>
      )}
    </div>
  );
}
