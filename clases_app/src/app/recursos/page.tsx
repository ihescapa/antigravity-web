'use client';

import { useEffect, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Video, Link as LinkIcon, Download } from 'lucide-react';
import styles from './page.module.css';

interface Recurso {
    id: string;
    nombre: string;
    url: string;
    tipo: string;
    tamanoBytes?: number;
}

export default function RecursosPage() {
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [uploading, setUploading] = useState(false);

    // En un sistema real, haríamos fetch a /api/recursos.
    // Como simplificación de este MVP, mostramos una lista vacía
    // y permitimos subir a /api/upload.

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                // Agregar a la lista local
                setRecursos(prev => [{
                    id: data.url,
                    nombre: data.nombre,
                    url: data.url,
                    tipo: file.type.includes('image') ? 'imagen' : 'documento',
                    tamanoBytes: data.tamanoBytes
                }, ...prev]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const getIcon = (tipo: string) => {
        switch (tipo) {
            case 'imagen': return <ImageIcon size={24} />;
            case 'video': return <Video size={24} />;
            case 'enlace': return <LinkIcon size={24} />;
            default: return <FileText size={24} />;
        }
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return '--';
        const mb = bytes / (1024 * 1024);
        return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Biblioteca de Recursos</h1>
                    <p className={styles.subtitle}>Gestiona las imágenes, PDFs y enlaces que usás en tus clases</p>
                </div>
                <label className={styles.uploadBtn}>
                    <Upload size={20} />
                    <span>{uploading ? 'Subiendo...' : 'Subir Archivo'}</span>
                    <input type="file" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
                </label>
            </header>

            {recursos.length === 0 ? (
                <div className={styles.emptyState}>
                    <ImageIcon size={48} className={styles.emptyIcon} />
                    <h3>No hay recursos todavía</h3>
                    <p>Subí imágenes o documentos para usarlos después en tus clases.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {recursos.map(r => (
                        <div key={r.id} className={styles.card}>
                            <div className={styles.preview}>
                                {r.tipo === 'imagen' ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={r.url} alt={r.nombre} />
                                ) : (
                                    <div className={styles.fileIcon}>{getIcon(r.tipo)}</div>
                                )}
                            </div>
                            <div className={styles.info}>
                                <h4 className={styles.nombre} title={r.nombre}>{r.nombre}</h4>
                                <div className={styles.meta}>
                                    <span className={styles.tipo}>{r.tipo}</span>
                                    <span className={styles.tamano}>{formatSize(r.tamanoBytes)}</span>
                                </div>
                                <div className={styles.actions}>
                                    <a href={r.url} download target="_blank" rel="noreferrer" className={styles.actionBtn}>
                                        <Download size={14} /> Descargar
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
