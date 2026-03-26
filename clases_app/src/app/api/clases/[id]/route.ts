import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Clase } from '@/types/clase';

const DATA_DIR = path.join(process.cwd(), 'data', 'clases');

type Params = { params: Promise<{ id: string }> };

function getClasePath(id: string) {
    return path.join(DATA_DIR, `${id}.json`);
}

export async function GET(_: Request, { params }: Params) {
    const { id } = await params;
    try {
        const filePath = getClasePath(id);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(content));
    } catch {
        return NextResponse.json({ error: 'Error al leer clase' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = await params;
    try {
        const filePath = getClasePath(id);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
        }
        const existingContent = fs.readFileSync(filePath, 'utf-8');
        const existing: Clase = JSON.parse(existingContent);
        const body = await request.json();
        const updated: Clase = {
            ...existing,
            ...body,
            id: existing.id, // never change id
            createdAt: existing.createdAt,
            updatedAt: new Date().toISOString(),
        };
        fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Error al guardar clase' }, { status: 500 });
    }
}

export async function DELETE(_: Request, { params }: Params) {
    const { id } = await params;
    try {
        const filePath = getClasePath(id);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
        }
        fs.unlinkSync(filePath);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Error al eliminar clase' }, { status: 500 });
    }
}
