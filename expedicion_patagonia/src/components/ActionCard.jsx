// ============================================================
// ActionCard.jsx — Action ("Gajes del Oficio") card visual
// ============================================================
import React from 'react';

const EFFECT_CONFIG = {
  protect:        { icon: '🧱', color: 'border-stone-500 bg-stone-50',  header: 'bg-stone-700' },
  blockDraft:     { icon: '🔒', color: 'border-red-500 bg-red-50',      header: 'bg-red-800' },
  skipReveal:     { icon: '🚛', color: 'border-orange-500 bg-orange-50',header: 'bg-orange-800' },
  hybridConnect:  { icon: '🔬', color: 'border-blue-500 bg-blue-50',    header: 'bg-blue-800' },
  destroyLoose:   { icon: '📄', color: 'border-yellow-600 bg-yellow-50',header: 'bg-yellow-700' },
  massDiscard:    { icon: '🌧️', color: 'border-slate-500 bg-slate-100', header: 'bg-slate-700' },
  endGame:        { icon: '☄️', color: 'border-red-700 bg-red-100',     header: 'bg-red-900' },
};

export default function ActionCard({ card, selected, onClick, small = false }) {
  const cfg = EFFECT_CONFIG[card.effectType] || EFFECT_CONFIG.protect;
  const selectedRing = selected ? 'ring-4 ring-yellow-400 ring-offset-1 scale-105' : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${small ? 'w-16 h-24' : 'w-24 h-36'} rounded-lg border-2 ${cfg.color}
        flex flex-col cursor-pointer shadow-md hover:shadow-lg
        transition-all duration-200 hover:-translate-y-1 flex-shrink-0 ${selectedRing}
        overflow-hidden
      `}
    >
      <div className={`${cfg.header} px-1 py-0.5 text-center text-white font-field text-[7px]`}>
        GAJES DEL OFICIO
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-1 gap-1">
        <div className="text-xl">{cfg.icon}</div>
        <div className={`text-center font-display font-bold leading-tight ${small ? 'text-[7px]' : 'text-[8px]'} text-stone-800`}>
          {card.name}
        </div>
      </div>
      {!small && (
        <div className="px-1 pb-1">
          <p className="text-[6px] text-stone-500 font-field italic text-center leading-tight">
            {card.lore}
          </p>
        </div>
      )}
    </div>
  );
}
