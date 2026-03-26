import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import type { Clase } from '@/types/clase';

const DATA_DIR = path.join(process.cwd(), 'data', 'clases');

function getAllClases(): Clase[] {
    if (!fs.existsSync(DATA_DIR)) return [];
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return files
        .map(file => {
            const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
            return JSON.parse(content) as Clase;
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function GET() {
    try {
        const clases = getAllClases();
        return NextResponse.json(clases);
    } catch {
        return NextResponse.json({ error: 'Error al leer clases' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'docente') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        const body = await request.json();
        const now = new Date().toISOString();
        const nuevaClase: Clase = {
            id: `clase-${uuidv4().slice(0, 8)}`,
            titulo: body.titulo || 'Nueva clase',
            subtitulo: body.subtitulo || '',
            materia: body.materia || '',
            resumen: body.resumen || '',
            objetivos: body.objetivos || [],
            etiquetas: body.etiquetas || [],
            portada: body.portada || '',
            autor: body.autor || '',
            createdAt: now,
            updatedAt: now,
            estado: body.estado || 'borrador',
            bloques: body.bloques || [],
        };

        const filePath = path.join(DATA_DIR, `${nuevaClase.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(nuevaClase, null, 2), 'utf-8');

        return NextResponse.json(nuevaClase, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Error al crear clase' }, { status: 500 });
    }
}
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'docente') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const materia = searchParams.get('materia');
        console.log(`API: Intentando eliminar materia: "${materia}"`);

        if (!materia) {
            return NextResponse.json({ error: 'Falta el parámetro materia' }, { status: 400 });
        }

        const clases = getAllClases();
        const clasesABorrar = clases.filter(c => c.materia === materia);
        console.log(`API: Encontradas ${clasesABorrar.length} clases para borrar de la materia "${materia}"`);

        if (clasesABorrar.length === 0) {
            return NextResponse.json({ message: 'No hay clases vinculadas a esta materia' });
        }

        clasesABorrar.forEach(clase => {
            const filePath = path.join(DATA_DIR, `${clase.id}.json`);
            if (fs.existsSync(filePath)) {
                console.log(`API: Borrando archivo: ${filePath}`);
                fs.unlinkSync(filePath);
            } else {
                console.error(`API: El archivo no existe: ${filePath}`);
            }
        });

        return NextResponse.json({
            success: true,
            deletedCount: clasesABorrar.length,
            message: `Se eliminaron ${clasesABorrar.length} clases de la materia ${materia}`
        });
    } catch (error) {
        console.error('Error al eliminar materia:', error);
        return NextResponse.json({ error: 'Error al eliminar la materia' }, { status: 500 });
    }
}
