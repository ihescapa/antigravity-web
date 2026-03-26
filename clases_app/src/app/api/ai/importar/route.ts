import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { texto } = await req.json();

        if (!texto) {
            return NextResponse.json({ error: 'El campo texto es requerido' }, { status: 400 });
        }

        // Simulación: en el futuro esto se conecta a GPT-4 para parsear el texto y transformarlo
        // en bloques interactivos. Promt de ejemplo para la IA:
        // "Lee este texto fuente y divídelo en segmentos lógicos. Transforma definiciones en 'tarjetas',
        // enumeraciones en listados o 'acordeon' y el texto principal en 'texto-columnas'".

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock response simulando la compresión y estructura
        const palabras = texto.split(' ').slice(0, 15).join(' ') + '...';

        const mockResult = [
            {
                tipo: 'texto-columnas',
                propiedades: {
                    titulo: 'Contexto Importado',
                    columnaIzquierda: 'Fragmento de la fuente: ' + palabras,
                    columnaDerecha: 'Hemos importado esta sección clave para estudiarla en detalle durante esta etapa de la clase.'
                }
            },
            {
                tipo: 'tarjetas',
                propiedades: {
                    titulo: 'Conceptos Resaltados de la Fuente',
                    tarjetas: [
                        { titulo: 'Idea 1', contenido: 'Basada en el texto original, este concepto destaca por su relevancia empírica.' },
                        { titulo: 'Idea 2', contenido: 'Una reflexión secundaria que se deriva explícitamente de la lectura de la fuente.' }
                    ]
                }
            },
            {
                tipo: 'quiz',
                propiedades: {
                    pregunta: 'Basado en el texto importado, ¿cuál es una afirmación correcta?',
                    opciones: [
                        { texto: 'La primera idea es principal', correcta: true },
                        { texto: 'El texto no define ningún concepto clave', correcta: false }
                    ]
                }
            }
        ];

        return NextResponse.json({ bloques: mockResult });
    } catch (error) {
        console.error('Error in importar API:', error);
        return NextResponse.json({ error: 'Fallo al procesar la importación' }, { status: 500 });
    }
}
