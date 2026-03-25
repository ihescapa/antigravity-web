// ============================================================
// CONDITION CARDS — 10 total
// Reveal 1 at start of each Campaign (Ronda)
// ============================================================

let _id = 1;
const id = () => `c${_id++}`;

const makeCondition = (count, name, effect, description) =>
  Array.from({ length: count }, () => ({ id: id(), name, effect, description }));

export const ALL_CONDITION_CARDS = [
  ...makeCondition(2, 'Viento Blanco', 'reversePass',
    'El draft se pasa hacia la DERECHA en lugar de la izquierda. Reorienta tu estrategia.'),

  ...makeCondition(2, 'Falta de Yeso', 'noLargeDino',
    'Nadie puede bajar piezas de Dino Grande este turno. Solo DinoSmall y Flora.'),

  ...makeCondition(2, 'Subsidio de la Agencia', 'doubleComplete',
    'Todos los esqueletos completos valen el DOBLE de puntos esta campaña.'),

  ...makeCondition(4, 'Día de Campo Perfecto', 'none',
    'Sin condiciones especiales. Viento suave, cielo despejado. A excavar.'),
]; // TOTAL: 2+2+2+4 = 10 ✓
