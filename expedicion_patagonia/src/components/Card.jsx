// ============================================================
// Card.jsx — Fossil card visual
// ============================================================
import React from 'react';

const ERA_CONFIG = {
  green: {
    border: 'border-emerald-700',
    bg: 'bg-emerald-50',
    header: 'bg-emerald-800',
    text: 'text-emerald-900',
    badge: 'bg-emerald-200 text-emerald-900',
    era: 'Jurásico',
    dot: 'bg-emerald-500',
  },
  orange: {
    border: 'border-amber-700',
    bg: 'bg-amber-50',
    header: 'bg-amber-800',
    text: 'text-amber-900',
    badge: 'bg-amber-200 text-amber-900',
    era: 'Cretácico Med.',
    dot: 'bg-amber-500',
  },
  purple: {
    border: 'border-purple-700',
    bg: 'bg-purple-50',
    header: 'bg-purple-800',
    text: 'text-purple-900',
    badge: 'bg-purple-200 text-purple-900',
    era: 'Cretácico Sup.',
    dot: 'bg-purple-500',
  },
};

const SUBTAG_COLORS = {
  Rojo: 'bg-red-500 text-white',
  Amarillo: 'bg-yellow-400 text-yellow-900',
  Verde: 'bg-green-500 text-white',
};

const TYPE_LABELS = {
  head: '🦷 Cráneo',
  neck: '🦴 Cuello',
  neck1: '🦴 Cuello I',
  neck2: '🦴 Cuello II',
  body: '🦴 Cuerpo',
  tail: '🦴 Cola',
  root: '🌿 Raíz',
  trunk: '🪵 Tronco',
  crown: '🌳 Copa',
  single: '🔎 Hallazgo',
};

const ANIMAL_ICONS = {
  dinoLarge: '🦕',
  dinoSmall: '🦎',
  flora: '🌿',
};

export default function Card({ card, selected, onClick, small = false, faceDown = false, showProtected = false }) {
  if (faceDown) {
    return (
      <div
        onClick={onClick}
        className={`
          ${small ? 'w-16 h-22' : 'w-24 h-36'} rounded-lg border-2 border-stone-600
          bg-gradient-to-br from-stone-700 to-stone-900 cursor-pointer
          flex items-center justify-center shadow-md flex-shrink-0
        `}
      >
        <span className="text-stone-400 text-xs font-field rotate-12 opacity-60">FÓSIL</span>
      </div>
    );
  }

  const cfg = ERA_CONFIG[card.eraColor] || ERA_CONFIG.green;
  const selectedRing = selected ? 'ring-4 ring-yellow-400 ring-offset-2 animate-pulse-glow scale-105' : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${small ? 'w-16 h-24' : 'w-24 h-36'} rounded-lg border-2 ${cfg.border} ${cfg.bg}
        flex flex-col cursor-pointer shadow-md hover:shadow-lg
        transition-all duration-200 hover:-translate-y-1 flex-shrink-0
        relative overflow-hidden ${selectedRing}
        ${showProtected && card.protected ? 'opacity-80' : ''}
      `}
    >
      {/* Era header bar */}
      <div className={`${cfg.header} px-1 py-0.5 flex items-center justify-between`}>
        <span className="text-white font-field text-[8px] leading-tight truncate">
          {ANIMAL_ICONS[card.animalType]} {card.eraColor === 'green' ? 'JUR' : card.eraColor === 'orange' ? 'CRE-M' : 'CRE-S'}
        </span>
        {card.subTag && (
          <span className={`text-[7px] font-bold px-1 rounded ${SUBTAG_COLORS[card.subTag]}`}>
            {card.subTag}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex-1 flex flex-col items-center justify-center p-1 gap-0.5">
        <div className={`text-center font-display font-bold leading-tight ${small ? 'text-[7px]' : 'text-[9px]'} ${cfg.text}`}>
          {card.name}
        </div>
        <div className={`text-center font-field ${small ? 'text-[6px]' : 'text-[8px]'} text-stone-500`}>
          {TYPE_LABELS[card.type] || card.type}
        </div>
      </div>

      {/* Footer: era */}
      <div className={`${cfg.badge} text-center text-[7px] font-field px-1 py-0.5 leading-tight`}>
        {cfg.era}
      </div>

      {/* Protected overlay */}
      {card.protected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl opacity-30">🧱</span>
        </div>
      )}

      {/* Face-down overlay if faceDown prop set but card provided */}
      {card.faceDown && (
        <div className="absolute inset-0 bg-stone-800 rounded-lg flex items-center justify-center">
          <span className="text-stone-400 text-xs font-field rotate-12 opacity-80">EN TRÁNSITO</span>
        </div>
      )}
    </div>
  );
}
