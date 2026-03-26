import { useState, useRef } from 'react';
import { PropiedadesImagenSuperpuesta } from '@/types/clase';
import styles from './ImagenSuperpuestaBlock.module.css';
import { Upload } from 'lucide-react';

interface Props {
    propiedades: PropiedadesImagenSuperpuesta;
    isPreview?: boolean;
    onUpdate?: (nuevasProps: Partial<PropiedadesImagenSuperpuesta>) => void;
}

export function ImagenSuperpuestaBlock({ propiedades, isPreview = false, onUpdate }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const p = {
        titulo: propiedades.titulo ?? '',
        descripcion: propiedades.descripcion ?? '',
        imagenSrc: propiedades.imagenSrc ?? '',
        textoAlternativo: propiedades.textoAlternativo ?? '',
        filtroOscuro: propiedades.filtroOscuro ?? true,
    };

    const handleUpdate = (changed: Partial<PropiedadesImagenSuperpuesta>) => {
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

    // Estilos dinámicos para el fondo
    const bgStyle = p.imagenSrc ? {
        backgroundImage: `url(${p.imagenSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    } : {};

    if (isPreview) {
        return (
            <div className={styles.heroContainer} style={bgStyle}>
                {p.filtroOscuro && <div className={styles.overlay} />}
                <div className={styles.contentOverlay}>
                    {p.titulo && <h2 className={styles.title}>{p.titulo}</h2>}
                    {p.descripcion && <p className={styles.description}>{p.descripcion}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.editorContainer}>
            <div className={styles.controlsBar}>
                <label className={styles.controlLabel}>
                    <input
                        type="checkbox"
                        checked={p.filtroOscuro}
                        onChange={(e) => handleUpdate({ filtroOscuro: e.target.checked })}
                    />
                    Aplicar filtro oscuro a la imagen
                </label>
            </div>

            <div className={styles.previewZone} style={bgStyle}>
                {p.filtroOscuro && p.imagenSrc && <div className={styles.overlay} />}

                {!p.imagenSrc && (
                    <div className={styles.uploadPlaceholder} onClick={() => fileInputRef.current?.click()}>
                        <Upload size={32} />
                        <p>{uploading ? 'Subiendo imagen hero...' : 'Hacé clic para cargar una imagen de fondo'}</p>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className={styles.hiddenInput}
                />

                {/* Formulario superpuesto */}
                <div className={`${styles.contentForm} ${!p.imagenSrc ? styles.contentFormBordered : ''}`}>
                    <input
                        type="text"
                        value={p.titulo}
                        onChange={(e) => handleUpdate({ titulo: e.target.value })}
                        className={styles.titleInput}
                        placeholder="Título de la tarjeta superpuesta"
                    />
                    <textarea
                        value={p.descripcion}
                        onChange={(e) => handleUpdate({ descripcion: e.target.value })}
                        className={styles.textArea}
                        placeholder="Descripción o subtítulo. Este texto debe ser legible sobre la imagen."
                        rows={3}
                    />
                </div>

                {p.imagenSrc && (
                    <button
                        className={styles.changeBgBtn}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? '...' : 'Cambiar Fondo'}
                    </button>
                )}
            </div>

            <div className={styles.inputGroupBottom}>
                <label>Texto Alt de la Imagen de Fondo (opcional)</label>
                <input
                    type="text"
                    value={p.textoAlternativo}
                    onChange={(e) => handleUpdate({ textoAlternativo: e.target.value })}
                    className={styles.textInputRegular}
                    placeholder="Descripción corta de la imagen por accesibilidad"
                />
            </div>
        </div>
    );
}
