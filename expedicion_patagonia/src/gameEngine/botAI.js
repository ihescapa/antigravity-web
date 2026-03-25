// ============================================================
// BOT AI
// ============================================================
import { SKELETON_TEMPLATES } from '../data/fossilCards.js';

/**
 * Bot picks 1 card from its hand.
 * Priority: complete an existing skeleton > match era color > any card
 * condition: active condition card (may restrict dinoLarge)
 */
export function botPickFossil(hand, labCards, condition) {
  const canLarge = condition?.effect !== 'noLargeDino';

  const filteredHand = hand.filter(card => {
    if (!canLarge && card.animalType === 'dinoLarge') return false;
    return true;
  });

  if (filteredHand.length === 0) return hand[0]; // fallback

  // What species does the bot already have in the lab?
  const labSpecies = new Set(labCards.map(c => c.name));
  const labColors = new Set(labCards.map(c => c.eraColor));

  // Priority 1: complete a known skeleton (card name matches partial lab)
  const completing = filteredHand.find(c => labSpecies.has(c.name));
  if (completing) return completing;

  // Priority 2: match era color
  const sameColor = filteredHand.find(c => labColors.has(c.eraColor));
  if (sameColor) return sameColor;

  // Priority 3: first valid card
  return filteredHand[0];
}

/**
 * Bot decides whether to play an action card (15% chance).
 * Returns action card to play, or null.
 */
export function botDecideAction(actionHand, targetPlayers, campaign) {
  if (Math.random() > 0.15) return null;
  if (actionHand.length === 0) return null;

  // Filter: can only play Meteorito in campaign 3
  const playable = actionHand.filter(
    a => a.effectType !== 'endGame' || campaign >= 3
  );
  if (playable.length === 0) return null;

  return playable[0]; // play first available
}
