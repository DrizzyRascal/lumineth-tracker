import { MANIFESTATIONS } from '../data.js';

const TIMING_ORDER = ['your', 'enemy', 'any', 'passive'];
const TIMING_LABELS = { your: 'Your Hero Phase', enemy: 'Enemy Hero Phase', any: 'Any Hero Phase', passive: 'Passive' };
const TIMING_COLORS = { your: 'var(--accent)', enemy: '#b84040', any: '#1a5c96', passive: 'var(--text-muted)' };

function Badge({ label, color }) {
  return (
    <span style={{ fontSize: 9, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '2px 7px', borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--border)',
      color: color || 'var(--text-muted)', fontWeight: 600 }}>
      {label}
    </span>
  );
}

function ArcaneChargeTracker({ charges, setCharges }) {
  const MAX = 6;
  return (
    <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-accent)', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>
          Arcane Charges
        </span>
        <span style={{ fontFamily: 'Cinzel,serif', fontSize: 18, fontWeight: 700, color: charges > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
          {charges} / {MAX}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
        {Array.from({ length: MAX }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 14, borderRadius: 4, background: i < charges ? 'var(--accent)' : 'var(--border)', transition: 'background 0.15s', boxShadow: i < charges ? '0 1px 4px rgba(29,111,165,0.3)' : 'none' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="lrl-btn" onClick={() => setCharges(c => Math.min(c + 1, MAX))}
          style={{ flex: 1, fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '11px 0', background: 'var(--bg-accent-medium)', color: 'var(--accent)', border: '1px solid var(--border-accent)', cursor: 'pointer', borderRadius: 6 }}>
          + Add
        </button>
        <button className="lrl-btn" onClick={() => setCharges(0)}
          disabled={charges === 0}
          style={{ flex: 1, fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '11px 0', background: 'transparent', color: charges === 0 ? 'var(--text-placeholder)' : 'var(--text-muted)', border: '1px solid var(--border-subtle)', cursor: charges === 0 ? 'default' : 'pointer', borderRadius: 6 }}>
          ✕ Release
        </button>
        <button className="lrl-btn" onClick={() => setCharges(c => Math.max(c - 1, 0))}
          disabled={charges === 0}
          style={{ minWidth: 44, fontFamily: 'Cinzel,serif', fontSize: 16, padding: '11px 12px', background: 'transparent', color: charges === 0 ? 'var(--text-placeholder)' : 'var(--text-muted)', border: '1px solid var(--border-subtle)', cursor: charges === 0 ? 'default' : 'pointer', borderRadius: 6 }}>
          −
        </button>
      </div>
    </div>
  );
}

function ManifestationCard({ manifestation, inBattle, onToggle, arcaneCharges, setArcaneCharges }) {
  const m = manifestation;
  return (
    <div style={{ background: inBattle ? m.bg : 'var(--bg-card)', border: `1px solid ${inBattle ? m.border : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: inBattle ? `1px solid ${m.border}` : '1px solid var(--border-subtle)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: 14, fontWeight: 700, color: inBattle ? m.color : 'var(--text-primary)' }}>{m.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Cinzel,serif' }}>{m.type} · Cast {m.castValue}+</span>
          </div>
        </div>
        <button className="lrl-btn" onClick={onToggle}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', border: '1px solid', background: inBattle ? m.bg : 'transparent', color: inBattle ? m.color : 'var(--text-muted)', borderColor: inBattle ? m.border : 'var(--border-subtle)', fontWeight: inBattle ? 700 : 400 }}>
          {inBattle ? '✓ In Battle' : '+ Deploy'}
        </button>
      </div>

      {/* Abilities (only when in battle) */}
      {inBattle && m.abilities.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {m.abilities.map(ab => (
            <div key={ab.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontFamily: 'Cinzel,serif', fontSize: 12, fontWeight: 700, color: m.color }}>{ab.name}</span>
                <Badge label={ab.timingLabel} color={TIMING_COLORS[ab.timing]} />
                {ab.keywords && ab.keywords.map(k => <Badge key={k} label={k} />)}
              </div>
              {ab.trigger && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Trigger: </span>{ab.trigger}
                </div>
              )}
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {ab.tracksArcaneCharge
                  ? <><span style={{ fontWeight: 600 }}>Effect: </span>{ab.effect.replace('the current arcane charge total', `the current arcane charge total (${arcaneCharges})`)}</>
                  : <><span style={{ fontWeight: 600 }}>Effect: </span>{ab.effect}</>
                }
              </div>
              {ab.tracksArcaneCharge && (
                <ArcaneChargeTracker charges={arcaneCharges} setCharges={setArcaneCharges} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Not in battle placeholder */}
      {inBattle && m.abilities.length === 0 && (
        <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-placeholder)', fontStyle: 'italic' }}>
          Deployed — abilities will be added in a future update.
        </div>
      )}
    </div>
  );
}

export default function HeroPhaseTab({ game, setGame, selectedManifestations }) {
  const manifestationsInBattle = game?.manifestationsInBattle ?? [];
  const arcaneCharges = game?.arcaneCharges ?? 0;
  const rosterManifestations = MANIFESTATIONS.filter(m => selectedManifestations.includes(m.id));

  const toggleManifestation = (id) => {
    if (!game) return;
    setGame(g => {
      const current = g.manifestationsInBattle ?? [];
      const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
      return { ...g, manifestationsInBattle: next, arcaneCharges: !current.includes(id) ? g.arcaneCharges ?? 0 : g.arcaneCharges ?? 0 };
    });
  };

  const setArcaneCharges = (fn) => {
    if (!game) return;
    setGame(g => ({ ...g, arcaneCharges: typeof fn === 'function' ? fn(g.arcaneCharges ?? 0) : fn }));
  };

  return (
    <div>
      {/* Manifestations section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
          Manifestations of Hysh
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          Track which manifestations are currently on the battlefield. Deploy/remove as they are summoned or banished.
        </div>

        {!game && (
          <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-placeholder)', fontStyle: 'italic', textAlign: 'center' }}>
            Start a battle to track manifestations in play.
          </div>
        )}

        {game && rosterManifestations.length === 0 && (
          <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-placeholder)', fontStyle: 'italic', textAlign: 'center' }}>
            No manifestations in your roster — toggle them on the Roster tab.
          </div>
        )}

        {game && rosterManifestations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rosterManifestations.map(m => (
              <ManifestationCard
                key={m.id}
                manifestation={m}
                inBattle={manifestationsInBattle.includes(m.id)}
                onToggle={() => toggleManifestation(m.id)}
                arcaneCharges={arcaneCharges}
                setArcaneCharges={setArcaneCharges}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hero phase abilities placeholder */}
      <div>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
          Unit Hero Phase Abilities
        </div>
        <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-placeholder)', fontStyle: 'italic', textAlign: 'center' }}>
          Unit-specific hero phase abilities coming soon — spells are tracked on the Spells tab.
        </div>
      </div>
    </div>
  );
}
