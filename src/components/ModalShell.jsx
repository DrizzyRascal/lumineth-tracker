export default function ModalShell({ children, title, onClose }) {
  return (
    <div
      role="dialog" aria-modal="true" aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
      <div style={{ background: 'var(--bg-modal)', border: '1px solid var(--border)', width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', borderRadius: 12, boxShadow: 'var(--shadow-modal)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, background: 'var(--bg-modal)', zIndex: 1 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} aria-label="Close"
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 28, lineHeight: 1, padding: '0 4px', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
        <div style={{ height: 'env(safe-area-inset-bottom, 16px)' }} />
      </div>
    </div>
  );
}
