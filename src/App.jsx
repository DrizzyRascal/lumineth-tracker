import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase.js';
import store from './store.js';
import { uid } from './utils.js';
import { RUNE_ORDER } from './data.js';
import RuneSymbol from './components/RuneSymbol.jsx';
import RosterTab from './components/RosterTab.jsx';
import SpellsTab from './components/SpellsTab.jsx';
import BattleScripture from './components/BattleScripture.jsx';
import SpecialAbilitiesPanel from './components/SpecialAbilitiesPanel.jsx';
import RulesBanner from './components/RulesBanner.jsx';
import UnitCard from './components/UnitCard.jsx';
import StartModal from './components/StartModal.jsx';
import AddRuneModal from './components/AddRuneModal.jsx';
import AcolytePickModal from './components/AcolytePickModal.jsx';
import TeclisDiscsModal from './components/TeclisDiscsModal.jsx';
import RoundChecklistModal from './components/RoundChecklistModal.jsx';
import BattleSummaryModal from './components/BattleSummaryModal.jsx';
import HeroPhaseTab from './components/HeroPhaseTab.jsx';

const VERSION = 'v1.1 · 28 Mar 2026';

// ── Button style helpers ──────────────────────────────────────────────────────
const btnPrimary   = { fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 26px', background: 'linear-gradient(135deg, var(--accent-bright), var(--accent))', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.22)' };
const btnSecondary = { fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em',  textTransform: 'uppercase', padding: '13px 20px', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: 10 };
const btnGhost     = { fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '13px 14px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', cursor: 'pointer', borderRadius: 10 };

export default function App() {
  const [tab,           setTab]           = useState('game');
  const [roster,        setRoster]        = useState([]);
  const [game,          setGame]          = useState(null);
  const [modal,         setModal]         = useState(null);
  const [startSel,      setStartSel]      = useState([]);
  const [addStep,       setAddStep]       = useState(1);
  const [pendingRune,   setPendingRune]   = useState(null);
  const [pendingUnits,  setPendingUnits]  = useState([]);
  const [expandedId,    setExpandedId]    = useState(null);
  const [selectedLores,          setSelectedLores]          = useState([]);
  const [selectedManifestations, setSelectedManifestations] = useState([]);
  const [loaded,                 setLoaded]                 = useState(false);
  const [theme,         setTheme]         = useState('light');
  const [saves,         setSaves]         = useState([]);
  const [user,          setUser]          = useState(null);
  const [cloudSyncing,  setCloudSyncing]  = useState(false);
  const importRef   = useRef(null);
  const syncEnabled = useRef(false);
  const saveTimer   = useRef(null);

  // ── Persistence ───────────────────────────────────────────────────────────
  useEffect(() => {
    const r = store.get('lrl_roster'); if (r) try { setRoster(JSON.parse(r.value)); } catch {}
    const g = store.get('lrl_game');   if (g) try { setGame(JSON.parse(g.value));   } catch {}
    const l = store.get('lrl_lores');  if (l) try { setSelectedLores(JSON.parse(l.value)); } catch {}
    const m = store.get('lrl_manif'); if (m) try { setSelectedManifestations(JSON.parse(m.value)); } catch {}
    const t = store.get('lrl_theme');  if (t) setTheme(t.value === 'dark' ? 'dark' : 'light');
    const s = store.get('lrl_saves');  if (s) try { setSaves(JSON.parse(s.value)); } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => { if (!loaded) return; store.set('lrl_roster', JSON.stringify(roster)); }, [roster, loaded]);
  useEffect(() => { if (!loaded || game === null) return; store.set('lrl_game', JSON.stringify(game)); }, [game, loaded]);
  useEffect(() => { if (!loaded) return; store.set('lrl_lores', JSON.stringify(selectedLores)); }, [selectedLores, loaded]);
  useEffect(() => { if (!loaded) return; store.set('lrl_manif', JSON.stringify(selectedManifestations)); }, [selectedManifestations, loaded]);
  useEffect(() => { if (!loaded) return; store.set('lrl_theme', theme); }, [theme, loaded]);
  useEffect(() => { if (!loaded) return; store.set('lrl_saves', JSON.stringify(saves)); }, [saves, loaded]);

  // ── Firebase auth: listen for sign-in / sign-out ──────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load cloud data — overrides localStorage if it exists
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            const d = snap.data();
            if (d.roster)                 setRoster(d.roster);
            if (d.game !== undefined)     setGame(d.game);
            if (d.selectedLores)          setSelectedLores(d.selectedLores);
            if (d.selectedManifestations) setSelectedManifestations(d.selectedManifestations);
            if (d.saves)                  setSaves(d.saves);
            if (d.theme)                  setTheme(d.theme === 'dark' ? 'dark' : 'light');
          }
          // Short delay so state setters above settle before sync starts writing
          setTimeout(() => { syncEnabled.current = true; }, 600);
        } catch (e) {
          console.error('Cloud load failed:', e);
          syncEnabled.current = true;
        }
      } else {
        setUser(null);
        syncEnabled.current = false;
      }
    });
    return () => unsub();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Debounced Firestore sync (1.5 s after last change) ───────────────────
  useEffect(() => {
    if (!loaded || !user || !syncEnabled.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        setCloudSyncing(true);
        await setDoc(doc(db, 'users', user.uid), {
          roster, game, selectedLores, selectedManifestations, saves, theme,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.error('Cloud sync failed:', e);
      } finally {
        setCloudSyncing(false);
      }
    }, 1500);
    return () => clearTimeout(saveTimer.current);
  }, [roster, game, selectedLores, selectedManifestations, saves, theme, user, loaded]);

  // ── Sign in / out ─────────────────────────────────────────────────────────
  const signIn = async () => {
    try { await signInWithPopup(auth, googleProvider); }
    catch (e) { console.error('Sign-in failed:', e); }
  };
  const signOutUser = async () => {
    syncEnabled.current = false;
    try { await fbSignOut(auth); } catch {}
    setUser(null);
  };

  // ── Theme ─────────────────────────────────────────────────────────────────
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  // ── Roster ────────────────────────────────────────────────────────────────
  const addUnit              = (unit) => setRoster(r => [...r, { id: uid(), name: unit.name, points: unit.points, reinforced: false }]);
  const deleteUnit           = (id) => setRoster(r => r.filter(u => u.id !== id));
  const toggleReinforce      = (id) => setRoster(r => r.map(u => u.id === id ? { ...u, reinforced: !u.reinforced } : u));
  const toggleManifestation  = (id) => setSelectedManifestations(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  // Exclusive toggle: only one hero can hold the Acolyte of the Runes trait
  const toggleAcolyteOfRunes = (id) => setRoster(r => r.map(u => ({ ...u, acolyteOfRunes: u.id === id ? !u.acolyteOfRunes : false })));

  // ── Game ──────────────────────────────────────────────────────────────────
  const openStartGame = () => { setStartSel(roster.map(u => u.id)); setModal('start'); };
  const startGame     = () => {
    setGame({ round: 1, activeUnitIds: startSel, battleScripture: [],
      acolyteHeroId: null, teclisDiscsUsed: false,
      sevirethAuraOn: false, lyriorAuraOn: false, avalenorAuraOn: false,
      manifestationsInBattle: [], arcaneCharges: 0 });
    setModal(null);
  };
  const openEndGame = () => setModal('battle-summary');
  const endGame     = () => { setGame(null); store.del('lrl_game'); setModal(null); };
  const openNextRound = () => setModal('round-checklist');
  const confirmNextRound = () => { setGame(g => ({ ...g, round: g.round + 1 })); setExpandedId(null); setModal(null); };
  const removeEntry = (id) => setGame(g => ({ ...g, battleScripture: g.battleScripture.filter(e => e.id !== id) }));

  // ── Undo last rune ─────────────────────────────────────────────────────────
  const undoLastRune = () => {
    setGame(g => {
      if (!g || g.battleScripture.length === 0) return g;
      const next = [...g.battleScripture];
      next.pop();
      return { ...g, battleScripture: next };
    });
  };

  // ── Depict Rune ───────────────────────────────────────────────────────────
  const openDepict = () => {
    const hasAcolyteHero = activeUnits.some(u => u.acolyteOfRunes);
    setAddStep(hasAcolyteHero ? 0 : 1);
    setPendingRune(null);
    setPendingUnits([]);
    setModal('add-rune');
  };
  // Called from step 0: records the chosen acolyte target and pre-selects them in step 2
  const setAcolyteTarget = (heroId) => {
    setGame(g => ({ ...g, acolyteHeroId: heroId }));
    setPendingUnits(heroId ? [heroId] : []);
    setAddStep(1);
  };
  const confirmRune = () => {
    if (!pendingRune) return;
    setGame(g => ({
      ...g,
      acolyteHeroId: null,
      battleScripture: [...g.battleScripture, { id: uid(), runeId: pendingRune, round: g.round, unitIds: pendingUnits }],
    }));
    setModal(null);
  };
  const confirmTeclisDiscs = (runeId) => {
    setGame(g => ({
      ...g, teclisDiscsUsed: true,
      battleScripture: [...g.battleScripture, { id: uid(), runeId, round: g.round, unitIds: [], teclisOnly: true }],
    }));
    setModal(null);
  };

  // ── Unit selection helpers ─────────────────────────────────────────────────
  const toggleStartSel = (id) => setStartSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const togglePendUnit = (id) => setPendingUnits(s => {
    if (s.includes(id)) return s.filter(x => x !== id);
    const normalSelected = s.filter(x => x !== game?.acolyteHeroId);
    const isAcolyte = id === game?.acolyteHeroId;
    if (!isAcolyte && normalSelected.length >= 2) return s;
    return [...s, id];
  });

  // ── Export / Import ────────────────────────────────────────────────────────
  const exportState = () => {
    const data = { roster, game, selectedLores, selectedManifestations, exportedAt: new Date().toISOString(), version: VERSION };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumineth-tracker-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importState = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.roster) setRoster(data.roster);
        if (data.game !== undefined) setGame(data.game);
        if (data.selectedLores) setSelectedLores(data.selectedLores);
        if (data.selectedManifestations) setSelectedManifestations(data.selectedManifestations);
      } catch { alert('Could not read file — invalid format.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Battle Saves ──────────────────────────────────────────────────────────
  const saveCurrentBattle = () => {
    if (!game) return;
    const name = `Round ${game.round} — ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    const entry = { id: uid(), name, savedAt: new Date().toISOString(), roster, game, selectedLores };
    setSaves(s => [entry, ...s]);
  };
  const loadSave = (save) => {
    if (save.roster) setRoster(save.roster);
    if (save.game !== undefined) setGame(save.game);
    if (save.selectedLores) setSelectedLores(save.selectedLores);
  };
  const deleteSave = (id) => setSaves(s => s.filter(sv => sv.id !== id));

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeUnits     = game ? roster.filter(u => game.activeUnitIds.includes(u.id)) : [];
  const allScriptureIds = game ? new Set(game.battleScripture.map(e => e.runeId)) : new Set();
  const uniqueRuneCount = allScriptureIds.size;
  const canUndo         = game && game.battleScripture.length > 0;

  return (
    <div data-theme={theme}
      style={{ fontFamily: "'Crimson Pro', Georgia, serif", background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)' }}>

      {/* ── HEADER ── */}
      <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', borderTop: '3px solid var(--accent)', boxShadow: 'var(--shadow-panel)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ paddingTop: 14, paddingBottom: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Warhammer Age of Sigmar</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {/* Export / Import */}
                <button onClick={exportState} title="Export state as JSON"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 11, fontFamily: 'Cinzel,serif', letterSpacing: '0.06em', padding: '2px 4px' }}
                  aria-label="Export state">↑ Export</button>
                <button onClick={() => importRef.current?.click()} title="Import state from JSON"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 11, fontFamily: 'Cinzel,serif', letterSpacing: '0.06em', padding: '2px 4px' }}
                  aria-label="Import state">↓ Import</button>
                <input ref={importRef} type="file" accept=".json" onChange={importState} style={{ display: 'none' }} />
                {/* Theme toggle */}
                <button onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 14, padding: '2px 4px', lineHeight: 1 }}>
                  {theme === 'light' ? '◐' : '☀'}
                </button>
                {/* Cloud sync / Auth */}
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {cloudSyncing
                      ? <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Cinzel,serif' }}>↑ Saving…</span>
                      : <span style={{ fontSize: 10, color: '#2d8b3a', fontFamily: 'Cinzel,serif' }}>☁ Saved</span>}
                    {user.photoURL && (
                      <img src={user.photoURL} alt={user.displayName ?? 'User'} referrerPolicy="no-referrer"
                        style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--border)' }} />
                    )}
                    <button onClick={signOutUser}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 10, fontFamily: 'Cinzel,serif', letterSpacing: '0.06em', padding: '2px 4px' }}>
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button onClick={signIn}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg-accent-faint)', border: '1px solid var(--border-accent)', borderRadius: 6, cursor: 'pointer', padding: '4px 9px', fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in
                  </button>
                )}
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, color: 'var(--accent-dim)', letterSpacing: '0.05em' }}>{VERSION}</div>
              </div>
            </div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 19, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em', marginTop: 1 }}>Lumineth Realm-lords</div>
          </div>
          <div style={{ display: 'flex', marginTop: 10 }}>
            {[['game', 'Battle'], ['hero-phase', 'Hero Phase'], ['spells', 'Spells'], ['roster', 'Roster']].map(([key, label]) => (
              <button key={key} className="lrl-tab" onClick={() => setTab(key)}
                aria-current={tab === key ? 'page' : undefined}
                style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 24px', background: 'transparent', border: 'none', borderBottom: tab === key ? `2px solid var(--accent)` : '2px solid transparent', color: tab === key ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', marginBottom: -1, fontWeight: tab === key ? 700 : 500, minHeight: 44, transition: 'color 0.18s, border-color 0.18s' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px', paddingBottom: 40 }}>

        {/* ROSTER TAB */}
        {tab === 'roster' && (
          <RosterTab roster={roster} game={game} addUnit={addUnit} deleteUnit={deleteUnit} toggleReinforce={toggleReinforce}
            selectedManifestations={selectedManifestations} toggleManifestation={toggleManifestation}
            toggleAcolyteOfRunes={toggleAcolyteOfRunes} />
        )}

        {/* HERO PHASE TAB */}
        {tab === 'hero-phase' && (
          <HeroPhaseTab game={game} setGame={setGame} selectedManifestations={selectedManifestations} />
        )}

        {/* SPELLS TAB */}
        {tab === 'spells' && (
          <SpellsTab selectedLores={selectedLores} setSelectedLores={setSelectedLores}
            game={game} roster={roster} />
        )}

        {/* BATTLE TAB — no active game */}
        {tab === 'game' && !game && (
          <div>
            <div style={{ textAlign: 'center', padding: '48px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-card)', maxWidth: 480, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28, opacity: 0.18 }}>
                {RUNE_ORDER.map(id => <RuneSymbol key={id} runeId={id} size={50} active />)}
              </div>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, color: 'var(--text-dim)', marginBottom: 8 }}>No Active Battle</div>
              <div style={{ fontSize: 15, color: 'var(--text-placeholder)', marginBottom: 32 }}>
                {roster.length === 0
                  ? 'Add units to your roster, then begin a battle.'
                  : 'Select your deployed units and begin tracking.'}
              </div>
              {roster.length === 0
                ? <button className="lrl-btn" onClick={() => setTab('roster')}
                  style={{ ...btnSecondary, fontSize: 12 }}>
                  Build Roster
                </button>
                : <button className="lrl-btn" onClick={openStartGame}
                  style={{ ...btnPrimary, padding: '16px 32px' }}>
                  Begin Battle
                </button>
              }
            </div>

            {/* Saved battles */}
            {saves.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Saved Battles</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {saves.map(sv => (
                    <div key={sv.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Cinzel,serif', fontWeight: 600 }}>{sv.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          {sv.roster?.length ?? 0} units · saved {new Date(sv.savedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <button className="lrl-btn" onClick={() => loadSave(sv)}
                        style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 14px', background: 'var(--bg-accent-faint)', color: 'var(--accent)', border: '1px solid var(--border-accent-faint)', cursor: 'pointer', borderRadius: 4, whiteSpace: 'nowrap' }}>
                        Load
                      </button>
                      <button onClick={() => deleteSave(sv.id)} aria-label={`Delete save: ${sv.name}`}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-dim)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px', minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#b84040'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--accent-dim)'}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BATTLE TAB — active game */}
        {tab === 'game' && game && (
          <div>
            {/* Round bar */}
            <div className="lrl-round-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.3em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Battle Round</div>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 52, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{game.round}</div>
              </div>
              <div className="lrl-round-btns" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="lrl-btn" onClick={openDepict} style={btnPrimary}>✦ Depict Rune</button>
                {canUndo && (
                  <button className="lrl-btn" onClick={undoLastRune} title="Undo last depicted rune"
                    style={{ ...btnSecondary, padding: '13px 14px' }}
                    aria-label="Undo last depicted rune">
                    ↩ Undo
                  </button>
                )}
                <button className="lrl-btn" onClick={openNextRound} style={btnSecondary}>Next Round →</button>
                <button className="lrl-btn" onClick={saveCurrentBattle} title="Save current battle state"
                  style={{ ...btnGhost, fontSize: 11 }}
                  aria-label="Save current battle">
                  ✦ Save
                </button>
                <button className="lrl-btn" onClick={openEndGame} style={btnGhost}>End</button>
              </div>
            </div>

            <BattleScripture game={game} activeUnits={activeUnits} allScriptureIds={allScriptureIds}
              uniqueRuneCount={uniqueRuneCount} removeEntry={removeEntry} />

            <SpecialAbilitiesPanel game={game} activeUnits={activeUnits} setGame={setGame}
              openTeclisDiscs={() => setModal('teclis-discs')} />

            <RulesBanner />

            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
              Unit Status — {activeUnits.length} deployed
            </div>
            <div className="lrl-unit-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {activeUnits.map(unit => (
                <UnitCard key={unit.id} unit={unit} game={game} expandedId={expandedId} setExpandedId={setExpandedId} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── MODALS ── */}
      {modal === 'start' && (
        <StartModal roster={roster} startSel={startSel} toggleStartSel={toggleStartSel}
          startGame={startGame} onClose={() => setModal(null)} />
      )}
      {modal === 'add-rune' && game && (
        <AddRuneModal game={game} activeUnits={activeUnits} allScriptureIds={allScriptureIds}
          addStep={addStep} setAddStep={setAddStep}
          pendingRune={pendingRune} setPendingRune={setPendingRune}
          pendingUnits={pendingUnits} togglePendUnit={togglePendUnit}
          setAcolyteTarget={setAcolyteTarget}
          confirmRune={confirmRune} onClose={() => setModal(null)} />
      )}
      {modal === 'teclis-discs' && game && (
        <TeclisDiscsModal game={game} confirmTeclisDiscs={confirmTeclisDiscs} onClose={() => setModal(null)} />
      )}
      {modal === 'round-checklist' && game && (
        <RoundChecklistModal
          currentRound={game.round}
          nextRound={game.round + 1}
          game={game}
          onConfirm={confirmNextRound}
          onClose={() => setModal(null)} />
      )}
      {modal === 'battle-summary' && game && (
        <BattleSummaryModal
          game={game}
          activeUnits={activeUnits}
          onConfirmEnd={endGame}
          onClose={() => setModal(null)} />
      )}
    </div>
  );
}
