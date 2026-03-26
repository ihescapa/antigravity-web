'use client';

import { Bloque } from '@/types/clase';
import styles from './BlockRenderer.module.css';
import { HelpCircle } from 'lucide-react';
import { PdfBlock } from './PdfBlock';
import { InteractiveImageBlock } from './InteractiveImageBlock';
import { ImagenTextoBlock } from './ImagenTextoBlock';
import { ImagenSuperpuestaBlock } from './ImagenSuperpuestaBlock';
import { ImagenDobleBlock } from './ImagenDobleBlock';
import { SugerenciaIABlock } from '../editor/blocks/SugerenciaIABlock';
import { ImagenIABlock } from '../editor/blocks/ImagenIABlock';
import { ImportadorIABlock } from '../editor/blocks/ImportadorIABlock';

interface Props {
    bloque: Bloque;
    modoPresentacion?: boolean;
    onUpdate?: (nuevasProps: any) => void;
    onRemove?: (id: string) => void;
    onAddBlocks?: (afterId: string, blocks: Omit<Bloque, 'id'>[]) => void;
}

export function BlockRenderer({ bloque, modoPresentacion = false, onUpdate, onRemove, onAddBlocks }: Props) {
    const cn = modoPresentacion ? styles.presentacion : styles.editor;
    const p = bloque.propiedades as any;

    const globalStyle = {
        backgroundColor: p?.colorFondo && p.colorFondo !== '#ffffff' ? p.colorFondo : undefined,
        color: p?.colorTexto && p.colorTexto !== '#1A1A2E' ? p.colorTexto : undefined,
        textAlign: p?.alineacion || undefined,
        fontSize: p?.tamanoFuente === 'pequeno' ? '0.85em' : 
                   p?.tamanoFuente === 'grande' ? '1.2em' : 
                   p?.tamanoFuente === 'extra-grande' ? '1.5em' : undefined,
    } as React.CSSProperties;

    switch (bloque.tipo) {
        case 'portada': {
            return (
                <div className={`${styles.portada} ${cn}`} style={globalStyle}>
                    <h3>{p.materia}</h3>
                    <h1>{p.titulo}</h1>
                    <h2>{p.subtitulo}</h2>
                    <p className={styles.autor}>{p.autor}</p>
                </div>
            );
        }
        case 'texto-intro': {
            return (
                <div className={`${styles.textoIntro} ${cn}`} style={globalStyle}>
                    {p.titulo && <h2>{p.titulo}</h2>}
                    <p>{p.contenido}</p>
                </div>
            );
        }
        case 'texto-columnas': {
            return (
                <div className={`${styles.textoColumnas} ${cn}`} style={globalStyle}>
                    {p.titulo && <h2>{p.titulo}</h2>}
                    <div className={styles.grid2}>
                        <div>{p.columnaIzquierda}</div>
                        <div>{p.columnaDerecha}</div>
                    </div>
                </div>
            );
        }
        case 'linea-tiempo': {
            return (
                <div className={`${styles.lineaTiempo} ${cn}`} style={globalStyle}>
                    {p.titulo && <h2>{p.titulo}</h2>}
                    <div className={styles.timelineContainer}>
                        {p.hitos.map((hito: any, i: number) => (
                            <div key={i} className={styles.hito}>
                                <div className={styles.hitoFecha}>{hito.fecha}</div>
                                <div className={styles.hitoContent}>
                                    <h4>{hito.titulo}</h4>
                                    <p>{hito.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        case 'tarjetas': {
            return (
                <div className={`${styles.tarjetas} ${cn}`} style={globalStyle}>
                    {p.titulo && <h2>{p.titulo}</h2>}
                    <div className={styles.gridAuto}>
                        {p.tarjetas.map((t: any, i: number) => (
                            <div key={i} className={styles.tarjeta}>
                                <h4>{t.titulo}</h4>
                                <p>{t.contenido}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        case 'pregunta': {
            return (
                <div className={`${styles.pregunta} ${cn}`} style={globalStyle}>
                    <div className={styles.preguntaIcon}>
                        <HelpCircle size={48} />
                    </div>
                    <h2>{p.pregunta}</h2>
                    {p.contexto && <p className={styles.contexto}>{p.contexto}</p>}
                </div>
            );
        }
        case 'quiz': {
            return (
                <div className={`${styles.quiz} ${cn}`} style={globalStyle}>
                    <h2>{p.pregunta}</h2>
                    <div className={styles.opciones}>
                        {p.opciones.map((op: any, i: number) => (
                            <button key={i} className={styles.opcionBtn}>
                                {op.texto}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        case 'acordeon': {
            return (
                <div className={`${styles.acordeon} ${cn}`} style={globalStyle}>
                    {p.titulo && <h2>{p.titulo}</h2>}
                    <div className={styles.acordeonList}>
                        {p.items.map((item: any, i: number) => (
                            <details key={i} className={styles.acordeonItem}>
                                <summary>
                                    <span>{item.pregunta}</span>
                                </summary>
                                <div className={styles.acordeonRespuesta}>{item.respuesta}</div>
                            </details>
                        ))}
                    </div>
                </div>
            );
        }
        case 'cierre': {
            return (
                <div className={`${styles.cierre} ${cn}`} style={globalStyle}>
                    <h2>{p.titulo || 'Síntesis'}</h2>
                    <p>{p.resumen}</p>
                    <div className={styles.conceptosBox}>
                        <h4>Conceptos Clave</h4>
                        <ul>
                            {p.conceptosClave?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                </div>
            );
        }
        case 'pdf': {
            return <PdfBlock propiedades={p} isPreview={!modoPresentacion} />;
        }
        case 'imagen-interactiva': {
            return <InteractiveImageBlock propiedades={p} isPreview={modoPresentacion} onUpdate={onUpdate} />;
        }
        case 'imagen-texto': {
            return <ImagenTextoBlock propiedades={p} isPreview={modoPresentacion} onUpdate={onUpdate} />;
        }
        case 'imagen-superpuesta': {
            return <ImagenSuperpuestaBlock propiedades={p} isPreview={modoPresentacion} onUpdate={onUpdate} />;
        }
        case 'imagen-doble': {
            return <ImagenDobleBlock propiedades={p} isPreview={modoPresentacion} onUpdate={onUpdate} />;
        }
        case 'imagen-ia': {
            return <ImagenIABlock propiedades={p} onUpdate={onUpdate || (() => { })} />;
        }
        case 'sugerencia-ia': {
            if (modoPresentacion) return null;
            return (
                <SugerenciaIABlock
                    propiedades={p}
                    onUpdate={onUpdate || (() => { })}
                    onAccept={(nuevosBloques) => onAddBlocks?.(bloque.id, nuevosBloques)}
                    onRemove={() => onRemove?.(bloque.id)}
                />
            );
        }
        case 'importador-ia': {
            if (modoPresentacion) return null;
            return (
                <ImportadorIABlock
                    propiedades={p}
                    onUpdate={onUpdate || (() => { })}
                    onAccept={(nuevosBloques) => onAddBlocks?.(bloque.id, nuevosBloques)}
                    onRemove={() => onRemove?.(bloque.id)}
                />
            );
        }
        default:
            return (
                <div className={styles.defaultBlock}>
                    [Bloque de tipo: {bloque.tipo}]
                </div>
            );
    }
}
