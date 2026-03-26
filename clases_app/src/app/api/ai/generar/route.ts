import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // En una implementación real, aquí llamaríamos a OpenAI/Anthropic.
        // Simulamos una respuesta "inteligente" basada en palabras clave:

        const lowPrompt = prompt.toLowerCase();
        const bloques = [];

        if (lowPrompt.includes('intro') || lowPrompt.includes('introducción')) {
            bloques.push({
                tipo: 'texto-intro',
                propiedades: {
                    titulo: 'Introducción del Tema',
                    contenido: `Basado en tu prompt "${prompt}", he generado esta sección introductoria que explica los conceptos fundamentales.`
                }
            });
        }

        if (lowPrompt.includes('quiz') || lowPrompt.includes('pregunta')) {
            bloques.push({
                tipo: 'quiz',
                propiedades: {
                    pregunta: '¿Cuál es el concepto central discutido en esta sección?',
                    opciones: [
                        { texto: 'Concepto A (Correcto)', correcta: true, explicacion: 'Es la base de la teoría.' },
                        { texto: 'Concepto B', correcta: false, explicacion: 'Este es un tema secundario.' },
                        { texto: 'Concepto C', correcta: false, explicacion: 'No se menciona en el texto.' }
                    ]
                }
            });
        }

        if (bloques.length === 0) {
            // Default blocks if no keywords matched
            bloques.push({
                tipo: 'texto-intro',
                propiedades: {
                    titulo: 'Esquema de Contenido',
                    contenido: `He analizado tu pedido: "${prompt}". Aquí tienes una estructura base para desarrollar.`
                }
            });
        }

        return NextResponse.json({ bloques });
    } catch (error) {
        return NextResponse.json({ error: 'Error processing AI request' }, { status: 500 });
    }
}
