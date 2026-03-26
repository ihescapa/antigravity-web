'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Clase } from '@/types/clase';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { ChevronRight, ChevronLeft, X, Maximize2 } from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';

export default function PresentacionPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const [clase, setClase] = useState<Clase | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch(`/api/clases/${id}`)
            .then(res => res.json())
            .then(data => {
                setClase(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const goToNext = useCallback(() => {
        if (clase && currentIndex < clase.bloques.length - 1) {
            setCurrentIndex(c => c + 1);
        }
    }, [clase, currentIndex]);

    const goToPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(c => c - 1);
        }
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrev();
            } else if (e.key === 'Escape') {
                router.push('/');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev, router]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    if (loading) return <div className={styles.loading}>Cargando presentación...</div>;
    if (!clase || !clase.bloques.length) return <div className={styles.error}>No se encontró la clase o no tiene bloques.</div>;

    const currentBlock = clase.bloques[currentIndex];
    const progress = ((currentIndex + 1) / clase.bloques.length) * 100;

    return (
        <div className={styles.presentacionView}>

            {/* HEADER / CONTROLES */}
            <div className={styles.controls}>
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                </div>

                <div className={styles.topBar}>
                    <div className={styles.claseInfo}>
                        <span className={styles.materia}>{clase.materia}</span>
                        <span className={styles.separator}>/</span>
                        <span className={styles.titulo}>{clase.titulo}</span>
                    </div>

                    <div className={styles.actions}>
                        <span className={styles.counter}>{currentIndex + 1} / {clase.bloques.length}</span>
                        <button className={styles.iconBtn} onClick={toggleFullscreen} title="Pantalla completa">
                            <Maximize2 size={20} />
                        </button>
                        <Link href="/" className={styles.iconBtn} title="Cerrar presentación">
                            <X size={24} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ÁREA CENTRAL */}
            <main className={styles.slideArea}>
                <div key={currentBlock.id} className={styles.slideContent}>
                    <BlockRenderer bloque={currentBlock} modoPresentacion={true} />
                </div>
            </main>

            {/* NAVEGACIÓN LATERAL INVISIBLE */}
            <div className={`${styles.navLayer} ${styles.navLeft}`} onClick={goToPrev}>
                <div className={styles.navIcon}><ChevronLeft size={48} /></div>
            </div>
            <div className={`${styles.navLayer} ${styles.navRight}`} onClick={goToNext}>
                <div className={styles.navIcon}><ChevronRight size={48} /></div>
            </div>

        </div>
    );
}
