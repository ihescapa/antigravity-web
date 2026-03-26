import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
    try {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = path.extname(file.name);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        await writeFile(filepath, buffer);

        return NextResponse.json({
            url: `/uploads/${filename}`,
            nombre: file.name,
            tamanoBytes: file.size,
        });
    } catch {
        return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
    }
}
