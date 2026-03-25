// ============================================================
// SCORING ENGINE
// ============================================================
import { SKELETON_TEMPLATES } from '../data/fossilCards.js';

/**
 * Group lab cards by skeleton or isolated.
 * Returns: { skeletons: [...], isolatedCards: [...] }
 */
export function groupLabCards(labCards, hybridConnections = []) {
  // hybridConnections is an array of Sets of card IDs that were joined via Nueva Teoría
  const assigned = new Set();
  const skeletons = [];
  const isolatedCards = [];

  // Try to build complete skeletons per species
  const bySpecies = {};
  for (const card of labCards) {
    if (card.faceDown) continue; // transit fossils handled separately
    if (!bySpecies[card.name]) bySpecies[card.name] = [];
    bySpecies[card.name].push(card);
  }

  for (const [speciesName, cards] of Object.entries(bySpecies)) {
    const tmpl = SKELETON_TEMPLATES[speciesName];
    if (!tmpl) continue;

    if (tmpl.animalType === 'dinoSmall' || tmpl.animalType === 'flora') {
      if (tmpl.parts[0] === 'single') {
        // Each single card is "complete" by itself
        for (const c of cards) {
          skeletons.push({ cards: [c], complete: true, species: speciesName, tmpl, hybrid: false });
          assigned.add(c.id);
        }
      } else {
        // flora: need root + trunk + crown
        const byPart = {};
        for (const p of tmpl.parts) byPart[p] = cards.filter(c => c.type === p);
        const minCount = Math.min(...Object.values(byPart).map(arr => arr.length));
        for (let i = 0; i < minCount; i++) {
          const sCards = tmpl.parts.map(p => byPart[p][i]);
          skeletons.push({ cards: sCards, complete: true, species: speciesName, tmpl, hybrid: false });
          sCards.forEach(c => assigned.add(c.id));
        }
        // Leftover partials
        for (const c of cards) {
          if (!assigned.has(c.id)) isolatedCards.push(c);
        }
      }
    } else {
      // dinoLarge: group sets of parts
      const byPart = {};
      for (const p of tmpl.parts) byPart[p] = cards.filter(c => c.type === p);
      const minCount = Math.min(...Object.values(byPart).map(arr => arr.length));
      for (let i = 0; i < minCount; i++) {
        const sCards = tmpl.parts.map(p => byPart[p][i]);
        const isHybrid = hybridConnections.some(conn => sCards.some(c => conn.has(c.id)));
        skeletons.push({ cards: sCards, complete: true, species: speciesName, tmpl, hybrid: isHybrid });
        sCards.forEach(c => assigned.add(c.id));
      }
      // Incomplete stacks — filter by BOTH unassigned AND matching type to avoid duplication
      const leftoverByPart = {};
      for (const p of tmpl.parts) leftoverByPart[p] = cards.filter(c => !assigned.has(c.id) && c.type === p);
      const leftover = Object.values(leftoverByPart).flat();
      if (leftover.length > 0) {
        skeletons.push({ cards: leftover, complete: false, species: speciesName, tmpl, hybrid: false });
        leftover.forEach(c => assigned.add(c.id));
      }
    }
  }

  // Anything not assigned (hybrid connections across species)
  for (const card of labCards) {
    if (!assigned.has(card.id) && !card.faceDown) isolatedCards.push(card);
  }

  return { skeletons, isolatedCards };
}

/**
 * Main scoring function
 * @param {Object} player - { labCards, hybridConnections, protectedIds }
 * @param {boolean} subsidyActive - doubles complete skeleton scores
 * @returns {number} total prestige points
 */
export function calculatePrestige(player, subsidyActive = false) {
  const { labCards = [], hybridConnections = [] } = player;

  // Face-down / transit fossils: 1pt each
  const transitCards = labCards.filter(c => c.faceDown);
  let total = transitCards.length;

  const normalCards = labCards.filter(c => !c.faceDown);
  const { skeletons, isolatedCards } = groupLabCards(normalCards, hybridConnections);

  // Isolated non-facedown: 1pt each
  total += isolatedCards.length;

  for (const skel of skeletons) {
    if (!skel.complete) {
      // Incomplete dinoLarge → 0 points
      if (skel.tmpl.animalType === 'dinoLarge') continue;
    }

    if (skel.hybrid) {
      // Hybrid: sum cards, no bonus
      total += skel.cards.length;
      continue;
    }

    const { animalType } = skel.tmpl;
    const baseCards = skel.cards.length;

    if (animalType === 'dinoSmall' || animalType === 'flora') {
      // x2 for survivors
      let pts = baseCards * 2;
      if (subsidyActive) pts *= 2;
      total += pts;
    } else if (animalType === 'dinoLarge' && skel.complete) {
      let pts = 20 + baseCards;

      // ─── HOLOTIPO PERFECTO (Patagotitan) ─────────────
      if (skel.species === 'Patagotitan') {
        const subTags = skel.cards.map(c => c.subTag).filter(Boolean);
        const allSame = subTags.length === skel.cards.length && new Set(subTags).size === 1;
        if (allSame) pts *= 2; // double the entire skeleton score
      }

      if (subsidyActive) pts *= 2;
      total += pts;
    }
  }

  return total;
}
