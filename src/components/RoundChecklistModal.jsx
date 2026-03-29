import ModalShell from './ModalShell.jsx';

export default function RoundChecklistModal({ currentRound, nextRound, game, onConfirm, onClose }) {
  const hasAcolyteHero = !!game.acolyteHeroId;
  const hasAuras = game.sevirethAuraOn || game.lyriorAuraOn || game.avalenorAuraOn;
  const isFinalRound = nextRound > 5;

  return (
    <ModalShell title={isFinalRound ? 'End of Battle' : `Advance to Round ${nextRound}`} onClose={onClose}>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
        {isFinalRound
          ? 'Round 5 is complete — the battle is over. Check these reminders before ending:'
          : `Before advancing, check these reminders for Round ${nextRound}:`}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <CheckItem
          done={!hasAcolyteHero}
          label="Acolyte hero target"
          desc={hasAcolyteHero
            ? 'An Acolyte target is still set from last round — it will be cleared when advancing.'
            : 'No Acolyte target set. Remember to set one at the start of the new round if using this trait.'}
        />
        <CheckItem
          done={false}
          label="Passive aura coverage"
          desc={hasAuras
            ? 'You have passive auras active. Check your units are still within 12″ before the new round begins.'
            : 'No passive auras active.'}
          neutral={!hasAuras}
        />
        <CheckItem
          done={false}
          label="Rune effects end"
          desc={`All rune effects from Round ${currentRound} will expire. Runes remain on scripture for enhanced effects.`}
          neutral
        />
        <CheckItem
          done={false}
          label="Scripture carries forward"
          desc={`All runes already on scripture continue to enable enhanced effects in Round ${nextRound}.`}
          neutral
        />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="lrl-btn" onClick={onClose}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: 6 }}>
          Stay in Round {currentRound}
        </button>
        <button className="lrl-btn" onClick={onConfirm}
          style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 24px', background: isFinalRound ? '#c0392b' : 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 6 }}>
          {isFinalRound ? 'End Battle' : `Advance to Round ${nextRound} →`}
        </button>
      </div>
    </ModalShell>
  );
}

function CheckItem({ label, desc, done, neutral }) {
  const color = neutral ? 'var(--text-muted)' : done ? '#1e6e42' : 'var(--accent)';
  const icon = neutral ? '—' : done ? '✓' : '!';
  const bg = neutral ? 'var(--bg-subtle)' : done ? 'rgba(30,110,66,0.07)' : 'var(--bg-accent-faint)';
  const border = neutral ? 'var(--border-subtle)' : done ? 'rgba(30,110,66,0.2)' : 'var(--border-accent-faint)';

  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 14px', background: bg, border: `1px solid ${border}`, borderRadius: 6 }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, fontWeight: 700, color: color, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}
