import React, { useState, useRef, useEffect } from 'react';
import { PropiedadesImagenInteractiva } from '@/types/clase';
import styles from './InteractiveImageBlock.module.css';
import { UploadCloud, Maximize, RotateCw, Move } from 'lucide-react';

interface Props {
    propiedades: PropiedadesImagenInteractiva;
    isPreview?: boolean;
    onUpdate?: (nuevasProps: PropiedadesImagenInteractiva) => void;
}

export function InteractiveImageBlock({ propiedades, isPreview, onUpdate }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

    // Valores predeterminados seguros
    const p = {
        src: propiedades.src || '',
        escala: propiedades.escala ?? 1,
        rotacion: propiedades.rotacion ?? 0,
        posicionX: propiedades.posicionX ?? 0,
        posicionY: propiedades.posicionY ?? 0,
    };

    const handleUpdate = (changes: Partial<PropiedadesImagenInteractiva>) => {
        if (onUpdate) {
            onUpdate({ ...p, ...changes });
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                handleUpdate({ src: data.url });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    // --- Lógica de Panning (Arrastrar) ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isPreview || !p.src) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialPos({ x: p.posicionX, y: p.posicionY });
        e.preventDefault(); // Evitar comportamiento por defecto del navegador (drag imagen fantasma)
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        handleUpdate({
            posicionX: initialPos.x + dx,
            posicionY: initialPos.y + dy
        });
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart, initialPos]); // react-hooks/exhaustive-deps


    if (!p.src) {
        if (isPreview) return <div className={styles.emptyContainer}>Imagen Interactiva vacía</div>;
        return (
            <div
                className={styles.uploadContainer}
                onClick={() => fileInputRef.current?.click()}
            >
                <UploadCloud size={48} className={styles.uploadIcon} />
                <p>{uploading ? 'Subiendo imagen...' : 'Hacé clic para cargar una imagen'}</p>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
        );
    }

    const transformStyle = `translate(${p.posicionX}px, ${p.posicionY}px) rotate(${p.rotacion}deg) scale(${p.escala})`;

    return (
        <div className={styles.wrapper}>
            <div
                ref={containerRef}
                className={`${styles.imageContainer} ${!isPreview ? styles.draggableContainer : ''}`}
                onMouseDown={handleMouseDown}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={p.src}
                    alt="Imagen Interactiva"
                    className={styles.image}
                    style={{ transform: transformStyle }}
                    draggable={false}
                />
                {!isPreview && (
                    <div className={styles.dragOverlay}>
                        <Move className={styles.dragIcon} />
                        <span>Arrastrá para acomodar</span>
                    </div>
                )}
            </div>

            {!isPreview && (
                <div className={styles.controlsBar}>
                    <div className={styles.controlGroup}>
                        <label><Maximize size={16} /> Escala</label>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={p.escala}
                            onChange={e => handleUpdate({ escala: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className={styles.controlGroup}>
                        <label><RotateCw size={16} /> Rotación</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={p.rotacion}
                            onChange={e => handleUpdate({ rotacion: parseFloat(e.target.value) })}
                        />
                    </div>
                    <button
                        className={styles.resetBtn}
                        onClick={() => handleUpdate({ escala: 1, rotacion: 0, posicionX: 0, posicionY: 0 })}
                        title="Restablecer transformaciones"
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}
