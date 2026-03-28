export default function RulesBanner() {
  return (
    <div style={{ marginBottom: 20, padding: '10px 14px', background: 'var(--bg-accent-faint)', border: '1px solid var(--border-accent-faint)', borderRadius: 4, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
      <span style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, color: 'var(--accent)' }}>How runes work: </span>
      A rune&apos;s <strong>effect</strong> lasts this round only. The <strong>rune</strong> stays on your scripture permanently, enabling enhanced effects for future runes. Virtual instances (✦) from passive auras count for warscroll abilities and enhanced effects.
    </div>
  );
}
