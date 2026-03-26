'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutTemplate, PlusCircle } from 'lucide-react';
import styles from './page.module.css';
import { Plantilla } from '@/types/clase';

export default function PlantillasPage() {
    const [plantillas, setPlantillas] = useState<Plantilla[]>([]);

    useEffect(() => {
        fetch('/api/plantillas')
            .then(res => res.json())
            .then(data => setPlantillas(data));
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Plantillas</h1>
                    <p className={styles.subtitle}>Estructuras reutilizables para crear clases rápidamente</p>
                </div>
            </header>

            {plantillas.length === 0 ? (
                <div className={styles.emptyState}>
                    <LayoutTemplate size={48} className={styles.emptyIcon} />
                    <h3>No hay plantillas cargadas</h3>
                    <p>Las plantillas base se cargarán automáticamente.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {plantillas.map(p => (
                        <div key={p.id} className={styles.card}>
                            <div className={styles.preview}>
                                <LayoutTemplate size={48} className={styles.templateIcon} />
                            </div>
                            <div className={styles.info}>
                                <div className={styles.meta}>
                                    <span className={styles.categoria}>{p.categoria}</span>
                                    <span className={styles.bloquesInfo}>{p.bloques.length} bloques</span>
                                </div>
                                <h4 className={styles.nombre}>{p.nombre}</h4>
                                <p className={styles.descripcion}>{p.descripcion}</p>

                                <div className={styles.actions}>
                                    <Link href="/clases/nueva" className={styles.useBtn}>
                                        <PlusCircle size={16} /> Usar Plantilla
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
