import { useState } from 'react';
import { Bloque, PropiedadesImportadorIA } from '@/types/clase';
import { Sparkles, X, Check, FileText, ArrowRight } from 'lucide-react';
import styles from './Blocks.module.css';

interface Props {
    propiedades: PropiedadesImportadorIA;
    onUpdate: (props: PropiedadesImportadorIA) => void;
    onAccept: (bloques: Omit<Bloque, 'id'>[]) => void;
    onRemove: () => void;
}

export function ImportadorIABlock({ propiedades, onUpdate, onAccept, onRemove }: Props) {
    const [tempTexto, setTempTexto] = useState(propiedades.textoOriginal || '');

    const handleGenerate = async () => {
        if (!tempTexto.trim()) return;

        onUpdate({ ...propiedades, textoOriginal: tempTexto, estado: 'generando' });

        try {
            const res = await fetch('/api/ai/importar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: tempTexto })
            });

            if (!res.ok) throw new Error('Error al importar');

            const data = await res.json();
            onUpdate({
                ...propiedades,
                textoOriginal: tempTexto,
                resultado: data.bloques,
                estado: 'completado'
            });
        } catch (error) {
            onUpdate({ ...propiedades, textoOriginal: tempTexto, estado: 'error' });
        }
    };

    const handleAccept = () => {
        if (propiedades.resultado) {
            onAccept(propiedades.resultado);
        }
    };

    return (
        <div className={`${styles.aiBlock} ${propiedades.estado === 'generando' ? styles.generando : ''} ${propiedades.estado === 'error' ? styles.error : ''}`}>
            <div className={styles.aiHeader}>
                <div className={styles.aiTitle}>
                    <FileText size={20} color="var(--color-gold)" />
                    Importador Inteligente (IA)
                </div>
                <button className={styles.removeBtn} onClick={onRemove} title="Eliminar bloque">
                    <X size={18} />
                </button>
            </div>

            <div className={styles.aiBody}>
                {propiedades.estado === 'idle' || propiedades.estado === 'error' ? (
                    <div className={styles.promptInputArea}>
                        <textarea
                            value={tempTexto}
                            onChange={(e) => setTempTexto(e.target.value)}
                            placeholder="Pega aquí el contenido (texto de un paper, fragmento de libro, etc.) para convertirlo en bloques de clase..."
                            rows={6}
                        />
                        {propiedades.estado === 'error' && (
                            <p className={styles.errorText}>Hubo un problema procesando el contenido. Intenta de nuevo.</p>
                        )}
                        <button
                            className={styles.generateBtn}
                            onClick={handleGenerate}
                            disabled={!tempTexto.trim()}
                        >
                            <Sparkles size={16} /> Procesar y Transformar
                        </button>
                    </div>
                ) : propiedades.estado === 'generando' ? (
                    <div className={styles.generatingState}>
                        <Sparkles size={32} color="var(--color-gold)" className={styles.spin} />
                        <p>Analizando texto y adaptándolo a formato de clase interactiva...</p>
                    </div>
                ) : propiedades.estado === 'completado' && propiedades.resultado ? (
                    <div className={styles.resultArea}>
                        <div className={styles.resultHeader}>
                            <p>¡Contenido importado exitosamente! Se generarán estos bloques:</p>
                        </div>
                        <div className={styles.resultList}>
                            {propiedades.resultado.map((b, i) => (
                                <div key={i} className={styles.resultItem}>
                                    <span className={styles.blockTag}>{b.tipo}</span>
                                    <span className={styles.blockPreview}>
                                        {(b.propiedades as any).titulo || (b.propiedades as any).pregunta || 'Nuevo contenido...'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.resultActions}>
                            <button className={styles.acceptBtn} onClick={handleAccept}>
                                <Check size={18} /> Incorporar a la clase
                            </button>
                            <button className={styles.retryBtn} onClick={() => onUpdate({ ...propiedades, estado: 'idle' })}>
                                Editar texto original
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
