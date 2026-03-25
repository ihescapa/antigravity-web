// ============================================================
// GameLog.jsx — Scrollable campaign diary
// ============================================================
import React, { useEffect, useRef } from 'react';

const getLineStyle = (line) => {
  if (line.startsWith('📋') || line.startsWith('🏕️')) return 'text-amber-300 font-bold';
  if (line.startsWith('🌦️')) return 'text-sky-300';
  if (line.startsWith('⛏️')) return 'text-stone-300';
  if (line.startsWith('☄️') || line.startsWith('🏆')) return 'text-red-300 font-bold';
  if (line.startsWith('🔒') || line.startsWith('🚛') || line.startsWith('📄')) return 'text-orange-300';
  if (line.startsWith('🔬') || line.startsWith('🧱')) return 'text-blue-300';
  if (line.startsWith('🌧️')) return 'text-slate-300';
  if (line.startsWith('🎴')) return 'text-purple-300';
  if (line.startsWith('⭐') || line.startsWith('✅')) return 'text-yellow-300 font-bold';
  if (line.startsWith('⚠️')) return 'text-red-400';
  if (line.startsWith('📅') || line.startsWith('🤝')) return 'text-stone-400';
  return 'text-stone-400';
};

export default function GameLog({ log = [] }) {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="flex flex-col h-full bg-stone-900 rounded-xl border border-stone-700 overflow-hidden">
      <div className="bg-stone-800 px-3 py-1.5 border-b border-stone-700">
        <span className="font-display font-bold text-amber-300 text-sm">📓 Diario de Campaña</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 font-field text-xs">
        {log.map((line, i) => (
          <div key={i} className={`leading-snug ${getLineStyle(line)} ${line === '' ? 'h-2' : ''}`}>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
