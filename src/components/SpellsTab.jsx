import { SPELL_LORES, HERO_SPELLS } from '../data.js';
import SpellCard from './SpellCard.jsx';

export default function SpellsTab({ selectedLores, setSelectedLores, game, roster }) {
  const toggleLore = (id) => setSelectedLores(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const relevantUnits = game
    ? roster.filter(u => game.activeUnitIds.includes(u.id))
    : roster;

  const visibleHeroSpells = HERO_SPELLS.filter(h =>
    relevantUnits.some(u => u.name.toLowerCase().includes(h.unitMatch.toLowerCase()))
  );

  const getMatchedUnit = (h) =>
    relevantUnits.find(u => u.name.toLowerCase().includes(h.unitMatch.toLowerCase()));

  return (
    <div>
      {/* Lore selection */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: '#8a7d65', textTransform: 'uppercase', marginBottom: 12 }}>Select Army Lores</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SPELL_LORES.map(lore => {
            const sel = selectedLores.includes(lore.id);
            return (
              <label key={lore.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: sel ? lore.bg : '#fff', border: `1px solid ${sel ? lore.border : '#d4c9a8'}`, borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s', minHeight: 56 }}>
                <input type="checkbox" checked={sel} onChange={() => toggleLore(lore.id)} style={{ accentColor: lore.color, width: 20, height: 20 }} />
                <div>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 15, fontWeight: 600, color: sel ? lore.color : '#1a1614' }}>{lore.name}</div>
                  {lore.cost && <div style={{ fontSize: 12, color: '#8a7d65', marginTop: 1 }}>{lore.cost} Points</div>}
                </div>
              </label>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: '#a89878', marginTop: 10 }}>Tap a spell card to expand its full Declare and Effect text.</div>
      </div>

      {selectedLores.length === 0 && visibleHeroSpells.length === 0 && (
        <div style={{ fontSize: 14, color: '#b0a080', fontStyle: 'italic', textAlign: 'center', padding: '32px 0' }}>
          Select one or more lores above to view their spells.
        </div>
      )}

      {/* Lore spells */}
      {SPELL_LORES.filter(l => selectedLores.includes(l.id)).map(lore => (
        <div key={lore.id} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${lore.border}` }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 17, fontWeight: 700, color: lore.color }}>{lore.name}</div>
            {lore.cost && <span style={{ fontSize: 11, color: lore.color, background: lore.bg, border: `1px solid ${lore.border}`, padding: '2px 9px', borderRadius: 10, fontFamily: 'Cinzel,serif', fontWeight: 600 }}>{lore.cost} pts</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lore.spells.map(spell => <SpellCard key={spell.id} spell={spell} lore={lore} />)}
          </div>
        </div>
      ))}

      {/* Hero spells */}
      {visibleHeroSpells.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #d4c9a8' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 17, fontWeight: 700, color: '#1a1614' }}>Hero Spells</div>
            <div style={{ fontSize: 12, color: '#8a7d65', fontStyle: 'italic' }}>
              {game ? `${visibleHeroSpells.length} hero${visibleHeroSpells.length !== 1 ? 'es' : ''} deployed` : 'from your roster'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {visibleHeroSpells.map(h => {
              const matched = getMatchedUnit(h);
              return (
                <div key={h.unitMatch}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, fontWeight: 600, color: h.color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: h.color, flexShrink: 0 }} />
                    {matched ? matched.name : h.unitMatch}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {h.spells.map(spell => <SpellCard key={spell.id} spell={spell} lore={h} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {roster.length === 0 && (
        <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(122,82,10,0.05)', border: '1px solid rgba(122,82,10,0.15)', borderRadius: 4, fontSize: 12, color: '#5a4e3a' }}>
          Add heroes to your Roster to see their individual spells here.
        </div>
      )}
    </div>
  );
}
