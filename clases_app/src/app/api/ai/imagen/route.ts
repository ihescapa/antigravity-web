import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const STYLE_PROMPTS: Record<string, string> = {
    japones: "Estilo japonés, dibujo con líneas de tinta finas y elegantes, coloreado con acuarela muy suave y sutil.",
    realista: "Fotografía fotorrealista macro de alta resolución, iluminación de estudio, fondo de estudio limpio.",
    ilustración: "Ilustración científica enciclopédica clásica, dibujo detallado.",
    esquema: "Diagrama técnico vectorial plano, diseño minimalista, clear and educational schema."
};

const BASE_PROMPT = "REQUISITO CRÍTICO: Genera el objeto central completamente aislado, flotando en el vacío. El fondo TIENE QUE SER OBLIGATORIAMENTE UN COLOR BLANCO PURO y LISO (hex #FFFFFF). NO agregues sombras proyectadas en el piso, ni gradientes, ni texturas de fondo, ni paisajes, ni viñetas. El sujeto debe tener bordes nítidos para facilitar su recorte como PNG transparente en edición automatizada. DIBUJA SOLO: ";

export async function POST(req: Request) {
    try {
        const { prompt, estilo } = await req.json();

        // Check if API keys exist
        if (!process.env.OPENAI_API_KEY) {
            console.warn("Falta OPENAI_API_KEY. Ignorando llamada real a DALL-E.");
            await new Promise(resolve => setTimeout(resolve, 2000));
            return NextResponse.json({ url: 'https://images.unsplash.com/photo-1544391496-1ca7c9745700?auto=format&fit=crop&q=80&w=800' });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const styleModifier = STYLE_PROMPTS[estilo as string] || STYLE_PROMPTS['japones'];
        const fullPrompt = `${BASE_PROMPT} ${prompt}. Aplicando este estilo visual estrictamente: ${styleModifier}. Recuerda: FONDO BLANCO PURO TOTALMENTE LIMPIO.`;

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: fullPrompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url",
        });

        if (!response.data || response.data.length === 0 || !response.data[0].url) {
            throw new Error("DALL-E no retornó una imagen válida");
        }

        return NextResponse.json({ url: response.data[0].url });
    } catch (error) {
        console.error('Error generando imagen AI:', error);
        return NextResponse.json({ error: 'Fallo al generar imagen', details: String(error) }, { status: 500 });
    }
}
