import { LUMINETH_UNITS } from '../data.js';
import { getKeywords } from '../utils.js';

export default function RosterTab({ roster, game, newUnitName, setNewUnitName, addUnit, deleteUnit }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: '#8a7d65', textTransform: 'uppercase', marginBottom: 10 }}>Add Unit</div>
        <datalist id="lu">{LUMINETH_UNITS.map(n => <option key={n} value={n} />)}</datalist>
        <div style={{ display: 'flex', gap: 8 }}>
          <input list="lu" value={newUnitName} onChange={e => setNewUnitName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addUnit()}
            placeholder="Type or choose a unit…"
            style={{ flex: 1, padding: '13px 14px', background: '#fff', border: '1px solid #d4c9a8', color: '#1a1614', fontSize: 16, fontFamily: "'Crimson Pro',Georgia,serif", outline: 'none', borderRadius: 4 }} />
          <button className="lrl-btn" onClick={addUnit}
            style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 22px', background: '#7a520a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 4 }}>
            Add
          </button>
        </div>
        <div style={{ fontSize: 12, color: '#a89878', marginTop: 6 }}>Choose from the dropdown or type a custom name. Keywords are auto-detected for known units.</div>
      </div>

      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: '#8a7d65', textTransform: 'uppercase', marginBottom: 10 }}>
        Roster — {roster.length} unit{roster.length !== 1 ? 's' : ''}
      </div>

      {roster.length === 0
        ? <div style={{ fontSize: 14, color: '#b0a080', fontStyle: 'italic' }}>Your roster is empty.</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {roster.map(unit => {
            const keywords = getKeywords(unit.name);
            return (
              <div key={unit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #d4c9a8', padding: '12px 16px', borderRadius: 4 }}>
                <div>
                  <div style={{ fontSize: 15, color: '#1a1614' }}>{unit.name}</div>
                  {keywords.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                      {keywords.map(k => (
                        <span key={k} style={{ fontSize: 10, background: '#f0ece0', border: '1px solid #d4c9a8', padding: '1px 6px', borderRadius: 8, color: '#5a4e3a', fontFamily: 'Cinzel,serif' }}>{k}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => deleteUnit(unit.id)}
                  style={{ background: 'none', border: 'none', color: '#c4b98a', cursor: 'pointer', fontSize: 22, padding: '0 6px', lineHeight: 1, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={e => e.target.style.color = '#b84040'}
                  onMouseLeave={e => e.target.style.color = '#c4b98a'}>×</button>
              </div>
            );
          })}
        </div>
      }
      {game && (
        <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(122,82,10,0.06)', border: '1px solid rgba(122,82,10,0.2)', fontSize: 13, color: '#5a4e3a', borderRadius: 4 }}>
          ✦ Battle in progress (Round {game.round}). Roster changes won&apos;t affect the current battle.
        </div>
      )}
    </div>
  );
}
