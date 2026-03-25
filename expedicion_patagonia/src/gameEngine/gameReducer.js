// ============================================================
// GAME REDUCER — Central state machine
// ============================================================
import { ALL_FOSSIL_CARDS } from '../data/fossilCards.js';
import { ALL_ACTION_CARDS } from '../data/actionCards.js';
import { ALL_CONDITION_CARDS } from '../data/conditionCards.js';
import { botPickFossil, botDecideAction } from './botAI.js';
import { calculatePrestige } from './scoring.js';

// ─── UTILITIES ───────────────────────────────────────────────
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const PLAYER_NAMES = ['Vos (Paleontólogo Jefe)', 'Dr. Coria', 'Dra. Apaldetti', 'Lic. Novas'];
const BOT_IDS = [1, 2, 3];
const TURNS_PER_CAMPAIGN = 7;
const CAMPAIGNS = 3;

const initialPlayer = (id, isHuman) => ({
  id,
  name: PLAYER_NAMES[id],
  isHuman,
  hand: [],         // fossil draft hand
  actionHand: [],   // action card hand
  pendingFind: null,// card chosen during draft, before prep
  labCards: [],     // placed fossils
  hybridConnections: [], // sets of card IDs joined by Nueva Teoría
  blockedThisTurn: false,
  encajadasThisTurn: false,
  score: 0,
});

// ─── INITIAL STATE ───────────────────────────────────────────
export const INITIAL_STATE = {
  phase: 'title',  // 'title' | 'setup' | 'draft' | 'actions' | 'prep' | 'pass' | 'scoring'
  currentCampaign: 0,
  turnInCampaign: 0,
  fossilDeck: [],
  actionDeck: [],
  conditionDeck: [],
  activeCondition: null,
  players: [],
  log: [],
  scores: [],
  selectedFossilId: null,     // human's current pick
  selectedActionId: null,
  actionTarget: null,         // player id target for action
  subsidyActive: false,
};

// ─── REDUCER ─────────────────────────────────────────────────
export function gameReducer(state, action) {
  switch (action.type) {

    case 'START_GAME': {
      const fossilDeck = shuffle(ALL_FOSSIL_CARDS);
      const actionDeck = shuffle(ALL_ACTION_CARDS);
      const conditionDeck = shuffle(ALL_CONDITION_CARDS);
      const players = [
        initialPlayer(0, true),
        initialPlayer(1, false),
        initialPlayer(2, false),
        initialPlayer(3, false),
      ];
      // Deal 3 action cards each
      players.forEach((p, i) => {
        p.actionHand = actionDeck.splice(0, 3);
      });
      return {
        ...INITIAL_STATE,
        phase: 'setup',
        fossilDeck,
        actionDeck,
        conditionDeck,
        players,
        log: ['🏕️ ¡Campaña iniciada! Bienvenidos a la Patagonia.'],
      };
    }

    case 'START_CAMPAIGN': {
      const { conditionDeck, fossilDeck, players, currentCampaign } = state;
      const newCampaign = currentCampaign + 1;
      const [cond, ...restCond] = conditionDeck;
      let newFossilDeck = [...fossilDeck];
      const newPlayers = players.map(p => {
        const hand = newFossilDeck.splice(0, TURNS_PER_CAMPAIGN);
        return { ...p, hand, pendingFind: null, blockedThisTurn: false };
      });
      const subsidyActive = cond?.effect === 'doubleComplete';
      const log = [
        ...state.log,
        ``,
        `📋 ══ CAMPAÑA ${newCampaign} ══`,
        `🌦️ Condición: ${cond?.name ?? 'Sin condición'} — ${cond?.description ?? ''}`,
      ];
      return {
        ...state,
        phase: 'draft',
        currentCampaign: newCampaign,
        turnInCampaign: 1,
        conditionDeck: restCond,
        fossilDeck: newFossilDeck,
        activeCondition: cond || null,
        players: newPlayers,
        subsidyActive,
        log,
        selectedFossilId: null,
      };
    }

    case 'SELECT_FOSSIL': {
      return { ...state, selectedFossilId: action.cardId };
    }

    case 'SELECT_ACTION': {
      return { ...state, selectedActionId: action.cardId, actionTarget: null };
    }

    case 'SET_ACTION_TARGET': {
      return { ...state, actionTarget: action.playerId };
    }

    case 'CONFIRM_DRAFT': {
      // Human must have a selection
      const human = state.players[0];
      if (!state.selectedFossilId && human.hand.length > 0) return state;
      if (human.hand.length === 0) return state;

      const condition = state.activeCondition;
      const canLarge = condition?.effect !== 'noLargeDino';

      const newPlayers = state.players.map(p => {
        if (p.blockedThisTurn || p.encajadasThisTurn) {
          return { ...p, pendingFind: null };
        }
        if (p.isHuman) {
          const chosen = p.hand.find(c => c.id === state.selectedFossilId);
          if (!chosen) return p;
          const newHand = p.hand.filter(c => c.id !== state.selectedFossilId);
          return { ...p, hand: newHand, pendingFind: chosen };
        } else {
          const picked = botPickFossil(p.hand, p.labCards, condition);
          if (!picked) return p;
          const newHand = p.hand.filter(c => c.id !== picked.id);
          return { ...p, hand: newHand, pendingFind: picked };
        }
      });

      const log = [
        ...state.log,
        `⛏️  Turno ${state.turnInCampaign}: ${newPlayers.map(p => {
          const f = p.pendingFind;
          return f ? `${p.name.split(' ')[0]} excavó ${f.name}` : `${p.name.split(' ')[0]} sin hallazgo`;
        }).join(' | ')}`,
      ];

      return {
        ...state,
        players: newPlayers,
        phase: 'actions',
        selectedFossilId: null,
        log,
      };
    }

    case 'PLAY_ACTION': {
      const { cardId, targetPlayerId } = action;
      const human = state.players[0];
      const actionCard = human.actionHand.find(a => a.id === cardId);
      if (!actionCard) return state;

      // Validate Meteorito
      if (actionCard.effectType === 'endGame' && state.currentCampaign < 3) {
        const log = [...state.log, `⚠️ "Impacto de Meteorito" solo puede jugarse en la Campaña 3!`];
        return { ...state, log };
      }

      const newActionHand = human.actionHand.filter(a => a.id !== cardId);
      let newPlayers = state.players.map(p =>
        p.id === 0 ? { ...p, actionHand: newActionHand } : p
      );
      let log = [...state.log];
      let newPhase = state.phase;

      switch (actionCard.effectType) {
        case 'protect': {
          // Mark first unprotected lab card of human
          newPlayers = newPlayers.map(p => {
            if (p.id !== 0) return p;
            const updatedLab = p.labCards.map((c, i) =>
              i === 0 && !c.protected ? { ...c, protected: true } : c
            );
            return { ...p, labCards: updatedLab };
          });
          log.push(`🧱 [Vos] Armar el Bochón — ¡Fósil protegido con yeso!`);
          break;
        }
        case 'blockDraft': {
          if (targetPlayerId === undefined || targetPlayerId === 0) break;
          newPlayers = newPlayers.map(p => {
            if (p.id !== targetPlayerId) return p;
            const card = p.pendingFind;
            if (!card) return p;
            const transitCard = { ...card, faceDown: true };
            return {
              ...p,
              pendingFind: null,
              labCards: [...p.labCards, transitCard],
            };
          });
          const target = state.players.find(p => p.id === targetPlayerId);
          log.push(`🔒 [Vos→${target?.name.split(' ')[0]}] Tranquera con Candado — Fósil en tránsito!`);
          break;
        }
        case 'skipReveal': {
          if (targetPlayerId === undefined || targetPlayerId === 0) break;
          newPlayers = newPlayers.map(p =>
            p.id === targetPlayerId ? { ...p, encajadasThisTurn: true } : p
          );
          const t2 = state.players.find(p => p.id === targetPlayerId);
          log.push(`🚛 [Vos→${t2?.name.split(' ')[0]}] ¡Camioneta Encajada! Se saltea la fase de revelación.`);
          break;
        }
        case 'hybridConnect': {
          // Mark pending find as hybrid-valid (handled in prep)
          newPlayers = newPlayers.map(p => {
            if (p.id !== 0) return p;
            return { ...p, hybridPending: true };
          });
          log.push(`🔬 [Vos] Nueva Teoría — Conectás 2 fósiles de distinto color/animal this turn.`);
          break;
        }
        case 'destroyLoose': {
          if (targetPlayerId === undefined || targetPlayerId === 0) break;
          newPlayers = newPlayers.map(p => {
            if (p.id !== targetPlayerId) return p;
            // Remove first non-protected, non-grouped card
            const idx = p.labCards.findIndex(c => !c.protected && !c.faceDown);
            if (idx === -1) return p;
            const removed = p.labCards[idx];
            const newLab = p.labCards.filter((_, i) => i !== idx);
            log.push(`📄 [Vos] Revisión de Pares — Destruida: ${removed.name} de ${state.players.find(pl => pl.id === targetPlayerId)?.name.split(' ')[0]}`);
            return { ...p, labCards: newLab };
          });
          break;
        }
        case 'massDiscard': {
          newPlayers = newPlayers.map(p => {
            const idx = p.labCards.findIndex(c => !c.protected && !c.faceDown);
            if (idx === -1) return p;
            const removed = p.labCards[idx];
            return { ...p, labCards: p.labCards.filter((_, i) => i !== idx) };
          });
          log.push(`🌧️ Lluvia Torrencial — Todos descartan 1 fósil incompleto no protegido.`);
          break;
        }
        case 'endGame': {
          if (state.currentCampaign < 3) {
            log.push(`⚠️ "Impacto de Meteorito" solo puede jugarse en la Campaña 3!`);
          } else {
            log.push(`☄️ ¡IMPACTO DE METEORITO! K-Pg. Todos a casa. Calculando Prestigio...`);
            const scores = newPlayers.map(p => ({
              id: p.id,
              name: p.name,
              score: calculatePrestige(p, state.subsidyActive),
            })).sort((a, b) => b.score - a.score);
            return { ...state, players: newPlayers, phase: 'scoring', scores, log };
          }
          break;
        }
        default: break;
      }

      return { ...state, players: newPlayers, log, selectedActionId: null, actionTarget: null };
    }

    case 'BOT_ACTIONS': {
      // Run bot action decisions
      let newPlayers = [...state.players];
      let log = [...state.log];
      for (const botId of BOT_IDS) {
        const bot = newPlayers[botId];
        const actionToPlay = botDecideAction(bot.actionHand, newPlayers, state.currentCampaign);
        if (!actionToPlay) continue;
        const newHand = bot.actionHand.filter(a => a.id !== actionToPlay.id);
        newPlayers[botId] = { ...bot, actionHand: newHand };
        log.push(`🎴 [${bot.name.split(' ')[0]}] jugó "${actionToPlay.name}"`);
      }
      return { ...state, players: newPlayers, log };
    }

    case 'CONFIRM_ACTIONS': {
      return { ...state, phase: 'prep' };
    }

    case 'CONFIRM_PREP': {
      // Move pending finds to lab
      let newPlayers = state.players.map(p => {
        if (!p.pendingFind || p.encajadasThisTurn) {
          return { ...p, pendingFind: null, encajadasThisTurn: false };
        }
        const card = p.pendingFind;
        return {
          ...p,
          labCards: [...p.labCards, card],
          pendingFind: null,
          encajadasThisTurn: false,
          blockedThisTurn: false,
        };
      });

      // Check completions for log
      const log = [...state.log];
      for (const p of newPlayers) {
        if (p.pendingFind === null && !p.encajadasThisTurn && p.labCards.length > 0) {
          // detect if any skeleton just completed (simple check)
        }
      }

      return { ...state, players: newPlayers, phase: 'pass', log };
    }

    case 'CONFIRM_PASS': {
      const { activeCondition, players } = state;
      const passRight = activeCondition?.effect === 'reversePass';

      // Rotate hands
      const hands = players.map(p => p.hand);
      let newHands;
      if (passRight) {
        newHands = [hands[1], hands[2], hands[3], hands[0]]; // right
      } else {
        newHands = [hands[3], hands[0], hands[1], hands[2]]; // left (default)
      }

      const newPlayers = players.map((p, i) => ({ ...p, hand: newHands[i] }));

      const newTurn = state.turnInCampaign + 1;
      if (newTurn > TURNS_PER_CAMPAIGN) {
        // Campaign over
        if (state.currentCampaign >= CAMPAIGNS) {
          // Game over — score
          const scores = newPlayers.map(p => ({
            id: p.id,
            name: p.name,
            score: calculatePrestige(p, state.subsidyActive),
          })).sort((a, b) => b.score - a.score);
          const log = [...state.log, `🏆 ¡Campaña 3 finalizada! Calculando Prestigio Académico...`];
          return { ...state, players: newPlayers, phase: 'scoring', scores, log };
        }
        const log = [...state.log, `📅 Campaña ${state.currentCampaign} completada. Preparando siguiente expedición...`];
        return { ...state, players: newPlayers, phase: 'setup', turnInCampaign: newTurn, log };
      }

      const passDir = passRight ? 'derecha ↩' : 'izquierda ↪';
      const log = [...state.log, `🤝 Manos pasadas hacia la ${passDir}.`];
      return { ...state, players: newPlayers, phase: 'draft', turnInCampaign: newTurn, log };
    }

    case 'RESTART': {
      return { ...INITIAL_STATE, phase: 'title', log: [] };
    }

    default:
      return state;
  }
}
