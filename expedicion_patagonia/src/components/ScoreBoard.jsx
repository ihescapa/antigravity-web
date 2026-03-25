// ============================================================
// ScoreBoard.jsx — End-game prestige results
// ============================================================
import React from 'react';

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣'];

export default function ScoreBoard({ scores, players, onRestart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="font-display text-4xl font-bold text-amber-300 mb-2">
            Prestigio Académico Final
          </h1>
          <p className="font-field text-stone-400 text-sm">
            Expedición Patagonia: Caos Fósil — Resultados
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {scores.map((s, rank) => {
            const player = players.find(p => p.id === s.id);
            const transitCount = player?.labCards.filter(c => c.faceDown).length || 0;
            const completedCount = player?.labCards.filter(c => !c.faceDown).length || 0;

            return (
              <div
                key={s.id}
                className={`
                  flex items-center gap-4 rounded-xl p-4 border
                  ${rank === 0
                    ? 'bg-amber-900 border-amber-500 shadow-lg shadow-amber-900'
                    : 'bg-stone-800 border-stone-600'}
                  animate-fade-in
                `}
                style={{ animationDelay: `${rank * 0.15}s` }}
              >
                <div className="text-3xl w-12 text-center">{MEDALS[rank]}</div>
                <div className="flex-1">
                  <div className={`font-display font-bold text-lg ${rank === 0 ? 'text-amber-200' : 'text-stone-200'}`}>
                    {s.name}
                  </div>
                  <div className="font-field text-xs text-stone-400 mt-0.5">
                    {completedCount} fósiles en lab · {transitCount} en tránsito
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-display font-bold text-3xl ${rank === 0 ? 'text-amber-300' : 'text-stone-300'}`}>
                    {s.score}
                  </div>
                  <div className="font-field text-xs text-stone-400">prestige pts</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-stone-800 rounded-xl p-4 mb-6 border border-stone-600">
          <h3 className="font-display font-bold text-stone-300 mb-2 text-sm">📊 Tabla de Puntuación</h3>
          <div className="font-field text-xs text-stone-400 space-y-1">
            <div>• Fósil suelto / en tránsito: <span className="text-white">1 pt</span></div>
            <div>• DinoSmall / Flora completo: <span className="text-white">cartas × 2</span></div>
            <div>• DinoGrande completo: <span className="text-white">20 bonus + 1/carta</span></div>
            <div>• DinoGrande incompleto: <span className="text-red-400">0 pts (Extinción)</span></div>
            <div>• Híbrido (Nueva Teoría): <span className="text-blue-300">suma individual, sin bonus</span></div>
            <div>• ⭐ Holotipo Perfecto (Patagotitan mismo estrato): <span className="text-yellow-300">× 2</span></div>
            <div>• 📑 Subsidio activo: <span className="text-green-300">× 2 en completos</span></div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onRestart}
            className="bg-amber-700 hover:bg-amber-600 text-white font-display font-bold text-lg px-8 py-3 rounded-xl shadow-lg transition-colors duration-200"
          >
            🔁 Nueva Expedición
          </button>
        </div>
      </div>
    </div>
  );
}
