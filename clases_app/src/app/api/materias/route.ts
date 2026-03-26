import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MATERIAS_FILE = path.join(process.cwd(), 'data', 'materias.json');

// Initialize with the 3 official subjects if it doesn't exist
const DEFAULT_MATERIAS = [
    { id: 'mat-1', nombre: 'Herramientas Digitales', color: '#2C5F8A' },
    { id: 'mat-2', nombre: 'Valle Gondwana', color: '#E8A833' },
    { id: 'mat-3', nombre: 'Cultura Digital', color: '#4A5568' }
];

function getMaterias() {
    if (!fs.existsSync(MATERIAS_FILE)) {
        if (!fs.existsSync(path.dirname(MATERIAS_FILE))) {
            fs.mkdirSync(path.dirname(MATERIAS_FILE), { recursive: true });
        }
        fs.writeFileSync(MATERIAS_FILE, JSON.stringify(DEFAULT_MATERIAS, null, 2));
        return DEFAULT_MATERIAS;
    }
    return JSON.parse(fs.readFileSync(MATERIAS_FILE, 'utf-8'));
}

export async function GET() {
    try {
        const materias = getMaterias();
        return NextResponse.json(materias);
    } catch (error) {
        return NextResponse.json({ error: 'Error leyendo materias' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nombre, color } = body;

        if (!nombre) {
            return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
        }

        const materias = getMaterias();
        const newMateria = {
            id: `mat-${Date.now()}`,
            nombre,
            color: color || '#2C5F8A'
        };

        materias.push(newMateria);
        fs.writeFileSync(MATERIAS_FILE, JSON.stringify(materias, null, 2));

        return NextResponse.json(newMateria, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creando materia' }, { status: 500 });
    }
}
