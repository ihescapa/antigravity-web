// ============================================================
// PlayerLab.jsx — Human's laboratory (placed fossils)
// ============================================================
import React from 'react';
import Card from './Card.jsx';
import { groupLabCards } from '../gameEngine/scoring.js';

const ERA_COLORS = {
  green: 'border-emerald-600 bg-emerald-50',
  orange: 'border-amber-600 bg-amber-50',
  purple: 'border-purple-600 bg-purple-50',
};

const ERA_HEADER = {
  green: 'bg-emerald-700 text-white',
  orange: 'bg-amber-700 text-white',
  purple: 'bg-purple-700 text-white',
};

const PART_ORDER = ['head','neck','neck1','neck2','body','tail','root','trunk','crown','single'];

function SkeletonGroup({ skeleton, selectedFossilId, onCardClick }) {
  const sortedCards = [...skeleton.cards].sort(
    (a, b) => PART_ORDER.indexOf(a.type) - PART_ORDER.indexOf(b.type)
  );
  const eraColor = skeleton.tmpl.eraColor;
  const isIncomplete = !skeleton.complete;
  const isHybrid = skeleton.hybrid;

  // Patagotitan Holotipo check
  let isHolotipo = false;
  if (skeleton.species === 'Patagotitan' && skeleton.complete) {
    const subTags = skeleton.cards.map(c => c.subTag).filter(Boolean);
    isHolotipo = subTags.length === skeleton.cards.length && new Set(subTags).size === 1;
  }

  return (
    <div className={`
      rounded-lg border-2 p-2 flex flex-col gap-1
      ${ERA_COLORS[eraColor] || 'border-stone-400 bg-stone-50'}
      ${isIncomplete ? 'opacity-70 border-dashed' : ''}
      ${isHolotipo ? 'ring-2 ring-yellow-400 shadow-yellow-200 shadow-lg' : ''}
    `}>
      <div className={`text-center text-[9px] font-display font-bold rounded px-1 py-0.5 ${ERA_HEADER[eraColor] || 'bg-stone-700 text-white'}`}>
        {skeleton.species}
        {isHolotipo && <span className="ml-1">⭐ HOLOTIPO</span>}
        {isHybrid && <span className="ml-1 text-blue-200">🔬 HÍBRIDO</span>}
        {isIncomplete && <span className="ml-1 text-red-200">⚠ INCOMPLETO</span>}
      </div>
      <div className="flex flex-row gap-1 flex-wrap">
        {sortedCards.map(card => (
          <Card
            key={card.id}
            card={card}
            small
            selected={selectedFossilId === card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            showProtected
          />
        ))}
      </div>
    </div>
  );
}

export default function PlayerLab({ labCards = [], hybridConnections = [], selectedFossilId, onCardClick }) {
  const normalCards = labCards.filter(c => !c.faceDown);
  const transitCards = labCards.filter(c => c.faceDown);
  const { skeletons, isolatedCards } = groupLabCards(normalCards, hybridConnections);

  return (
    <div className="flex flex-col gap-2">
      {/* Skeleton groups */}
      {skeletons.length > 0 && (
        <div className="flex flex-row flex-wrap gap-2">
          {skeletons.map((skel, i) => (
            <SkeletonGroup
              key={i}
              skeleton={skel}
              selectedFossilId={selectedFossilId}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      )}

      {/* Isolated + Transit cards */}
      {(isolatedCards.length > 0 || transitCards.length > 0) && (
        <div className="flex flex-row flex-wrap gap-1 bg-stone-200 rounded-lg p-2 border border-dashed border-stone-400">
          <div className="w-full text-[9px] font-field text-stone-500 mb-1">
            Fósiles sueltos / En tránsito
          </div>
          {isolatedCards.map(c => (
            <Card
              key={c.id} card={c} small
              selected={selectedFossilId === c.id}
              onClick={() => onCardClick && onCardClick(c.id)}
              showProtected
            />
          ))}
          {transitCards.map(c => (
            <div
              key={c.id}
              className="w-16 h-24 rounded-lg bg-stone-700 border-2 border-stone-500 flex flex-col items-center justify-center cursor-pointer shadow"
            >
              <span className="text-stone-400 text-[7px] font-field rotate-12 text-center leading-tight">EN TRÁNSITO<br/>1pt</span>
            </div>
          ))}
        </div>
      )}

      {labCards.length === 0 && (
        <div className="text-center text-stone-400 text-sm font-field py-4 border-2 border-dashed border-stone-300 rounded-lg">
          🦴 Tu laboratorio está vacío. ¡Empieza a excavar!
        </div>
      )}
    </div>
  );
}
