// ============================================================
// App.jsx — Main application, game loop, UI composition
// ============================================================
import React, { useReducer, useEffect, useRef } from 'react';
import { gameReducer, INITIAL_STATE } from './gameEngine/gameReducer.js';
import Card from './components/Card.jsx';
import ActionCard from './components/ActionCard.jsx';
import PlayerLab from './components/PlayerLab.jsx';
import BotZone from './components/BotZone.jsx';
import GameLog from './components/GameLog.jsx';
import ScoreBoard from './components/ScoreBoard.jsx';

// ─── CONDITION BANNER ──────────────────────────────────────
const CONDITION_ICONS = {
  reversePass:    { icon: '🌬️', color: 'bg-sky-800 border-sky-500 text-sky-200' },
  noLargeDino:    { icon: '⛔', color: 'bg-red-900 border-red-600 text-red-200' },
  doubleComplete: { icon: '💰', color: 'bg-green-900 border-green-600 text-green-200' },
  none:           { icon: '☀️', color: 'bg-amber-900 border-amber-600 text-amber-200' },
};

function ConditionBanner({ condition }) {
  if (!condition) return null;
  const cfg = CONDITION_ICONS[condition.effect] || CONDITION_ICONS.none;
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${cfg.color} animate-fade-in`}>
      <span className="text-xl">{cfg.icon}</span>
      <div>
        <div className="font-display font-bold text-sm">{condition.name}</div>
        <div className="font-field text-xs opacity-80">{condition.description}</div>
      </div>
    </div>
  );
}

// ─── PHASE INDICATOR ───────────────────────────────────────
const PHASES = {
  setup:   { label: 'Inicio de Campaña', color: 'bg-amber-700', icon: '🏕️' },
  draft:   { label: 'Excavación (Elegí tu carta)', color: 'bg-emerald-700', icon: '⛏️' },
  actions: { label: 'Gajes del Oficio (Acciones)', color: 'bg-blue-700', icon: '🎴' },
  prep:    { label: 'Preparación (Mover al Lab)', color: 'bg-purple-700', icon: '🔬' },
  pass:    { label: 'El Pase (Rotar manos)', color: 'bg-stone-700', icon: '🤝' },
  scoring: { label: 'Prestigio Académico', color: 'bg-red-800', icon: '🏆' },
};

// ─── ACTION TARGET SELECTOR ────────────────────────────────
function ActionTargetSelector({ players, onSelect, onCancel, requiresTarget }) {
  if (!requiresTarget) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-xl p-6 border border-stone-600 max-w-sm w-full">
        <h3 className="font-display font-bold text-amber-300 text-lg mb-4">¿A quién aplicar?</h3>
        <div className="space-y-2">
          {players.filter(p => !p.isHuman).map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full bg-stone-700 hover:bg-stone-600 text-stone-200 font-field text-sm rounded-lg py-2 px-4 text-left transition-colors"
            >
              🔬 {p.name}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-3 w-full bg-red-900 hover:bg-red-800 text-red-200 font-field text-xs rounded py-1.5 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── TITLE SCREEN ─────────────────────────────────────────
function TitleScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 flex items-center justify-center overflow-hidden relative">
      {/* Background deco */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🦕','🦴','🌿','🦎','⛏️','📓'].map((e, i) => (
          <div
            key={i}
            className="absolute text-5xl opacity-5 animate-bounce-slow"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.4}s` }}
          >
            {e}
          </div>
        ))}
      </div>

      <div className="text-center max-w-xl px-8 relative z-10">
        <div className="text-7xl mb-4 animate-bounce-slow">🦕</div>
        <h1 className="font-display text-5xl font-bold text-amber-300 leading-tight mb-2">
          Expedición Patagonia
        </h1>
        <h2 className="font-display text-2xl text-amber-500 italic mb-6">
          Caos Fósil
        </h2>
        <p className="font-field text-stone-400 text-sm mb-2 leading-relaxed">
          Un simulador realista (y humorístico) de campañas paleontológicas en la Patagonia Argentina.
          Competí contra 3 colegas en un draft de 3 campañas. Excava, clasifica, publicá y sobrevivís
          a la tranquera del dueño de la estancia.
        </p>
        <div className="flex gap-3 justify-center my-4 flex-wrap text-xs font-field text-stone-500">
          <span>🟢 Jurásico: Cañadón Asfalto</span>
          <span>🟠 Cret. Medio: Grupo Chubut</span>
          <span>🟣 Cret. Superior: La Colonia</span>
        </div>
        <button
          onClick={onStart}
          id="start-game-btn"
          className="mt-4 bg-amber-700 hover:bg-amber-600 active:scale-95 text-white font-display font-bold text-xl px-10 py-4 rounded-2xl shadow-lg shadow-amber-900 transition-all duration-200"
        >
          ⛏️ ¡A Campo!
        </button>
        <p className="mt-4 text-stone-600 font-field text-xs">
          126 fósiles · 50 acciones · 10 condiciones · 3 campañas
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(gameReducer, { ...INITIAL_STATE, phase: 'title' });
  const {
    phase, currentCampaign, turnInCampaign, players, activeCondition,
    log, scores, selectedFossilId, selectedActionId, subsidyActive, fossilDeck,
  } = state;

  const human = players[0];
  const bots = players.slice(1);

  // Pending action target selection
  const [pendingAction, setPendingAction] = React.useState(null); // { cardId, requiresTarget }
  const TARGETED_EFFECTS = ['blockDraft', 'skipReveal', 'destroyLoose'];

  function handleSelectAction(cardId) {
    const card = human?.actionHand.find(a => a.id === cardId);
    if (!card) return;
    if (TARGETED_EFFECTS.includes(card.effectType)) {
      setPendingAction({ cardId, requiresTarget: true });
    } else {
      dispatch({ type: 'PLAY_ACTION', cardId, targetPlayerId: undefined });
    }
  }

  function handleTargetConfirm(playerId) {
    dispatch({ type: 'PLAY_ACTION', cardId: pendingAction.cardId, targetPlayerId: playerId });
    setPendingAction(null);
  }

  function handleConfirmPhase() {
    if (phase === 'setup') {
      dispatch({ type: 'START_CAMPAIGN' });
    } else if (phase === 'draft') {
      if (!selectedFossilId && human.hand.length > 0) return; // must pick
      dispatch({ type: 'CONFIRM_DRAFT' });
      // Run bot actions immediately after draft
      setTimeout(() => dispatch({ type: 'BOT_ACTIONS' }), 100);
    } else if (phase === 'actions') {
      dispatch({ type: 'CONFIRM_ACTIONS' });
    } else if (phase === 'prep') {
      dispatch({ type: 'CONFIRM_PREP' });
    } else if (phase === 'pass') {
      dispatch({ type: 'CONFIRM_PASS' });
    }
  }

  const phaseConfig = PHASES[phase] || PHASES.setup;
  const canConfirm =
    phase === 'setup' ||
    (phase === 'draft' && (!!selectedFossilId || human?.hand.length === 0)) ||
    phase === 'actions' ||
    phase === 'prep' ||
    phase === 'pass';

  if (phase === 'title') {
    return <TitleScreen onStart={() => dispatch({ type: 'START_GAME' })} />;
  }

  if (phase === 'scoring') {
    return <ScoreBoard scores={scores} players={players} onRestart={() => dispatch({ type: 'RESTART' })} />;
  }

  return (
    <div className="min-h-screen bg-[#e6d5b8] font-sans flex flex-col" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")" }}>
      {/* TOP BAR */}
      <div className="bg-stone-900 text-stone-200 px-4 py-2 flex items-center gap-4 flex-wrap shadow-lg">
        <div className="font-display font-bold text-lg text-amber-300">🦕 Expedición Patagonia</div>
        <div className={`${phaseConfig.color} px-3 py-0.5 rounded-full font-field text-white text-xs font-bold`}>
          {phaseConfig.icon} {phaseConfig.label}
        </div>
        <div className="font-field text-stone-400 text-xs">
          Campaña {currentCampaign}/3 · Turno {turnInCampaign}/7
        </div>
        {subsidyActive && (
          <div className="bg-green-800 text-green-200 px-2 py-0.5 rounded font-field text-xs">
            💰 Subsidio x2 Activo
          </div>
        )}
        <div className="ml-auto font-field text-stone-500 text-xs">
          🃏 {fossilDeck?.length ?? 0} fósiles restantes
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ minHeight: 0 }}>
        {/* BOT + LOG ROW */}
        <div className="flex gap-3 p-3 pb-0">
          {/* Three bot zones */}
          <div className="flex-1 grid grid-cols-3 gap-2">
            {bots.map(bot => (
              <BotZone key={bot.id} player={bot} />
            ))}
          </div>
          {/* Game log — right column */}
          <div className="w-64 flex-shrink-0" style={{ height: '220px' }}>
            <GameLog log={log} />
          </div>
        </div>

        {/* CENTER: Condition + Phase Control */}
        <div className="flex gap-3 px-3 py-2 items-start">
          <div className="flex-1">
            {activeCondition && <ConditionBanner condition={activeCondition} />}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              id="confirm-phase-btn"
              onClick={handleConfirmPhase}
              disabled={!canConfirm}
              className={`
                font-display font-bold px-6 py-2.5 rounded-xl shadow-md text-white text-sm
                transition-all duration-200
                ${canConfirm
                  ? 'bg-amber-700 hover:bg-amber-600 active:scale-95 cursor-pointer shadow-amber-900'
                  : 'bg-stone-500 cursor-not-allowed opacity-60'}
              `}
            >
              {phase === 'setup' && '🏕️ Iniciar Campaña'}
              {phase === 'draft' && '⛏️ Confirmar Hallazgo'}
              {phase === 'actions' && '✅ Terminar Gajes'}
              {phase === 'prep' && '🔬 Mover al Laboratorio'}
              {phase === 'pass' && '🤝 Pasar Manos →'}
            </button>
            {phase === 'draft' && !selectedFossilId && human?.hand.length > 0 && (
              <div className="text-xs text-amber-700 font-field animate-pulse">
                ← Hace clic en una carta para seleccionarla
              </div>
            )}
          </div>
        </div>

        {/* HUMAN ZONE */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-3" style={{ minHeight: 0 }}>

          {/* Lab */}
          <div className="bg-stone-100 bg-opacity-80 rounded-xl p-3 border border-stone-300 shadow-inner">
            <div className="font-display font-bold text-stone-700 text-sm mb-2">
              🔬 Mi Laboratorio
            </div>
            <PlayerLab
              labCards={human?.labCards || []}
              hybridConnections={human?.hybridConnections || []}
            />
          </div>

          {/* Pending find preview */}
          {human?.pendingFind && (
            <div className="bg-amber-100 rounded-xl p-3 border-2 border-amber-400 shadow">
              <div className="font-display font-bold text-amber-800 text-sm mb-1">⏳ Hallazgo Pendiente</div>
              <div className="flex gap-2">
                <Card card={human.pendingFind} />
                <p className="font-field text-xs text-amber-700 self-center">
                  Esta carta se moverá al laboratorio cuando confirmes la Preparación.
                </p>
              </div>
            </div>
          )}

          {/* Draft Hand */}
          {phase === 'draft' && human?.hand.length > 0 && (
            <div className="bg-white bg-opacity-80 rounded-xl p-3 border border-stone-300 shadow">
              <div className="font-display font-bold text-stone-700 text-sm mb-2">
                ⛏️ Mano de Excavación ({human.hand.length} cartas)
              </div>
              <div className="flex flex-row gap-2 overflow-x-auto pb-1">
                {human.hand.map(card => (
                  <Card
                    key={card.id}
                    card={card}
                    selected={selectedFossilId === card.id}
                    onClick={() => dispatch({ type: 'SELECT_FOSSIL', cardId: card.id })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Hand */}
          {human?.actionHand.length > 0 && (
            <div className="bg-white bg-opacity-80 rounded-xl p-3 border border-stone-300 shadow">
              <div className="font-display font-bold text-stone-700 text-sm mb-2">
                🎴 Mano de Herramientas — Gajes del Oficio ({human.actionHand.length})
              </div>
              <div className="flex flex-row gap-2 overflow-x-auto pb-1">
                {human.actionHand.map(card => (
                  <ActionCard
                    key={card.id}
                    card={card}
                    selected={selectedActionId === card.id}
                    onClick={() => phase === 'actions' && handleSelectAction(card.id)}
                  />
                ))}
              </div>
              {phase !== 'actions' && (
                <p className="text-xs text-stone-400 font-field mt-1">
                  Las cartas de acción solo se pueden jugar durante la fase de Gajes del Oficio.
                </p>
              )}
            </div>
          )}

          {/* Rules reminder during setup */}
          {phase === 'setup' && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-300">
              <h3 className="font-display font-bold text-amber-800 mb-2">📋 Reglas Rápidas</h3>
              <div className="font-field text-xs text-stone-600 grid grid-cols-2 gap-x-4 gap-y-1">
                <div>🦕 DinoGrande completo: 20 bonus + 1/carta</div>
                <div>🦕 DinoGrande incompleto: 0 pts (Extinción)</div>
                <div>🦎 DinoSmall / Flora: base × 2</div>
                <div>🔬 Híbrido (Nueva Teoría): suma sin bonus</div>
                <div>☄️ Meteorito: solo en Campaña 3</div>
                <div>⭐ Holotipo Patagotitan: mismo estrato → ×2</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action target modal */}
      {pendingAction?.requiresTarget && (
        <ActionTargetSelector
          players={players}
          onSelect={handleTargetConfirm}
          onCancel={() => setPendingAction(null)}
          requiresTarget
        />
      )}
    </div>
  );
}
