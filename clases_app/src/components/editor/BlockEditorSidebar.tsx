'use client';

import { Bloque } from '@/types/clase';
import { X, Save, Trash2 } from 'lucide-react';
import styles from './BlockEditorSidebar.module.css';

interface Props {
    bloque: Bloque | null;
    onUpdate: (bloqueId: string, nuevasPropiedades: any) => void;
    onClose: () => void;
    onRemove: (bloqueId: string) => void;
}

export function BlockEditorSidebar({ bloque, onUpdate, onClose, onRemove }: Props) {
    if (!bloque) return null;

    const handleChange = (key: string, value: any) => {
        onUpdate(bloque.id, { ...bloque.propiedades, [key]: value });
    };

    const renderEditor = () => {
        const p = bloque.propiedades as any;

        switch (bloque.tipo) {
            case 'texto-intro':
                return (
                    <div className={styles.editorForm}>
                        <div className={styles.field}>
                            <label>Título</label>
                            <input
                                type="text"
                                value={p.titulo || ''}
                                onChange={(e) => handleChange('titulo', e.target.value)}
                                placeholder="Título de la sección"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Contenido</label>
                            <textarea
                                value={p.contenido || ''}
                                onChange={(e) => handleChange('contenido', e.target.value)}
                                placeholder="Escribí el texto aquí..."
                                rows={8}
                            />
                        </div>
                    </div>
                );
            case 'pregunta':
                return (
                    <div className={styles.editorForm}>
                        <div className={styles.field}>
                            <label>Pregunta</label>
                            <textarea
                                value={p.pregunta || ''}
                                onChange={(e) => handleChange('pregunta', e.target.value)}
                                placeholder="Escribí la pregunta disparadora..."
                                rows={4}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Contexto (opcional)</label>
                            <textarea
                                value={p.contexto || ''}
                                onChange={(e) => handleChange('contexto', e.target.value)}
                                placeholder="Información adicional para dar contexto..."
                                rows={3}
                            />
                        </div>
                    </div>
                );
            case 'portada':
                return (
                    <div className={styles.editorForm}>
                        <div className={styles.field}>
                            <label>Materia</label>
                            <input
                                type="text"
                                value={p.materia || ''}
                                onChange={(e) => handleChange('materia', e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Título</label>
                            <input
                                type="text"
                                value={p.titulo || ''}
                                onChange={(e) => handleChange('titulo', e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Subtítulo</label>
                            <input
                                type="text"
                                value={p.subtitulo || ''}
                                onChange={(e) => handleChange('subtitulo', e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 'imagen':
                return (
                    <div className={styles.editorForm}>
                        <div className={styles.field}>
                            <label>URL de la Imagen</label>
                            <input
                                type="text"
                                value={p.url || ''}
                                onChange={(e) => handleChange('url', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Pie de Foto / Alt</label>
                            <input
                                type="text"
                                value={p.caption || ''}
                                onChange={(e) => handleChange('caption', e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 'imagen-ia':
                return (
                    <div className={styles.editorForm}>
                        <div className={styles.field}>
                            <label>Prompt de Imagen</label>
                            <textarea
                                value={p.prompt || ''}
                                onChange={(e) => handleChange('prompt', e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Estilo Visual</label>
                            <select
                                value={p.estilo || 'realista'}
                                onChange={(e) => handleChange('estilo', e.target.value)}
                            >
                                <option value="realista">Realista</option>
                                <option value="ilustración">Ilustración Científica</option>
                                <option value="vintage">Esquema Vintage</option>
                                <option value="esquema">Diagrama Técnico</option>
                            </select>
                        </div>
                    </div>
                );
            case 'tarjetas':
                return (
                    <div className={styles.editorForm}>
                        <div className={styles.field}>
                            <label>Título del Bloque</label>
                            <input
                                type="text"
                                value={p.titulo || ''}
                                onChange={(e) => handleChange('titulo', e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Tarjetas</label>
                            {p.tarjetas?.map((t: any, i: number) => (
                                <div key={i} className={styles.cardItemEditor}>
                                    <input
                                        type="text"
                                        value={t.titulo}
                                        onChange={(e) => {
                                            const newTars = [...p.tarjetas];
                                            newTars[i].titulo = e.target.value;
                                            handleChange('tarjetas', newTars);
                                        }}
                                        placeholder="Título tarjeta"
                                    />
                                    <textarea
                                        value={t.contenido}
                                        onChange={(e) => {
                                            const newTars = [...p.tarjetas];
                                            newTars[i].contenido = e.target.value;
                                            handleChange('tarjetas', newTars);
                                        }}
                                        placeholder="Contenido"
                                        rows={2}
                                    />
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => {
                                            const newTars = p.tarjetas.filter((_: any, idx: number) => idx !== i);
                                            handleChange('tarjetas', newTars);
                                        }}
                                    >
                                        <Trash2 size={12} /> Eliminar tarjeta
                                    </button>
                                </div>
                            ))}
                            <button
                                className={styles.addBtn}
                                onClick={() => {
                                    const newTars = [...(p.tarjetas || []), { titulo: 'Nueva tarjeta', contenido: '...' }];
                                    handleChange('tarjetas', newTars);
                                }}
                            >
                                + Agregar Tarjeta
                            </button>
                        </div>
                    </div>
                );
            case 'quiz':
                return (
                    <div className={styles.editorForm}>
                        <div className={styles.field}>
                            <label>Pregunta</label>
                            <textarea
                                value={p.pregunta || ''}
                                onChange={(e) => handleChange('pregunta', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Opciones</label>
                            {p.opciones?.map((op: any, i: number) => (
                                <div key={i} className={styles.optionRow}>
                                    <input
                                        type="checkbox"
                                        checked={op.correcta}
                                        onChange={(e) => {
                                            const newOps = [...p.opciones];
                                            newOps[i].correcta = e.target.checked;
                                            handleChange('opciones', newOps);
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={op.texto}
                                        onChange={(e) => {
                                            const newOps = [...p.opciones];
                                            newOps[i].texto = e.target.value;
                                            handleChange('opciones', newOps);
                                        }}
                                    />
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => {
                                            const newOps = p.opciones.filter((_: any, idx: number) => idx !== i);
                                            handleChange('opciones', newOps);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                className={styles.addBtn}
                                onClick={() => {
                                    const newOps = [...(p.opciones || []), { texto: 'Nueva opción', correcta: false }];
                                    handleChange('opciones', newOps);
                                }}
                            >
                                + Agregar Opción
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className={styles.noEditor}>
                        <p>Este bloque ({bloque.tipo}) no tiene un editor específico aún.</p>
                        <p>Pronto podrás editar sus propiedades JSON aquí.</p>
                    </div>
                );
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <span className={styles.typeBadge}>{bloque.tipo}</span>
                    <h2>Editar Bloque</h2>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className={styles.body}>
                {renderEditor()}

                <div className={styles.editorForm} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                    <h4 style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                        Apariencia Global del Bloque
                    </h4>
                    
                    <div className={styles.field}>
                        <label>Tamaño de Letra</label>
                        <select 
                            value={(bloque.propiedades as any).tamanoFuente || 'normal'} 
                            onChange={(e) => handleChange('tamanoFuente', e.target.value)}
                        >
                            <option value="pequeno">Pequeño</option>
                            <option value="normal">Normal</option>
                            <option value="grande">Grande</option>
                            <option value="extra-grande">Extra Grande</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Color de Fondo (hex/rgba)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                                type="color" 
                                value={(bloque.propiedades as any).colorFondo || '#ffffff'} 
                                onChange={(e) => handleChange('colorFondo', e.target.value)}
                                style={{ width: '40px', padding: '0', height: '32px', cursor: 'pointer' }}
                            />
                            <input 
                                type="text" 
                                value={(bloque.propiedades as any).colorFondo || ''} 
                                onChange={(e) => handleChange('colorFondo', e.target.value)}
                                placeholder="#ffffff o transparente"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Color de Texto</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                                type="color" 
                                value={(bloque.propiedades as any).colorTexto || '#1A1A2E'} 
                                onChange={(e) => handleChange('colorTexto', e.target.value)}
                                style={{ width: '40px', padding: '0', height: '32px', cursor: 'pointer' }}
                            />
                            <input 
                                type="text" 
                                value={(bloque.propiedades as any).colorTexto || ''} 
                                onChange={(e) => handleChange('colorTexto', e.target.value)}
                                placeholder="Por defecto"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Alineación</label>
                        <select 
                            value={(bloque.propiedades as any).alineacion || 'left'} 
                            onChange={(e) => handleChange('alineacion', e.target.value)}
                        >
                            <option value="left">A la izquierda</option>
                            <option value="center">Centrado</option>
                            <option value="right">A la derecha</option>
                            <option value="justify">Justificado</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.deleteBtn} onClick={() => onRemove(bloque.id)}>
                    <Trash2 size={16} /> Eliminar Bloque
                </button>
            </div>
        </aside>
    );
}
