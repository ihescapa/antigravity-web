'use client';

import { useState } from 'react';
import { Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { PropiedadesImagenIA } from '@/types/clase';
import styles from './Blocks.module.css';

interface Props {
    propiedades: PropiedadesImagenIA;
    onUpdate: (props: Partial<PropiedadesImagenIA>) => void;
}

const ESTILOS = [
    { id: 'japones', label: 'Japonés Acuarela', icon: '🌸' },
    { id: 'realista', label: 'Fotografía Realista', icon: '📷' },
    { id: 'ilustración', label: 'Ilustración Científica', icon: '🎨' },
    { id: 'esquema', label: 'Diagrama Técnico', icon: '📐' }
];

export function ImagenIABlock({ propiedades, onUpdate }: Props) {
    const { prompt, estilo, url, generando } = propiedades;
    const [tempPrompt, setTempPrompt] = useState(prompt);

    const handleGenerate = async () => {
        if (!tempPrompt.trim()) return;

        onUpdate({ generando: true, prompt: tempPrompt });

        // Simulamos la llamada a DALL-E 3
        try {
            const response = await fetch('/api/ai/imagen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: tempPrompt, estilo })
            });

            if (response.ok) {
                const data = await response.json();
                onUpdate({ url: data.url, generando: false });
            } else {
                onUpdate({ generando: false });
            }
        } catch (err) {
            onUpdate({ generando: false });
        }
    };

    return (
        <div className={styles.aiImageBlock}>
            <div className={styles.aiImageHeader}>
                <Sparkles size={18} color="var(--color-gold)" />
                <span>Generador de Imágenes IA</span>
            </div>

            <div className={styles.aiImageBody}>
                {url && !generando ? (
                    <div className={styles.imagePreviewContainer}>
                        {/* Se usa mixBlendMode: multiply para que el fondo blanco DALL-E 3 actúe como "transparente" sobre fondos más oscuros de la web */}
                        <img
                            src={url}
                            alt={prompt}
                            className={styles.generatedImage}
                            style={{ mixBlendMode: 'multiply', backgroundColor: 'transparent' }}
                        />
                        <div className={styles.imageOverlay}>
                            <button className={styles.regenerateBtn} onClick={() => onUpdate({ url: undefined })}>
                                <RefreshCw size={14} /> Cambiar Prompt
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.imagePromptControls}>
                        <div className={styles.styleSelector}>
                            <p className={styles.label}>Elegí un estilo visual:</p>
                            <div className={styles.styleGrid}>
                                {ESTILOS.map(s => (
                                    <button
                                        key={s.id}
                                        className={`${styles.styleBtn} ${estilo === s.id ? styles.activeStyle : ''}`}
                                        onClick={() => onUpdate({ estilo: s.id as any })}
                                    >
                                        <span className={styles.styleIcon}>{s.icon}</span>
                                        <span className={styles.styleLabel}>{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.promptInput}>
                            <textarea
                                placeholder="Describí la imagen que necesitás (ej: 'Célula animal con todas sus partes señaladas')"
                                value={tempPrompt}
                                onChange={(e) => setTempPrompt(e.target.value)}
                                rows={2}
                            />
                            <button
                                className={styles.aiGenerateBtn}
                                onClick={handleGenerate}
                                disabled={generando || !tempPrompt.trim()}
                            >
                                {generando ? (
                                    <>
                                        <RefreshCw className={styles.spin} size={16} /> Generando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} /> Generar Imagen
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
