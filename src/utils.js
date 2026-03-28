import { RUNES, UNIT_KEYWORDS, WARSCROLL_REMINDERS } from './data.js';

let _seq = Date.now();
export const uid = () => String(_seq++);

export const getKeywords = (name) => UNIT_KEYWORDS[name] || [];
export const isHero = (name) => getKeywords(name).includes('HERO');

export const getOrealiCount = (battleScripture, unitName, game) => {
  const count = battleScripture.filter(e => e.runeId === 'oreali').length;
  const bonus = (game?.sevirethAuraOn && getKeywords(unitName).includes('HURAKAN')) ? 1 : 0;
  return count + bonus;
};

export const getWarscrollReminders = (unitName, battleScripture, game) => {
  const fn = WARSCROLL_REMINDERS[unitName];
  if (!fn) return null;
  return fn(getOrealiCount(battleScripture, unitName, game));
};

// Rules:
//  • Unit effects: only from runes depicted THIS round (not teclisOnly)
//  • Enhanced effect conditions: all runes on scripture (incl. teclisOnly) + virtual aura instances
//  • Aura toggles add virtual rune instances for units with matching keywords
export const getUnitBuffs = (unitId, unitName, battleScripture, currentRound, game) => {
  const activeEntries = battleScripture.filter(e =>
    e.unitIds.includes(unitId) && e.round === currentRound && !e.teclisOnly
  );
  const allScriptureIds = new Set(battleScripture.map(e => e.runeId));
  const keywords = getKeywords(unitName);

  const effectiveIds = new Set(allScriptureIds);
  if (game?.sevirethAuraOn && keywords.includes('HURAKAN')) effectiveIds.add('oreali');
  if (game?.lyriorAuraOn  && keywords.includes('VANARI'))   effectiveIds.add('varinor');
  if (game?.avalenorAuraOn && keywords.includes('ALARITH'))  effectiveIds.add('alaithi');

  const buffs = [];
  for (const entry of activeEntries) {
    const rune = RUNES[entry.runeId];
    const enhanced = [];
    if (rune.enhanced) {
      for (const [condId, data] of Object.entries(rune.enhanced)) {
        if (effectiveIds.has(condId)) {
          enhanced.push({
            condId, condName: RUNES[condId].name,
            short: data.short, full: data.full,
            virtual: !allScriptureIds.has(condId),
          });
        }
      }
    }
    buffs.push({ key: entry.id, runeId: entry.runeId, round: entry.round,
      effect: rune.effect, short: rune.short, enhanced, army: false });
  }

  const thalariNow = battleScripture.some(e =>
    e.runeId === 'thalari' && e.round === currentRound && !e.teclisOnly
  );
  if (thalariNow) {
    buffs.push({ key: 'thalari-base', runeId: 'thalari', effect: RUNES.thalari.effect,
      short: RUNES.thalari.short, enhanced: [], army: true });
    if (allScriptureIds.size >= 4)
      buffs.push({ key: 'thalari-bonus', runeId: 'thalari', effect: RUNES.thalari.armyBonus,
        short: RUNES.thalari.armyBonusShort, enhanced: [], army: true });
  }
  return buffs;
};
