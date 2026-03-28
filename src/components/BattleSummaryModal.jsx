import { RUNES } from '../data.js';
import RuneSymbol from './RuneSymbol.jsx';
import ModalShell from './ModalShell.jsx';

export default function BattleSummaryModal({ game, activeUnits, onConfirmEnd, onClose }) {
  const rounds = game.round;
  const scripture = game.battleScripture;

  // Group entries by round
  const byRound = [];
  for (let r = 1; r <= rounds; r++) {
    const entries = scripture.filter(e => e.round === r);
    if (entries.length > 0) byRound.push({ round: r, entries });
  }

  const totalDepicted = scripture.filter(e => !e.teclisOnly).length;
  const uniqueRunes = new Set(scripture.map(e => e.runeId)).size;

  return (
    <ModalShell title="End Battle" onClose={onClose}>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
        Are you sure you want to end the battle? This will clear all battle data.
      </div>

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatChip label="Rounds played" value={rounds} />
        <StatChip label="Runes depicted" value={totalDepicted} />
        <StatChip label="Unique runes" value={uniqueRunes} />
      </div>

      {/* Scripture log */}
      {byRound.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Battle Log</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byRound.map(({ round, entries }) => (
              <div key={round} style={{ padding: '12px 14px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 6 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Round {round}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {entries.map(entry => {
                    const rune = RUNES[entry.runeId];
                    const units = activeUnits.filter(u => entry.unitIds.includes(u.id));
                    return (
                      <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <RuneSymbol runeId={entry.runeId} size={18} active />
                        <span style={{ fontFamily: 'Cinzel,serif', fontSize: 12, fontWeight: 700, color: rune.color }}>{rune.name}</span>
                        {entry.teclisOnly
                          ? <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>scripture only (Teclis)</span>
                          : units.length > 0
                            ? <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>→ {units.map(u => u.name).join(', ')}</span>
                            : <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>no units assigned</span>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {scripture.length === 0 && (
        <div style={{ fontSize: 14, color: 'var(--text-placeholder)', fontStyle: 'italic', marginBottom: 20 }}>No runes were depicted this battle.</div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="lrl-btn" onClick={onClose}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: 6 }}>
          Continue Battle
        </button>
        <button className="lrl-btn" onClick={onConfirmEnd}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 24px', background: '#7a3020', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 6 }}>
          End Battle
        </button>
      </div>
    </ModalShell>
  );
}

function StatChip({ label, value }) {
  return (
    <div style={{ flex: 1, minWidth: 80, padding: '12px 14px', background: 'var(--bg-accent-faint)', border: '1px solid var(--border-accent-faint)', borderRadius: 6, textAlign: 'center' }}>
      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'Cinzel,serif', letterSpacing: '0.08em' }}>{label}</div>
    </div>
  );
}
