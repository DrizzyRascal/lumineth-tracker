export const RUNES = {
  varinor: {
    id: 'varinor', name: 'Varinor', subtitle: 'Rune of Strength',
    color: '#9a5f0a', dimColor: '#c9ad7a', bg: 'rgba(154,95,10,0.08)', border: 'rgba(154,95,10,0.22)',
    short: '+1 Run & Charge',
    effect: 'Add 1 to run rolls and charge rolls for each target.',
    enhanced: {
      ydriliqi: { short: '+1 Wound (combat attacks)', full: 'Add 1 to wound rolls for each target\u2019s combat attacks.' },
      oreali:   { short: 'SHOOT/CHARGE after RETREAT', full: 'Targets can use SHOOT and/or CHARGE even if they used a RETREAT ability in the same turn.' },
    },
  },
  alaithi: {
    id: 'alaithi', name: 'Alaithi', subtitle: 'Rune of the Mountain',
    color: '#1e6e42', dimColor: '#8abda0', bg: 'rgba(30,110,66,0.08)', border: 'rgba(30,110,66,0.22)',
    short: 'WARD (5+)',
    effect: 'Each target has WARD (5+).',
    enhanced: {
      varinor:  { short: 'Anti-charge (+1 Rend)', full: 'The targets\u2019 melee weapons have Anti-charge (+1 Rend).' },
      ydriliqi: { short: 'Enemy \u22121 Wound vs targets in combat', full: 'Subtract 1 from wound rolls for attacks made by enemy units while they are in combat with any of the targets.' },
    },
  },
  ydriliqi: {
    id: 'ydriliqi', name: 'Ydriliqi', subtitle: 'Rune of the River',
    color: '#1a5c96', dimColor: '#7aaad4', bg: 'rgba(26,92,150,0.08)', border: 'rgba(26,92,150,0.22)',
    short: 'Enemy \u22122 Charge (within 12\u2033)',
    effect: 'Subtract 2 from charge rolls for enemy units while they are within 12\u2033 of any of the targets.',
    enhanced: {
      alaithi: { short: 'Ignore negative Hit/Wound modifiers', full: 'Ignore negative modifiers to hit rolls and wound rolls for attacks made by the targets.' },
      oreali:  { short: 'Move 3\u2033 through enemy combat ranges', full: 'Each target can immediately move up to 3\u2033. They can pass through the combat ranges of enemy units and can end that move in combat.' },
    },
  },
  oreali: {
    id: 'oreali', name: 'Oreali', subtitle: 'Rune of the Wind',
    color: '#5c3a9e', dimColor: '#a98fd4', bg: 'rgba(92,58,158,0.08)', border: 'rgba(92,58,158,0.22)',
    short: 'Enemy \u22121 Hit (in combat)',
    effect: 'Subtract 1 from hit rolls for attacks made by enemy units while they are in combat with any of the targets.',
    enhanced: {
      varinor: { short: '+4\u2033 Move', full: 'Add 4\u2033 to each target\u2019s Move characteristic.' },
      alaithi: { short: '+5 Control Score', full: 'Add 5 to each target\u2019s control score.' },
    },
  },
  thalari: {
    id: 'thalari', name: 'Thalari', subtitle: 'Rune of the Zenith',
    color: '#7a520a', dimColor: '#c4a455', bg: 'rgba(122,82,10,0.08)', border: 'rgba(122,82,10,0.22)',
    short: '+2 Casting (all LUMINETH)',
    effect: 'Add 2 to casting rolls for friendly LUMINETH REALM-LORDS units.',
    enhanced: null, armyWide: true,
    armyBonus: 'Add 4\u2033 to Move and attacks score critical hits on unmodified 5+ for all friendly LUMINETH REALM-LORDS units.',
    armyBonusShort: '+4\u2033 Move + Crits on 5+ (army-wide)',
  },
};

export const RUNE_ORDER = ['varinor', 'alaithi', 'ydriliqi', 'oreali', 'thalari'];

export const UNIT_DATA = [
  // ── Heroes ──────────────────────────────────────────────────────────────────
  { name: 'Alarith Stonemage',                             points: 130, keywords: ['ALARITH', 'HERO'], isHero: true },
  { name: 'Archmage Teclis and Celennar, Spirit of Hysh', points: 640, keywords: ['SCINARI', 'HERO'], isHero: true },
  { name: 'Avalenor, the Stoneheart King',                 points: 420, keywords: ['ALARITH', 'HERO'], isHero: true },
  { name: 'Ellania and Ellathor, Eclipsian Warsages',      points: 290, keywords: ['HERO'],            isHero: true },
  { name: 'Hurakan Windmage',                              points: 140, keywords: ['HURAKAN', 'HERO'], isHero: true },
  { name: 'Lyrior Uthralle, Warden of Ymetrica',          points: 250, keywords: ['VANARI', 'HERO'],  isHero: true },
  { name: 'Scinari Calligrave',                            points: 130, keywords: ['SCINARI', 'HERO'], isHero: true },
  { name: 'Scinari Cathallar',                             points: 130, keywords: ['SCINARI', 'HERO'], isHero: true },
  { name: 'Scinari Enlightener',                           points: 180, keywords: ['SCINARI', 'HERO'], isHero: true },
  { name: 'Scinari Loreseeker',                            points: 140, keywords: ['SCINARI', 'HERO'], isHero: true },
  { name: 'Sevireth, Lord of the Seventh Wind',            points: 340, keywords: ['HURAKAN', 'HERO'], isHero: true },
  { name: 'The Light of Eltharion',                        points: 290, keywords: ['HERO'],            isHero: true },
  { name: 'Vanari Bannerblade',                            points: 140, keywords: ['VANARI', 'HERO'],  isHero: true },
  { name: 'Vanari Lord Regent',                            points: 110, keywords: ['VANARI', 'HERO'],  isHero: true },
  { name: 'Vanari Lord Regent on Lightcourser',            points: 150, keywords: ['VANARI', 'HERO'],  isHero: true },
  // ── Scourge of Ghyran ───────────────────────────────────────────────────────
  { name: 'The Light of Eltharion (Scourge of Ghyran)',   points: 280, keywords: ['HERO'],            isHero: true, scourgeOfGhyran: true },
  { name: 'Vanari Bannerblade (Scourge of Ghyran)',        points: 140, keywords: ['VANARI', 'HERO'],  isHero: true, scourgeOfGhyran: true },
  // ── Units ────────────────────────────────────────────────────────────────────
  { name: 'Alarith Spirit of the Mountain',                points: 340, keywords: ['ALARITH', 'MONSTER'],          isHero: false, canReinforce: false },
  { name: 'Alarith Stoneguard',                            points: 130, keywords: ['AELF', 'ALARITH', 'INFANTRY'], isHero: false, canReinforce: true  },
  { name: 'Hurakan Spirit of the Wind',                    points: 270, keywords: ['HURAKAN', 'MONSTER'],          isHero: false, canReinforce: false },
  { name: 'Hurakan Windchargers',                          points: 160, keywords: ['AELF', 'HURAKAN', 'CAVALRY'],  isHero: false, canReinforce: true  },
  { name: 'Vanari Auralan Sentinels',                      points: 140, keywords: ['AELF', 'VANARI', 'INFANTRY'],  isHero: false, canReinforce: true  },
  { name: 'Vanari Auralan Wardens',                        points: 120, keywords: ['AELF', 'VANARI', 'INFANTRY'],  isHero: false, canReinforce: true  },
  { name: 'Vanari Bladelords',                             points: 150, keywords: ['AELF', 'VANARI', 'INFANTRY'],  isHero: false, canReinforce: true  },
  { name: 'Vanari Dawnriders',                             points: 180, keywords: ['AELF', 'VANARI', 'CAVALRY'],   isHero: false, canReinforce: true  },
  { name: 'Vanari Starshard Ballista',                     points: 120, keywords: ['VANARI', 'WAR MACHINE'],       isHero: false, canReinforce: false },
  { name: 'Ydrilan Riverblades',                           points: 140, keywords: ['AELF', 'INFANTRY'],            isHero: false, canReinforce: false },
  // ── Faction Terrain ──────────────────────────────────────────────────────────
  { name: 'Shrine Luminor',                                points: 0,   keywords: ['FACTION TERRAIN'],             isHero: false, canReinforce: false, isTerrain: true },
];

export const UNIT_KEYWORDS = Object.fromEntries(UNIT_DATA.map(u => [u.name, u.keywords]));

export const WARSCROLL_REMINDERS = {
  'Hurakan Windchargers': (n) => n >= 2
    ? [{ text: `Guided by the Winds: +6\u2033 Bow Range (${n} Oreali \u2713)`, active: true }]
    : [{ text: `Guided by the Winds: needs 2+ Oreali for +6\u2033 Bow Range (${n} now)`, active: false }],
  'Hurakan Spirit of the Wind': (n) => n > 0
    ? [{ text: `Spirit of the Wind: move D6+${n * 2}\u2033 after SHOOT (${n} Oreali)`, active: true }]
    : [{ text: 'Spirit of the Wind: no Oreali on scripture \u2014 no bonus movement', active: false }],
};


export const MANIFESTATIONS = [
  {
    id: 'hyshian-twinstones',
    name: 'Hyshian Twinstones',
    type: 'Endless Spell',
    castValue: 6,
    color: '#7a520a', bg: 'rgba(122,82,10,0.08)', border: 'rgba(122,82,10,0.22)',
    summonDeclare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, then make a casting roll of 2D6.',
    summonEffect: 'Set up 1 Hyshian Twinstones token on the battlefield within 12\u2033 of the caster.',
    abilities: [
      {
        id: 'reservoir-of-power',
        name: 'Reservoir of Power',
        timing: 'passive',
        timingLabel: 'Passive',
        effect: 'Each time a unit casts a spell and it is not unbound while this model is on the battlefield, add 1 arcane charge point (max 6).',
      },
      {
        id: 'release-arcane-charge',
        name: 'Release Arcane Charge',
        timing: 'any',
        timingLabel: 'Any Hero Phase',
        keywords: ['REACTION', 'ONCE PER TURN (ARMY)'],
        trigger: 'A friendly LUMINETH REALM-LORDS WIZARD within 3\u2033 of this model declares a SPELL or UNBIND ability.',
        effect: 'Add the current arcane charge total to that WIZARD\u2019s casting or unbinding roll, then reset the arcane charge counter to 0.',
        tracksArcaneCharge: true,
      },
    ],
  },
  {
    id: 'rune-of-petrification',
    name: 'Rune of Petrification',
    type: 'Manifestation',
    castValue: 7,
    color: '#5c3a9e', bg: 'rgba(92,58,158,0.08)', border: 'rgba(92,58,158,0.22)',
    summonDeclare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, then make a casting roll of 2D6.',
    summonEffect: 'Set up 1 Rune of Petrification token on the battlefield within 12\u2033 of the caster.',
    abilities: [],
  },
  {
    id: 'sanctum-of-amyntok',
    name: 'Sanctum of Amyntok',
    type: 'Manifestation',
    castValue: 7,
    color: '#1a5c96', bg: 'rgba(26,92,150,0.08)', border: 'rgba(26,92,150,0.22)',
    summonDeclare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, then make a casting roll of 2D6.',
    summonEffect: 'Set up the 3 Sanctum of Amyntok tokens within 12\u2033 of the caster and more than 3\u2033 from all enemy units.',
    abilities: [],
  },
];

export const SPELL_LORES = [
  {
    id: 'hysh', name: 'Lore of Hysh', cost: null,
    color: '#9a5f0a', bg: 'rgba(154,95,10,0.08)', border: 'rgba(154,95,10,0.22)',
    spells: [
      { id: 'piercing-refraction', name: 'Piercing Refraction', castValue: 7, keywords: ['SPELL'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, pick a visible enemy unit within 18\u2033 of them to be the target, then make a casting roll of 2D6.',
        effect: 'Roll a dice for each model in the target unit. For each 5+, inflict 1 mortal damage on the target.' },
      { id: 'beacon-of-hysh', name: 'Beacon of Hysh', castValue: 6, keywords: ['SPELL', 'UNLIMITED'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, pick a visible friendly non-MONSTER LUMINETH REALM-LORDS unit wholly within 12\u2033 of them to be the target, then make a casting roll of 2D6.',
        effect: 'Until the start of your next turn, if the unmodified hit roll for an attack that targets that friendly unit is 1\u20133, the attack fails and the attack sequence ends.' },
      { id: 'overwhelming-heat', name: 'Overwhelming Heat', castValue: 7, keywords: ['SPELL'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, pick a visible enemy unit within 18\u2033 of them to be the target, then make a casting roll of 2D6.',
        effect: "Halve the target\u2019s Move characteristic until the start of your next turn, then roll a dice. If the roll equals or exceeds the target\u2019s Save characteristic, inflict D3 mortal damage on it." },
    ],
  },
  {
    id: 'prismatic', name: 'Lore of Prismatic Resonance', cost: 10,
    color: '#5c3a9e', bg: 'rgba(92,58,158,0.08)', border: 'rgba(92,58,158,0.22)',
    spells: [
      { id: 'beacons-of-protection', name: 'Beacons of Protection', castValue: 6, keywords: ['SPELL', 'UNLIMITED'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, then make a casting roll of 2D6.',
        effect: 'Until the start of your next turn, ignore the first damage point allocated to friendly non-MONSTER LUMINETH REALM-LORDS units each phase while they are wholly within 9\u2033 of a friendly LUMINETH REALM-LORDS WIZARD. Add 3\u2033 to the range for each additional time this spell has been successfully cast by a friendly WIZARD this battle round.' },
      { id: 'unseen-force', name: 'Unseen Force', castValue: 6, keywords: ['SPELL', 'UNLIMITED'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, pick a visible enemy unit within 18\u2033 of them to be the target, then make a casting roll of 2D6.',
        effect: "Until the start of your next turn, the target cannot use RUN abilities. In addition, if that enemy unit has already been picked to be the target of this ability this battle round, subtract 1 from hit rolls for the target\u2019s combat attacks." },
      { id: 'beam-of-hysh', name: 'Beam of Hysh', castValue: 6, keywords: ['SPELL', 'UNLIMITED'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, pick a visible enemy unit within 18\u2033 of them that has not been picked to be the target of this ability this battle round to be the target, then make a casting roll of 2D6. Add 1 to the casting value of this spell for each time it has been successfully cast by a friendly WIZARD this turn.',
        effect: 'Inflict D3+X mortal damage on the target, where X is the number of times, to a maximum of 3, that this spell has previously been successfully cast by a friendly WIZARD this turn.' },
    ],
  },
  {
    id: 'awakened', name: 'Lore of the Awakened Realms', cost: null,
    color: '#1e6e42', bg: 'rgba(30,110,66,0.08)', border: 'rgba(30,110,66,0.22)',
    spells: [
      { id: 'focused-erosion', name: 'Focused Erosion', castValue: 6, keywords: ['SPELL', 'UNLIMITED'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, pick a visible enemy unit within 18\u2033 of them to be the target, then make a casting roll of 2D6.',
        effect: "Subtract 1 from the Rend characteristic of the target\u2019s weapons until the start of your next turn." },
      { id: 'elemental-push', name: 'Elemental Push', castValue: 6, keywords: ['SPELL'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, pick a visible friendly LUMINETH REALM-LORDS unit wholly within 12\u2033 of them that was not set up this turn to be the target, then make a casting roll of 2D6. Subtract 1 from the roll if the target is in combat.',
        effect: 'The target can move up to 5\u2033. It can pass through the combat ranges of enemy units but cannot end that move in combat.' },
      { id: 'realmshield', name: 'Realmshield', castValue: 7, keywords: ['SPELL'],
        declare: 'Pick a friendly LUMINETH REALM-LORDS WIZARD to cast this spell, then make a casting roll of 2D6.',
        effect: 'Until the start of your next turn, friendly LUMINETH REALM-LORDS units have WARD (5+) while they are wholly within 12\u2033 of the caster.' },
    ],
  },
];

export const HERO_SPELLS = [
  { unitMatch: 'Teclis',
    color: '#7a520a', bg: 'rgba(122,82,10,0.08)', border: 'rgba(122,82,10,0.22)',
    spells: [
      { id: 'light-of-truth', name: 'The Light of Truth', castValue: 7, keywords: ['SPELL'],
        declare: 'Pick any number of different visible enemy units within 18\u2033 of this unit to be the targets, then make a casting roll of 2D6.',
        effect: 'Inflict D3 mortal damage on each target.' },
    ]},
  { unitMatch: 'Ellania',
    color: '#5c3a9e', bg: 'rgba(92,58,158,0.08)', border: 'rgba(92,58,158,0.22)',
    spells: [
      { id: 'total-eclipse', name: 'Total Eclipse', castValue: 8, keywords: ['SPELL'],
        declare: 'Make a casting roll of 2D6.',
        effect: 'Until the start of your next turn, the first time an enemy unit within 18\u2033 of this unit uses a command, unless your opponent spends 1 additional command point, the command has no effect, it still counts as having been used and the command points spent to use the command are still lost.' },
    ]},
  { unitMatch: 'Lyrior',
    color: '#9a5f0a', bg: 'rgba(154,95,10,0.08)', border: 'rgba(154,95,10,0.22)',
    spells: [
      { id: 'focused-fury', name: 'Focused Fury', castValue: 5, keywords: ['SPELL'],
        declare: 'Make a casting roll of 2D6. Add 2 to the roll if this unit is in combat.',
        effect: 'This unit has STRIKE-FIRST for the rest of the turn.' },
    ]},
  { unitMatch: 'Hurakan Windmage',
    color: '#5c3a9e', bg: 'rgba(92,58,158,0.08)', border: 'rgba(92,58,158,0.22)',
    spells: [
      { id: 'transporting-vortex', name: 'Transporting Vortex', castValue: 7, keywords: ['SPELL'],
        declare: 'Pick a visible friendly LUMINETH REALM-LORDS unit wholly within 12\u2033 of this unit and not in combat to be the target, then make a casting roll of 2D6.',
        effect: 'Remove the target from the battlefield and set it up again on the battlefield more than 9\u2033 from all enemy units.' },
    ]},
  { unitMatch: 'Alarith Stonemage',
    color: '#1e6e42', bg: 'rgba(30,110,66,0.08)', border: 'rgba(30,110,66,0.22)',
    spells: [
      { id: 'raise-the-earth', name: 'Raise the Earth', castValue: 7, keywords: ['SPELL'],
        declare: 'Pick an objective within 18\u2033 of this unit to be the target, then make a casting roll of 2D6.',
        effect: 'Until the start of your next turn, each time a non-FLY unit (friendly or enemy) that is contesting the target objective uses a MOVE ability, inflict D6 mortal damage on that unit after that ability has been resolved.' },
    ]},
  { unitMatch: 'Scinari Enlightener',
    color: '#1a5c96', bg: 'rgba(26,92,150,0.08)', border: 'rgba(26,92,150,0.22)',
    spells: [
      { id: 'clarity-of-thought', name: 'Clarity of Thought', castValue: 7, keywords: ['SPELL', 'UNLIMITED'],
        declare: 'Pick a visible friendly LUMINETH REALM-LORDS INFANTRY unit wholly within 12\u2033 of this unit to be the target, then make a casting roll of 2D6.',
        effect: 'Until the start of your next turn, attacks that target that friendly unit cannot score critical hits (treat them as regular hits instead).' },
    ]},
];
