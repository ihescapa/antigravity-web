'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Clase, Bloque, TipoBloque } from '@/types/clase';
import { Save, Eye, ArrowUp, ArrowDown, Trash2, Plus, LayoutTemplate, Copy } from 'lucide-react';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { BlockEditorSidebar } from '@/components/editor/BlockEditorSidebar';
import { v4 as uuidv4 } from 'uuid';
import styles from './page.module.css';

const GRUPOS_BLOQUE: { titulo: string; tipos: { tipo: TipoBloque; label: string }[] }[] = [
    {
        titulo: 'Contenido',
        tipos: [
            { tipo: 'texto-intro', label: 'Texto Simple' },
            { tipo: 'texto-columnas', label: 'Texto 2 Columnas' },
            { tipo: 'imagen', label: 'Imagen Sola' },
            { tipo: 'imagen-texto', label: 'Imagen + Texto' },
            { tipo: 'imagen-doble', label: 'Doble Imagen' },
            { tipo: 'galeria', label: 'Galería de Imágenes' },
            { tipo: 'pdf', label: 'Presentación PDF' },
        ]
    },
    {
        titulo: 'Interactivos',
        tipos: [
            { tipo: 'pregunta', label: 'Pregunta Disparadora' },
            { tipo: 'quiz', label: 'Quiz Multiple Choice' },
            { tipo: 'imagen-interactiva', label: 'Imagen Interactiva' },
            { tipo: 'linea-tiempo', label: 'Línea de Tiempo' },
            { tipo: 'tarjetas', label: 'Tarjetas Info' },
        ]
    },
    {
        titulo: 'Inteligencia Artificial',
        tipos: [
            { tipo: 'sugerencia-ia', label: 'Asistente de Texto (Prompt)' },
            { tipo: 'imagen-ia', label: 'Generador de Imágenes IA' },
            { tipo: 'importador-ia', label: 'Importador Inteligente' },
        ]
    },
    {
        titulo: 'Estructura',
        tipos: [
            { tipo: 'portada', label: 'Portada' },
            { tipo: 'cierre', label: 'Bloque de Cierre' },
            { tipo: 'imagen-superpuesta', label: 'Imagen Superpuesta' },
        ]
    }
];

export default function EditarClasePage({ params }: { params: { id: string } }) {
    // ... existing code in between skipped for replacement brevity, using the correct block Actions below
    /* */
    // Placeholder to make valid JSON for the edit, we will just use a multi replace to change both
    const placeholder = true;
    const router = useRouter();
    const { id } = params;
    const [clase, setClase] = useState<Clase | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/clases/${id}`)
            .then(res => res.json())
            .then(data => {
                setClase(data);
                setLoading(false);
            });
    }, [id]);

    const saveClase = async () => {
        if (!clase) return;
        setSaving(true);
        try {
            await fetch(`/api/clases/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clase)
            });
            setDirty(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const addBlock = (tipo: TipoBloque) => {
        if (!clase) return;
        const newBlock: Bloque = {
            id: `bloque-${uuidv4().slice(0, 6)}`,
            tipo,
            propiedades: {
                titulo: `Nuevo bloque ${tipo}`,
                contenido: '...',
                opciones: [],
                tarjetas: [],
                hitos: [],
                estilo: 'realista',
                prompt: '',
                textoOriginal: '',
                estado: 'idle'
            } as any
        };
        setClase({ ...clase, bloques: [...clase.bloques, newBlock] });
        setDirty(true);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (!clase) return;
        const newBloques = [...clase.bloques];
        if (direction === 'up' && index > 0) {
            [newBloques[index - 1], newBloques[index]] = [newBloques[index], newBloques[index - 1]];
        } else if (direction === 'down' && index < newBloques.length - 1) {
            [newBloques[index + 1], newBloques[index]] = [newBloques[index], newBloques[index + 1]];
        }
        setClase({ ...clase, bloques: newBloques });
        setDirty(true);
    };

    const removeBlock = (id: string) => {
        if (!clase || !confirm('¿Eliminar este bloque?')) return;
        const newBloques = clase.bloques.filter(b => b.id !== id);
        setClase({ ...clase, bloques: newBloques });
        setDirty(true);
        if (selectedBlockId === id) setSelectedBlockId(null);
    };

    const duplicateBlock = (index: number) => {
        if (!clase) return;
        const blockToDuplicate = clase.bloques[index];
        const duplicatedBlock: Bloque = {
            ...blockToDuplicate,
            id: `bloque-${uuidv4().slice(0, 6)}`,
            // Deep copy properties to avoid reference issues
            propiedades: JSON.parse(JSON.stringify(blockToDuplicate.propiedades))
        };

        const newBloques = [...clase.bloques];
        newBloques.splice(index + 1, 0, duplicatedBlock);

        setClase({ ...clase, bloques: newBloques });
        setDirty(true);
    };

    const handleAddBlocks = (afterId: string, blocks: Omit<Bloque, 'id'>[]) => {
        if (!clase) return;
        const index = clase.bloques.findIndex(b => b.id === afterId);
        if (index === -1) return;

        const blocksWithIds = blocks.map(b => ({
            ...b,
            id: `bloque-${uuidv4().slice(0, 6)}`
        })) as Bloque[];

        const newBloques = [...clase.bloques];
        // Eliminar el bloque de sugerencia e insertar los nuevos
        newBloques.splice(index, 1, ...blocksWithIds);

        setClase({ ...clase, bloques: newBloques });
        setDirty(true);
    };

    if (loading) return <div className={styles.centered}>Cargando editor...</div>;
    if (!clase) return <div className={styles.centered}>Clase no encontrada</div>;

    return (
        <div className={styles.editorContainer}>
            {/* HEADER BAR */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>{clase.titulo}</h1>
                    <span className={styles.materiaBadge}>{clase.materia}</span>
                    {dirty && <span className={styles.dirtyDot} title="Cambios sin guardar" />}
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.secondaryBtn} onClick={() => router.push(`/clases/${id}/presentar`)}>
                        <Eye size={16} /> Presentar
                    </button>
                    <button className={styles.primaryBtn} onClick={saveClase} disabled={saving || !dirty}>
                        <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </header>

            <div className={styles.mainLayout}>
                {/* SIDE PANEL: ADDS & METADATA */}
                <aside className={styles.sidebar}>
                    <section className={styles.panelSection}>
                        <h3>Agregar Bloque</h3>
                        <div className={styles.categoryList}>
                            {GRUPOS_BLOQUE.map(grupo => (
                                <details key={grupo.titulo} className={styles.categoryGroup} open>
                                    <summary className={styles.categoryTitle}>{grupo.titulo}</summary>
                                    <div className={styles.blockPalette}>
                                        {grupo.tipos.map(tb => (
                                            <button key={tb.tipo} className={styles.paletteBtn} onClick={() => addBlock(tb.tipo)}>
                                                <Plus size={14} /> {tb.label}
                                            </button>
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>

                    <section className={styles.panelSection}>
                        <h3>Propiedades de Clase</h3>
                        <div className={styles.metaForm}>
                            <label>
                                Título
                                <input type="text" value={clase.titulo} onChange={e => {
                                    setClase({ ...clase, titulo: e.target.value }); setDirty(true);
                                }} />
                            </label>
                            <label>
                                Estado
                                <select value={clase.estado} onChange={e => {
                                    setClase({ ...clase, estado: e.target.value as any }); setDirty(true);
                                }}>
                                    <option value="borrador">Borrador</option>
                                    <option value="lista">Lista</option>
                                    <option value="archivada">Archivada</option>
                                </select>
                            </label>
                        </div>
                    </section>
                </aside>

                {/* WORKSPACE: BLOQUES */}
                <div className={styles.workspace}>
                    {clase.bloques.length === 0 ? (
                        <div className={styles.emptyBlocks}>
                            <LayoutTemplate size={48} />
                            <h3>Esta clase está vacía</h3>
                            <p>Agregá bloques desde el panel izquierdo para empezar a armarla.</p>
                        </div>
                    ) : (
                        <div className={styles.blockList}>
                            {clase.bloques.map((bloque, idx) => (
                                <div
                                    key={bloque.id}
                                    className={`${styles.blockWrapper} ${selectedBlockId === bloque.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedBlockId(bloque.id)}
                                >
                                    <div className={styles.blockControls}>
                                        <span className={styles.blockTypeLabel}>{bloque.tipo}</span>
                                        <div className={styles.blockActions}>
                                            <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'up'); }} disabled={idx === 0} title="Subir">
                                                <ArrowUp size={16} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'down'); }} disabled={idx === clase.bloques.length - 1} title="Bajar">
                                                <ArrowDown size={16} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); duplicateBlock(idx); }} title="Duplicar">
                                                <Copy size={16} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); removeBlock(bloque.id); }} className={styles.btnDanger} title="Eliminar">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Vista renderizada del bloque */}
                                    <div className={styles.blockPreview}>
                                        <BlockRenderer
                                            bloque={bloque}
                                            onUpdate={(nuevasProps) => {
                                                const newBloques = [...clase.bloques];
                                                newBloques[idx].propiedades = nuevasProps;
                                                setClase({ ...clase, bloques: newBloques });
                                                setDirty(true);
                                            }}
                                            onRemove={() => removeBlock(bloque.id)}
                                            onAddBlocks={handleAddBlocks}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SIDEBAR DERECHA: EDITOR PROPIEDADES */}
                <BlockEditorSidebar
                    bloque={clase.bloques.find(b => b.id === selectedBlockId) || null}
                    onUpdate={(id, props) => {
                        const newBloques = clase.bloques.map(b => b.id === id ? { ...b, propiedades: props } : b);
                        setClase({ ...clase, bloques: newBloques });
                        setDirty(true);
                    }}
                    onClose={() => setSelectedBlockId(null)}
                    onRemove={(id) => {
                        removeBlock(id);
                        setSelectedBlockId(null);
                    }}
                />
            </div>
        </div>
    );
}
