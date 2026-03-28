export default function ModalShell({ children, title, onClose }) {
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: '#faf7f0', border: '1px solid #d4c9a8', width: '100%', maxWidth: 600, maxHeight: '88vh', overflow: 'auto', borderRadius: '12px 12px 0 0', boxShadow: '0 -4px 24px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e0d8c4', position: 'sticky', top: 0, background: '#faf7f0', zIndex: 1 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a520a', fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a89878', cursor: 'pointer', fontSize: 28, lineHeight: 1, padding: '0 4px', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
        <div style={{ height: 'env(safe-area-inset-bottom, 16px)' }} />
      </div>
    </div>
  );
}
