# Lumineth Realm-lords — Battle Scripture Tracker

A web app for tracking runes, spells and battle state for Warhammer Age of Sigmar Lumineth Realm-lords armies.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build for hosting

```bash
npm run build
```

This produces a `dist/` folder you can deploy to Netlify, Vercel, GitHub Pages, or any static host.

### Netlify / Vercel

Drop the `dist/` folder into Netlify's drag-and-drop deploy, or connect the repo and it will build automatically.

## Features

- **Battle tab** — track Battle Scripture runes round by round, unit buff chips, enhanced effects, Thalari bonus
- **Spells tab** — reference for all three Spell Lores and hero-specific spells, filtered to deployed units during a battle
- **Roster tab** — save your army list between sessions
- **Special abilities** — Acolyte of the Runes, Teclis Discs of the Aelementiri, Sevireth/Lyrior/Avalenor passive auras
- All data saved to localStorage

## Project structure

```
src/
  main.jsx          — entry point
  App.jsx           — root component, all state
  store.js          — localStorage wrapper
  data.js           — all game constants (runes, spells, units, keywords)
  utils.js          — buff calculation, keyword helpers
  index.css         — global styles
  components/
    RuneSymbol.jsx
    ModalShell.jsx
    RosterTab.jsx
    SpellCard.jsx
    SpellsTab.jsx
    SpecialAbilitiesPanel.jsx
    BattleScripture.jsx
    UnitCard.jsx
    RulesBanner.jsx
    StartModal.jsx
    AddRuneModal.jsx
    AcolytePickModal.jsx
    TeclisDiscsModal.jsx
```
