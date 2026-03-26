'use client';

import { useState } from 'react';
import { Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { PropiedadesSugerenciaIA, Bloque } from '@/types/clase';
import styles from './Blocks.module.css';

interface Props {
    propiedades: PropiedadesSugerenciaIA;
    onUpdate: (props: Partial<PropiedadesSugerenciaIA>) => void;
    onAccept: (bloques: Omit<Bloque, 'id'>[]) => void;
    onRemove: () => void;
}

export function SugerenciaIABlock({ propiedades, onUpdate, onAccept, onRemove }: Props) {
    const { prompt, resultado, estado } = propiedades;
    const [tempPrompt, setTempPrompt] = useState(prompt);

    const handleGenerate = async () => {
        if (!tempPrompt.trim()) return;

        onUpdate({ estado: 'generando', prompt: tempPrompt });

        try {
            const res = await fetch('/api/ai/generar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: tempPrompt })
            });

            if (res.ok) {
                const data = await res.json();
                onUpdate({ estado: 'completado', resultado: data.bloques });
            } else {
                onUpdate({ estado: 'error' });
            }
        } catch (err) {
            onUpdate({ estado: 'error' });
        }
    };

    return (
        <div className={`${styles.aiBlock} ${styles[estado]}`}>
            <div className={styles.aiHeader}>
                <div className={styles.aiTitle}>
                    <Sparkles size={18} color="var(--color-gold)" />
                    <span>Asistente de Contenido IA</span>
                </div>
                <button onClick={onRemove} className={styles.removeBtn} title="Eliminar asistente">
                    <X size={14} />
                </button>
            </div>

            <div className={styles.aiBody}>
                {(estado === 'idle' || estado === 'error') && (
                    <div className={styles.promptInputArea}>
                        <textarea
                            placeholder="Describí qué bloques o contenido querés generar (ej: 'Una intro sobre fotosíntesis y un quiz de 3 preguntas')"
                            value={tempPrompt}
                            onChange={(e) => setTempPrompt(e.target.value)}
                            rows={3}
                        />
                        {estado === 'error' && (
                            <p className={styles.errorText}>Hubo un error al generar. Intentá de nuevo.</p>
                        )}
                        <button
                            className={styles.generateBtn}
                            onClick={handleGenerate}
                            disabled={!tempPrompt.trim()}
                        >
                            <Sparkles size={16} />
                            Generar Sugerencia
                        </button>
                    </div>
                )}
                {estado === 'generando' && (
                    <div className={styles.generatingState}>
                        <RefreshCw className={styles.spin} size={32} />
                        <p>Pensando la mejor estructura para tu clase...</p>
                    </div>
                )}
                {estado === 'completado' && resultado ? (
                    <div className={styles.resultArea}>
                        <div className={styles.resultHeader}>
                            <p>¡Generación completada! Se sugieren {resultado.length} bloques:</p>
                        </div>
                        <div className={styles.resultList}>
                            {resultado.map((b, i) => (
                                <div key={i} className={styles.resultItem}>
                                    <span className={styles.blockTag}>{b.tipo}</span>
                                    <span className={styles.blockPreview}>
                                        {(b.propiedades as any).titulo || (b.propiedades as any).pregunta || 'Contenido nuevo'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.resultActions}>
                            <button className={styles.retryBtn} onClick={() => onUpdate({ estado: 'idle' })}>
                                <RefreshCw size={14} /> Reintentar
                            </button>
                            <button className={styles.acceptBtn} onClick={() => onAccept(resultado)}>
                                <Check size={14} /> Aplicar a la clase
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
