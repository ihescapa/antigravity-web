import { useState, useRef } from 'react';
import { PropiedadesImagenTexto } from '@/types/clase';
import styles from './ImagenTextoBlock.module.css';
import { Upload } from 'lucide-react';

interface Props {
    propiedades: PropiedadesImagenTexto;
    isPreview?: boolean;
    onUpdate?: (nuevasProps: Partial<PropiedadesImagenTexto>) => void;
}

export function ImagenTextoBlock({ propiedades, isPreview = false, onUpdate }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Initial default values to prevent undefined errors
    const p = {
        titulo: propiedades.titulo ?? '',
        texto: propiedades.texto ?? '',
        imagenSrc: propiedades.imagenSrc ?? '',
        imagenAlt: propiedades.imagenAlt ?? '',
        posicionImagen: propiedades.posicionImagen ?? 'izquierda',
    };

    const handleUpdate = (changed: Partial<PropiedadesImagenTexto>) => {
        if (onUpdate) {
            onUpdate({ ...p, ...changed });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

            if (res.ok) {
                const data = await res.json();
                handleUpdate({ imagenSrc: data.url });
            } else {
                alert('Error al subir la imagen');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const layoutClass = p.posicionImagen === 'izquierda' ? styles.layoutIzquierda : styles.layoutDerecha;

    if (isPreview) {
        return (
            <div className={`${styles.previewWrapper} ${layoutClass}`}>
                <div className={styles.imageCol}>
                    {p.imagenSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imagenSrc} alt={p.imagenAlt} className={styles.image} />
                    ) : null}
                </div>
                <div className={styles.textCol}>
                    {p.titulo && <h3 className={styles.title}>{p.titulo}</h3>}
                    <div className={styles.textContent}>{p.texto}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.editorWrapper}>
            <div className={styles.controlsBar}>
                <label className={styles.controlLabel}>
                    Buscar:
                    <select
                        value={p.posicionImagen}
                        onChange={(e) => handleUpdate({ posicionImagen: e.target.value as any })}
                        className={styles.select}
                    >
                        <option value="izquierda">Imagen Izquierda</option>
                        <option value="derecha">Imagen Derecha</option>
                    </select>
                </label>
            </div>

            <div className={`${styles.editorGrid} ${layoutClass}`}>
                <div className={styles.editorImageCol}>
                    {p.imagenSrc ? (
                        <div className={styles.imageContainer}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.imagenSrc} alt="Previsualización" className={styles.image} />
                        </div>
                    ) : (
                        <div className={styles.uploadPlaceholder} onClick={() => fileInputRef.current?.click()}>
                            <Upload size={32} />
                            <p>{uploading ? 'Subiendo...' : 'Hacé clic para cargar una imagen'}</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className={styles.hiddenInput}
                            />
                        </div>
                    )}

                    {p.imagenSrc && (
                        <div className={styles.imageControls}>
                            <button
                                className={styles.changeBtn}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? '...' : 'Cambiar Imagen'}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className={styles.hiddenInput}
                            />
                            <div className={styles.inputGroup}>
                                <label>Texto Alt (opcional)</label>
                                <input
                                    type="text"
                                    value={p.imagenAlt}
                                    onChange={(e) => handleUpdate({ imagenAlt: e.target.value })}
                                    className={styles.textInput}
                                    placeholder="Descripción corta de la imagen"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.editorTextCol}>
                    <div className={styles.inputGroup}>
                        <label>Título (opcional)</label>
                        <input
                            type="text"
                            value={p.titulo}
                            onChange={(e) => handleUpdate({ titulo: e.target.value })}
                            className={styles.titleInput}
                            placeholder="Ej: Fósil de Araucaria mirabilis"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Texto Principal</label>
                        <textarea
                            value={p.texto}
                            onChange={(e) => handleUpdate({ texto: e.target.value })}
                            className={styles.textArea}
                            placeholder="Escribí acá la información de esta sección..."
                            rows={8}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
