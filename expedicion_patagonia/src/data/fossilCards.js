// ============================================================
// FOSSIL CARDS — 126 total
// eraColor: 'green' | 'orange' | 'purple'
// type: 'head'|'neck'|'neck1'|'neck2'|'body'|'tail'|'root'|'trunk'|'crown'|'single'
// animalType: 'dinoLarge' | 'dinoSmall' | 'flora'
// subTag: only for Patagotitan ('Rojo'|'Amarillo'|'Verde')
// ============================================================

let _id = 1;
const id = () => `f${_id++}`;

const makeParts = (name, eraColor, animalType, parts) =>
  parts.flatMap(([type, count, subTags]) =>
    Array.from({ length: count }, (_, i) => ({
      id: id(),
      name,
      eraColor,
      animalType,
      type,
      subTag: subTags ? subTags[i] : undefined,
    }))
  );

// ─── GREENS (Formación Cañadón Asfalto) — 42 cartas ───────────
const bagualia = makeParts('Bagualia', 'green', 'dinoLarge', [
  ['head', 3], ['neck', 3], ['body', 3], ['tail', 3],
]); // 12

const eoabelisaurus = makeParts('Eoabelisaurus', 'green', 'dinoLarge', [
  ['head', 3], ['body', 3], ['tail', 3],
]); // 9

const manidens = makeParts('Manidens', 'green', 'dinoSmall', [
  ['single', 10],
]); // 10

const araucaria = makeParts('Araucaria', 'green', 'flora', [
  ['root', 3], ['trunk', 5], ['crown', 3],
]); // 11

// ─── ORANGES (Grupo Chubut) — 42 cartas ───────────────────────
const SUB = ['Rojo', 'Amarillo', 'Verde'];
const patagotitan = makeParts('Patagotitan', 'orange', 'dinoLarge', [
  ['head',  3, SUB],
  ['neck1', 3, SUB],
  ['neck2', 3, SUB],
  ['body',  3, SUB],
  ['tail',  3, SUB],
]); // 15

const tyrannotitan = makeParts('Tyrannotitan', 'orange', 'dinoLarge', [
  ['head', 3], ['body', 3], ['tail', 3],
]); // 9

const tortuga = makeParts('Tortuga Chelidae', 'orange', 'dinoSmall', [
  ['single', 10],
]); // 10

const helechoGigante = makeParts('Helecho Gigante', 'orange', 'flora', [
  ['single', 8],
]); // 8

// ─── PURPLES (Formación La Colonia) — 42 cartas ───────────────
const carnotaurus = makeParts('Carnotaurus', 'purple', 'dinoLarge', [
  ['head', 4], ['body', 4], ['tail', 4],
]); // 12

const aristonectes = makeParts('Aristonectes', 'purple', 'dinoLarge', [
  ['head', 3], ['body', 3], ['tail', 3],
]); // 9

const paraves = makeParts('Paraves/Aves', 'purple', 'dinoSmall', [
  ['single', 11],
]); // 11

const mamifero = makeParts('Mamífero Primitivo', 'purple', 'dinoSmall', [
  ['single', 10],
]); // 10

export const ALL_FOSSIL_CARDS = [
  ...bagualia,     // 12 green
  ...eoabelisaurus, // 9 green
  ...manidens,     // 10 green
  ...araucaria,    // 11 green  → 42 green ✓
  ...patagotitan,  // 15 orange
  ...tyrannotitan, // 9 orange
  ...tortuga,      // 10 orange
  ...helechoGigante,// 8 orange → 42 orange ✓
  ...carnotaurus,  // 12 purple
  ...aristonectes, // 9 purple
  ...paraves,      // 11 purple
  ...mamifero,     // 10 purple → 42 purple ✓
]; // TOTAL: 126 ✓

// ─── Helper: template for each species describing required parts ─
export const SKELETON_TEMPLATES = {
  Bagualia:       { parts: ['head','neck','body','tail'], eraColor: 'green',  animalType: 'dinoLarge' },
  Eoabelisaurus:  { parts: ['head','body','tail'],        eraColor: 'green',  animalType: 'dinoLarge' },
  Manidens:       { parts: ['single'],                   eraColor: 'green',  animalType: 'dinoSmall' },
  Araucaria:      { parts: ['root','trunk','crown'],     eraColor: 'green',  animalType: 'flora'     },
  Patagotitan:    { parts: ['head','neck1','neck2','body','tail'], eraColor: 'orange', animalType: 'dinoLarge' },
  Tyrannotitan:   { parts: ['head','body','tail'],        eraColor: 'orange', animalType: 'dinoLarge' },
  'Tortuga Chelidae': { parts: ['single'],               eraColor: 'orange', animalType: 'dinoSmall' },
  'Helecho Gigante':  { parts: ['single'],               eraColor: 'orange', animalType: 'flora'     },
  Carnotaurus:    { parts: ['head','body','tail'],        eraColor: 'purple', animalType: 'dinoLarge' },
  Aristonectes:   { parts: ['head','body','tail'],        eraColor: 'purple', animalType: 'dinoLarge' },
  'Paraves/Aves': { parts: ['single'],                   eraColor: 'purple', animalType: 'dinoSmall' },
  'Mamífero Primitivo': { parts: ['single'],             eraColor: 'purple', animalType: 'dinoSmall' },
};
