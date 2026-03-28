import { useState, useEffect } from 'react';
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

const VERSION = '28 Mar 2026, 16:58 UTC';

export default function App() {
  const [tab,           setTab]           = useState('game');
  const [roster,        setRoster]        = useState([]);
  const [game,          setGame]          = useState(null);
  const [modal,         setModal]         = useState(null);
  const [newUnitName,   setNewUnitName]   = useState('');
  const [startSel,      setStartSel]      = useState([]);
  const [addStep,       setAddStep]       = useState(1);
  const [pendingRune,   setPendingRune]   = useState(null);
  const [pendingUnits,  setPendingUnits]  = useState([]);
  const [expandedId,    setExpandedId]    = useState(null);
  const [selectedLores, setSelectedLores] = useState([]);
  const [loaded,        setLoaded]        = useState(false);

  // ── Persistence ───────────────────────────────────────────────────────────
  useEffect(() => {
    const r = store.get('lrl_roster'); if (r) try { setRoster(JSON.parse(r.value)); } catch {}
    const g = store.get('lrl_game');   if (g) try { setGame(JSON.parse(g.value));   } catch {}
    const l = store.get('lrl_lores');  if (l) try { setSelectedLores(JSON.parse(l.value)); } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => { if (!loaded) return; store.set('lrl_roster', JSON.stringify(roster)); }, [roster, loaded]);
  useEffect(() => { if (!loaded || game === null) return; store.set('lrl_game', JSON.stringify(game)); }, [game, loaded]);
  useEffect(() => { if (!loaded) return; store.set('lrl_lores', JSON.stringify(selectedLores)); }, [selectedLores, loaded]);

  // ── Roster ────────────────────────────────────────────────────────────────
  const addUnit    = () => { const n = newUnitName.trim(); if (!n) return; setRoster(r => [...r, { id: uid(), name: n }]); setNewUnitName(''); };
  const deleteUnit = (id) => setRoster(r => r.filter(u => u.id !== id));

  // ── Game ──────────────────────────────────────────────────────────────────
  const openStartGame = () => { setStartSel(roster.map(u => u.id)); setModal('start'); };
  const startGame     = () => {
    setGame({ round: 1, activeUnitIds: startSel, battleScripture: [],
      acolyteHeroId: null, teclisDiscsUsed: false,
      sevirethAuraOn: false, lyriorAuraOn: false, avalenorAuraOn: false });
    setModal(null);
  };
  const endGame    = () => { setGame(null); store.del('lrl_game'); };
  const nextRound  = () => { setGame(g => ({ ...g, round: g.round + 1 })); setExpandedId(null); };
  const removeEntry = (id) => setGame(g => ({ ...g, battleScripture: g.battleScripture.filter(e => e.id !== id) }));

  // ── Depict Rune ───────────────────────────────────────────────────────────
  const openDepict  = () => { setAddStep(1); setPendingRune(null); setPendingUnits([]); setModal('add-rune'); };
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

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeUnits     = game ? roster.filter(u => game.activeUnitIds.includes(u.id)) : [];
  const allScriptureIds = game ? new Set(game.battleScripture.map(e => e.runeId)) : new Set();
  const uniqueRuneCount = allScriptureIds.size;

  return (
    <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", background: '#f0ece0', minHeight: '100vh', color: '#1a1614' }}>

      {/* ── HEADER ── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #d4c9a8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ paddingTop: 14, paddingBottom: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.28em', color: '#a89878', textTransform: 'uppercase' }}>Warhammer Age of Sigmar</div>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, color: '#c4b98a', letterSpacing: '0.05em' }}>Updated {VERSION}</div>
            </div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 19, fontWeight: 700, color: '#7a520a', letterSpacing: '0.04em', marginTop: 1 }}>Lumineth Realm-lords</div>
          </div>
          <div style={{ display: 'flex', marginTop: 10 }}>
            {[['game', 'Battle'], ['spells', 'Spells'], ['roster', 'Roster']].map(([key, label]) => (
              <button key={key} className="lrl-tab" onClick={() => setTab(key)}
                style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: tab === key ? '2px solid #7a520a' : '2px solid transparent', color: tab === key ? '#7a520a' : '#a89878', cursor: 'pointer', marginBottom: -1, fontWeight: tab === key ? 700 : 400, minHeight: 44 }}>
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
          <RosterTab roster={roster} game={game} newUnitName={newUnitName}
            setNewUnitName={setNewUnitName} addUnit={addUnit} deleteUnit={deleteUnit} />
        )}

        {/* SPELLS TAB */}
        {tab === 'spells' && (
          <SpellsTab selectedLores={selectedLores} setSelectedLores={setSelectedLores}
            game={game} roster={roster} />
        )}

        {/* BATTLE TAB */}
        {tab === 'game' && !game && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28, opacity: 0.18 }}>
              {RUNE_ORDER.map(id => <RuneSymbol key={id} runeId={id} size={50} active />)}
            </div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, color: '#a89878', marginBottom: 8 }}>No Active Battle</div>
            <div style={{ fontSize: 15, color: '#b0a080', marginBottom: 32 }}>
              {roster.length === 0
                ? 'Add units to your roster, then begin a battle.'
                : 'Select your deployed units and begin tracking.'}
            </div>
            {roster.length === 0
              ? <button className="lrl-btn" onClick={() => setTab('roster')}
                style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 28px', background: 'transparent', color: '#7a520a', border: '2px solid #7a520a', cursor: 'pointer', fontWeight: 600, borderRadius: 6 }}>
                Build Roster
              </button>
              : <button className="lrl-btn" onClick={openStartGame}
                style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '16px 32px', background: '#7a520a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 6 }}>
                Begin Battle
              </button>
            }
          </div>
        )}

        {tab === 'game' && game && (
          <div>
            {/* Round bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.3em', color: '#a89878', textTransform: 'uppercase' }}>Battle Round</div>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 52, fontWeight: 700, color: '#7a520a', lineHeight: 1 }}>{game.round}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="lrl-btn" onClick={openDepict}
                  style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 18px', background: '#7a520a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: 6 }}>
                  ✦ Depict Rune
                </button>
                <button className="lrl-btn" onClick={nextRound}
                  style={{ fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '13px 18px', background: '#fff', color: '#5a4e3a', border: '1px solid #d4c9a8', cursor: 'pointer', borderRadius: 6 }}>
                  Next Round →
                </button>
                <button className="lrl-btn" onClick={endGame}
                  style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '13px 14px', background: 'transparent', color: '#b0a080', border: '1px solid #e0d8c4', cursor: 'pointer', borderRadius: 6 }}>
                  End
                </button>
              </div>
            </div>

            <BattleScripture game={game} activeUnits={activeUnits} allScriptureIds={allScriptureIds}
              uniqueRuneCount={uniqueRuneCount} removeEntry={removeEntry} />

            <SpecialAbilitiesPanel game={game} activeUnits={activeUnits} setGame={setGame}
              openTeclisDiscs={() => setModal('teclis-discs')}
              openAcolytePick={() => setModal('acolyte-pick')} />

            <RulesBanner />

            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.28em', color: '#8a7d65', textTransform: 'uppercase', marginBottom: 12 }}>
              Unit Status — {activeUnits.length} deployed
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
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
          confirmRune={confirmRune} onClose={() => setModal(null)} />
      )}
      {modal === 'acolyte-pick' && game && (
        <AcolytePickModal activeUnits={activeUnits} game={game} setGame={setGame} onClose={() => setModal(null)} />
      )}
      {modal === 'teclis-discs' && game && (
        <TeclisDiscsModal game={game} confirmTeclisDiscs={confirmTeclisDiscs} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
