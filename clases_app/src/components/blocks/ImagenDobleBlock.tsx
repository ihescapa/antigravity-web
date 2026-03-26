import { useState, useRef } from 'react';
import { PropiedadesImagenDoble } from '@/types/clase';
import styles from './ImagenDobleBlock.module.css';
import { Upload } from 'lucide-react';

interface Props {
    propiedades: PropiedadesImagenDoble;
    isPreview?: boolean;
    onUpdate?: (nuevasProps: Partial<PropiedadesImagenDoble>) => void;
}

export function ImagenDobleBlock({ propiedades, isPreview = false, onUpdate }: Props) {
    const fileInputRef1 = useRef<HTMLInputElement>(null);
    const fileInputRef2 = useRef<HTMLInputElement>(null);
    const [uploading1, setUploading1] = useState(false);
    const [uploading2, setUploading2] = useState(false);

    const p = {
        titulo: propiedades.titulo ?? '',
        imagen1Src: propiedades.imagen1Src ?? '',
        epigrafe1: propiedades.epigrafe1 ?? '',
        imagen2Src: propiedades.imagen2Src ?? '',
        epigrafe2: propiedades.epigrafe2 ?? '',
        ...propiedades,
    };

    const handleUpdate = (changed: Partial<PropiedadesImagenDoble>) => {
        if (onUpdate) {
            onUpdate({ ...p, ...changed });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, position: 1 | 2) => {
        const file = e.target.files?.[0];
        if (!file) return;

        position === 1 ? setUploading1(true) : setUploading2(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                if (position === 1) {
                    handleUpdate({ imagen1Src: data.url });
                } else {
                    handleUpdate({ imagen2Src: data.url });
                }
            } else {
                alert('Error al subir la imagen');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error al subir la imagen');
        } finally {
            position === 1 ? setUploading1(false) : setUploading2(false);
            if (position === 1 && fileInputRef1.current) fileInputRef1.current.value = '';
            if (position === 2 && fileInputRef2.current) fileInputRef2.current.value = '';
        }
    };

    if (isPreview) {
        return (
            <div className={styles.doubleContainer}>
                {p.titulo && <h3 className={styles.mainTitle}>{p.titulo}</h3>}
                <div className={styles.grid}>
                    <figure className={styles.figure}>
                        {p.imagen1Src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imagen1Src} alt={p.epigrafe1 || 'Imagen 1'} className={styles.image} />
                        ) : (
                            <div className={styles.emptyImage}></div>
                        )}
                        {p.epigrafe1 && <figcaption className={styles.caption}>{p.epigrafe1}</figcaption>}
                    </figure>
                    <figure className={styles.figure}>
                        {p.imagen2Src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imagen2Src} alt={p.epigrafe2 || 'Imagen 2'} className={styles.image} />
                        ) : (
                            <div className={styles.emptyImage}></div>
                        )}
                        {p.epigrafe2 && <figcaption className={styles.caption}>{p.epigrafe2}</figcaption>}
                    </figure>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.editorContainer}>
            <div className={styles.inputGroupTop}>
                <label>Título de la Sección (Opcional)</label>
                <input
                    type="text"
                    value={p.titulo}
                    onChange={(e) => handleUpdate({ titulo: e.target.value })}
                    className={styles.titleInput}
                    placeholder="Ej: Comparación de estomas"
                />
            </div>

            <div className={styles.editorGrid}>
                {/* COLUMNA 1 */}
                <div className={styles.editorCol}>
                    <div className={styles.labelSection}>Imagen Izquierda</div>
                    <div className={styles.imageZone}>
                        {p.imagen1Src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imagen1Src} alt="Previsualización" className={styles.previewImage} />
                        ) : (
                            <div className={styles.uploadBtn} onClick={() => fileInputRef1.current?.click()}>
                                <Upload size={24} />
                                <span>{uploading1 ? 'Subiendo...' : 'Cargar Imagen 1'}</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef1}
                            onChange={(e) => handleFileUpload(e, 1)}
                            accept="image/*"
                            className={styles.hiddenInput}
                        />
                    </div>
                    {p.imagen1Src && (
                        <button className={styles.replaceBtn} onClick={() => fileInputRef1.current?.click()} disabled={uploading1}>
                            Cambiar Imagen
                        </button>
                    )}
                    <textarea
                        value={p.epigrafe1}
                        onChange={(e) => handleUpdate({ epigrafe1: e.target.value })}
                        className={styles.captionInput}
                        placeholder="Escribí el epígrafe para esta imagen..."
                        rows={2}
                    />
                </div>

                {/* COLUMNA 2 */}
                <div className={styles.editorCol}>
                    <div className={styles.labelSection}>Imagen Derecha</div>
                    <div className={styles.imageZone}>
                        {p.imagen2Src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imagen2Src} alt="Previsualización" className={styles.previewImage} />
                        ) : (
                            <div className={styles.uploadBtn} onClick={() => fileInputRef2.current?.click()}>
                                <Upload size={24} />
                                <span>{uploading2 ? 'Subiendo...' : 'Cargar Imagen 2'}</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef2}
                            onChange={(e) => handleFileUpload(e, 2)}
                            accept="image/*"
                            className={styles.hiddenInput}
                        />
                    </div>
                    {p.imagen2Src && (
                        <button className={styles.replaceBtn} onClick={() => fileInputRef2.current?.click()} disabled={uploading2}>
                            Cambiar Imagen
                        </button>
                    )}
                    <textarea
                        value={p.epigrafe2}
                        onChange={(e) => handleUpdate({ epigrafe2: e.target.value })}
                        className={styles.captionInput}
                        placeholder="Escribí el epígrafe para esta imagen..."
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );
}
