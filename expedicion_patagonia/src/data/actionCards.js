// ============================================================
// ACTION CARDS ("Gajes del Oficio") — 50 total
// ============================================================

let _id = 1;
const id = () => `a${_id++}`;

const makeActions = (count, name, effectType, description, lore) =>
  Array.from({ length: count }, () => ({ id: id(), name, effectType, description, lore }));

export const ALL_ACTION_CARDS = [
  ...makeActions(10, 'Armar el Bochón', 'protect',
    'Protege un fósil tuyo de ser destruido. Colócalo boca arriba con una ficha de yeso.',
    '"El yeso salva huesos... y reputaciones."'),

  ...makeActions(10, 'Tranquera con Candado', 'blockDraft',
    'Elige a un colega. Su carta de draft de este turno queda boca abajo en su mesa como "Fósil en Tránsito". Vale 1 pt al final.',
    '"No pudiste acceder, lo dejás tapado para la próxima campaña."'),

  ...makeActions(5, 'Camioneta Encajada', 'skipReveal',
    'Un colega de tu elección se saltea la fase de revelación este turno.',
    '"La F-100 enterrada hasta los ejes. Otra vez."'),

  ...makeActions(15, 'Nueva Teoría', 'hybridConnect',
    'Conecta legalmente 2 fósiles de distinto color o animal. Son contados individualmente, sin bonus de 20 pts.',
    '"Publicamos igual. Peer review es para los débiles."'),

  ...makeActions(5, 'Revisión de Pares', 'destroyLoose',
    'Destruye una carta de fósil suelta (no-esqueleto) de la mesa de un colega.',
    '"Rechazo con comentarios. Carta descartada."'),

  ...makeActions(3, 'Lluvia Torrencial', 'massDiscard',
    'Todos los jugadores descartan 1 fósil incompleto no protegido de su laboratorio.',
    '"Tres días de lluvia. Las trincheras se llenaron."'),

  ...makeActions(2, 'Impacto de Meteorito', 'endGame',
    '¡Termina el juego inmediatamente! SOLO se puede jugar durante la Campaña 3.',
    '"K-Pg. Todos a casa. El que esté completo, gana."'),
]; // TOTAL: 10+10+5+15+5+3+2 = 50 ✓
