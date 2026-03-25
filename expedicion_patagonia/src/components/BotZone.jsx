// ============================================================
// BotZone.jsx — Compact bot area
// ============================================================
import React from 'react';
import Card from './Card.jsx';
import { groupLabCards } from '../gameEngine/scoring.js';

export default function BotZone({ player, compact = false }) {
  const { name, hand, actionHand, labCards = [], pendingFind, blockedThisTurn } = player;
  const normalCards = labCards.filter(c => !c.faceDown);
  const transitCards = labCards.filter(c => c.faceDown);
  const { skeletons, isolatedCards } = groupLabCards(normalCards);

  return (
    <div className="bg-stone-800 bg-opacity-80 rounded-xl p-2 border border-stone-600 flex flex-col gap-1.5 min-w-0">
      {/* Bot name */}
      <div className="flex items-center justify-between">
        <div className="font-display font-bold text-stone-200 text-xs truncate">
          🔬 {name}
        </div>
        <div className="flex items-center gap-1">
          {blockedThisTurn && (
            <span className="text-[9px] bg-red-700 text-white px-1 rounded font-field">🔒 Bloqueado</span>
          )}
          <span className="text-[10px] text-stone-400 font-field">🃏{hand.length} 🎴{actionHand.length}</span>
        </div>
      </div>

      {/* Face-down hand */}
      <div className="flex flex-row gap-1 flex-wrap">
        {hand.slice(0, compact ? 4 : 7).map((_, i) => (
          <div key={i} className="w-8 h-12 rounded bg-stone-700 border border-stone-500 flex-shrink-0" />
        ))}
        {hand.length > (compact ? 4 : 7) && (
          <div className="w-8 h-12 rounded bg-stone-600 border border-stone-500 flex items-center justify-center">
            <span className="text-stone-300 text-[8px]">+{hand.length - (compact ? 4 : 7)}</span>
          </div>
        )}
      </div>

      {/* Pending find */}
      {pendingFind && (
        <div className="mt-1">
          <div className="text-[8px] text-stone-400 font-field mb-0.5">Hallazgo pendiente:</div>
          <Card card={pendingFind} small />
        </div>
      )}

      {/* Bot lab (compact) */}
      {labCards.length > 0 && (
        <div className="mt-1 border-t border-stone-600 pt-1">
          <div className="text-[8px] text-stone-400 font-field mb-1">Laboratorio ({labCards.length} fósiles):</div>
          <div className="flex flex-wrap gap-0.5">
            {/* Show skeletons as compact groups */}
            {skeletons.map((sk, i) => (
              <div
                key={i}
                className={`
                  text-[7px] font-field px-1.5 py-0.5 rounded font-bold
                  ${sk.complete ? 'bg-green-700 text-green-100' : 'bg-stone-600 text-stone-300'}
                `}
              >
                {sk.complete ? '✓' : '…'} {sk.species.split(' ')[0]} ({sk.cards.length})
              </div>
            ))}
            {isolatedCards.length > 0 && (
              <div className="text-[7px] font-field px-1.5 py-0.5 rounded bg-stone-600 text-stone-400">
                +{isolatedCards.length} sueltos
              </div>
            )}
            {transitCards.length > 0 && (
              <div className="text-[7px] font-field px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                🔒 {transitCards.length} en tránsito
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
