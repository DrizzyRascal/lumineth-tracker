import { LUMINETH_UNITS } from '../data.js';
import { getKeywords } from '../utils.js';

export default function RosterTab({ roster, game, newUnitName, setNewUnitName, addUnit, deleteUnit }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Add Unit</div>
        <datalist id="lu">{LUMINETH_UNITS.map(n => <option key={n} value={n} />)}</datalist>
        <div style={{ display: 'flex', gap: 8 }}>
          <input list="lu" value={newUnitName} onChange={e => setNewUnitName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addUnit()}
            placeholder="Type or choose a unit…"
            aria-label="Unit name"
            style={{ flex: 1, padding: '13px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 16, fontFamily: "'Crimson Pro',Georgia,serif", outline: 'none', borderRadius: 4 }} />
          <button className="lrl-btn" onClick={addUnit}
            style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 22px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 4 }}>
            Add
          </button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>Choose from the dropdown or type a custom name. Keywords are auto-detected for known units.</div>
      </div>

      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
        Roster — {roster.length} unit{roster.length !== 1 ? 's' : ''}
      </div>

      {roster.length === 0
        ? <div style={{ fontSize: 14, color: 'var(--text-placeholder)', fontStyle: 'italic' }}>Your roster is empty.</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {roster.map(unit => {
            const keywords = getKeywords(unit.name);
            return (
              <div key={unit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: 4 }}>
                <div>
                  <div style={{ fontSize: 15, color: 'var(--text-primary)' }}>{unit.name}</div>
                  {keywords.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                      {keywords.map(k => (
                        <span key={k} style={{ fontSize: 10, background: 'var(--bg-page)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 8, color: 'var(--text-secondary)', fontFamily: 'Cinzel,serif' }}>{k}</span>
                      ))}
                    </div>
                  )}
                </div>
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
        <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--bg-accent-faint)', border: '1px solid var(--border-accent-faint)', fontSize: 13, color: 'var(--text-secondary)', borderRadius: 4 }}>
          ✦ Battle in progress (Round {game.round}). Roster changes won&apos;t affect the current battle.
        </div>
      )}
    </div>
  );
}
