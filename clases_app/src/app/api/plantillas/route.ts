import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Plantilla } from '@/types/clase';

const DATA_FILE = path.join(process.cwd(), 'data', 'plantillas', 'plantillas.json');

export async function GET() {
    try {
        if (!fs.existsSync(DATA_FILE)) return NextResponse.json([]);
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const plantillas: Plantilla[] = JSON.parse(content);
        return NextResponse.json(plantillas);
    } catch {
        return NextResponse.json({ error: 'Error al leer plantillas' }, { status: 500 });
    }
}
