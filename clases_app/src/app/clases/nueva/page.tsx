'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, FileText, LayoutTemplate, ArrowRight } from 'lucide-react';
import styles from './page.module.css';
import { Plantilla, Clase } from '@/types/clase';

export default function NuevaClasePage() {
    const router = useRouter();
    const [modo, setModo] = useState<'seleccion' | 'plantilla' | 'asistente'>('seleccion');
    const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
    const [existenteMaterias, setExistenteMaterias] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [nuevaMateriaModo, setNuevaMateriaModo] = useState(false);

    // Form states
    const [titulo, setTitulo] = useState('');
    const [materia, setMateria] = useState('');
    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState('');

    // AI assistant states
    const [tema, setTema] = useState('');
    const [objetivos, setObjetivos] = useState('');
    const [nivel, setNivel] = useState('universitario');

    useEffect(() => {
        // Cargar plantillas
        fetch('/api/plantillas')
            .then(res => res.json())
            .then(data => setPlantillas(data));

        // Cargar materias existentes
        fetch('/api/clases')
            .then(res => res.json())
            .then((data: Clase[]) => {
                const uniqueMaterias = Array.from(new Set(data.filter(c => c.materia).map(c => c.materia)));
                setExistenteMaterias(uniqueMaterias);
            });
    }, []);

    const crearDesdePlantilla = async (e: React.FormEvent) => {
        e.preventDefault();
        const materiaFinal = nuevaMateriaModo ? materia : (materia || existenteMaterias[0] || 'General');
        if (!titulo || !plantillaSeleccionada) return;
        setLoading(true);

        const p = plantillas.find(x => x.id === plantillaSeleccionada);

        const res = await fetch('/api/clases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo,
                materia: materiaFinal,
                estado: 'borrador',
                bloques: p ? p.bloques : []
            })
        });

        if (res.ok) {
            const nueva = await res.json();
            router.push(`/clases/${nueva.id}/editar`);
        } else {
            setLoading(false);
        }
    };

    const crearDesdeAsistente = async (e: React.FormEvent) => {
        e.preventDefault();
        const materiaFinal = nuevaMateriaModo ? materia : (materia || existenteMaterias[0] || 'General');
        if (!tema) return;
        setLoading(true);

        const res = await fetch('/api/clases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: `Clase sobre: ${tema}`,
                materia: materiaFinal,
                resumen: `Objetivos generados para nivel ${nivel}:\n${objetivos}`,
                estado: 'borrador',
                bloques: [
                    {
                        tipo: 'portada',
                        propiedades: {
                            titulo: tema,
                            subtitulo: `Nivel: ${nivel}`,
                            materia: materiaFinal
                        }
                    },
                    {
                        tipo: 'texto-intro',
                        propiedades: {
                            titulo: 'Introducción a la clase',
                            contenido: `En esta sesión trabajaremos sobre ${tema}.`
                        }
                    },
                    {
                        tipo: 'sugerencia-ia',
                        propiedades: {
                            prompt: `Continuar la clase sobre ${tema} con bloques para los objetivos: ${objetivos}`,
                            estado: 'idle'
                        }
                    }
                ]
            })
        });

        if (res.ok) {
            const nueva = await res.json();
            router.push(`/clases/${nueva.id}/editar`);
        } else {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Crear Nueva Clase</h1>
                <p className={styles.subtitle}>Elegí cómo querés empezar tu próxima presentación</p>
            </header>

            {modo === 'seleccion' && (
                <div className={styles.optionsGrid}>
                    <div className={styles.optionCard} onClick={() => setModo('plantilla')}>
                        <div className={styles.iconWrapper} style={{ background: 'var(--color-accent-light)' }}>
                            <LayoutTemplate size={32} color="var(--color-accent)" />
                        </div>
                        <h2>Desde Plantilla</h2>
                        <p>Empezá con una estructura de bloques predefinida y rellená el contenido.</p>
                        <div className={styles.arrow}><ArrowRight size={20} /></div>
                    </div>

                    <div className={styles.optionCard} onClick={() => setModo('asistente')}>
                        <div className={styles.iconWrapper} style={{ background: 'var(--color-gold-light)' }}>
                            <Sparkles size={32} color="var(--color-gold)" />
                        </div>
                        <h2>Asistente IA</h2>
                        <p>Describí el tema y objetivos. La IA generará una propuesta organizativa de bloques estructurales.</p>
                        <div className={styles.arrow}><ArrowRight size={20} /></div>
                    </div>

                    <div className={styles.optionCard} onClick={async () => {
                        setLoading(true);
                        const res = await fetch('/api/clases', {
                            method: 'POST',
                            body: JSON.stringify({
                                titulo: 'Nueva clase vacía',
                                materia: existenteMaterias[0] || 'General'
                            })
                        });
                        if (res.ok) router.push(`/clases/${(await res.json()).id}/editar`);
                    }}>
                        <div className={styles.iconWrapper} style={{ background: 'var(--color-lista-bg)' }}>
                            <FileText size={32} color="var(--color-lista)" />
                        </div>
                        <h2>En Blanco</h2>
                        <p>Iniciá con un lienzo en blanco y agregá los bloques individuales manualmente.</p>
                        <div className={styles.arrow}><ArrowRight size={20} /></div>
                    </div>
                </div>
            )}

            {/* FLUJO PLANTILLA */}
            {modo === 'plantilla' && (
                <div className={styles.formContainer}>
                    <button className={styles.backBtn} onClick={() => setModo('seleccion')}>&larr; Volver</button>
                    <h2>Nueva clase desde Plantilla</h2>
                    <form onSubmit={crearDesdePlantilla}>
                        <div className={styles.formGroup}>
                            <label>1. Seleccioná una Plantilla</label>
                            <div className={styles.templateGrid}>
                                {plantillas.map(p => (
                                    <label key={p.id} className={`${styles.templateOption} ${plantillaSeleccionada === p.id ? styles.selected : ''}`}>
                                        <input type="radio" name="plantilla" value={p.id} checked={plantillaSeleccionada === p.id} onChange={(e) => setPlantillaSeleccionada(e.target.value)} />
                                        <h4>{p.nombre}</h4>
                                        <p>{p.descripcion}</p>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>2. Título de la clase *</label>
                            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required placeholder="Ej: Diversidad de Coníferas" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>3. Materia</label>
                            <div className={styles.subjectSelection}>
                                {!nuevaMateriaModo ? (
                                    <div className={styles.subjectDropdownRow}>
                                        <select value={materia} onChange={e => setMateria(e.target.value)}>
                                            {existenteMaterias.length > 0 ? (
                                                existenteMaterias.map(m => <option key={m} value={m}>{m}</option>)
                                            ) : (
                                                <option value="General">General</option>
                                            )}
                                        </select>
                                        <button type="button" className={styles.textBtn} onClick={() => setNuevaMateriaModo(true)}>+ Nueva Materia</button>
                                    </div>
                                ) : (
                                    <div className={styles.subjectInputRow}>
                                        <input type="text" value={materia} onChange={e => setMateria(e.target.value)} placeholder="Nombre de la nueva materia" autoFocus />
                                        <button type="button" className={styles.textBtn} onClick={() => setNuevaMateriaModo(false)}>Usar existente</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading || !titulo || !plantillaSeleccionada}>
                            {loading ? 'Creando...' : 'Crear y Editar'}
                        </button>
                    </form>
                </div>
            )}

            {/* FLUJO ASISTENTE IA */}
            {modo === 'asistente' && (
                <div className={styles.formContainer}>
                    <button className={styles.backBtn} onClick={() => setModo('seleccion')}>&larr; Volver</button>
                    <h2>Asistente de Diseño de Clase</h2>
                    <div className={styles.helperText}>
                        Completá este formulario y el sistema generará una propuesta de bloques y secuencia didáctica preparatoria.
                    </div>
                    <form onSubmit={crearDesdeAsistente}>
                        <div className={styles.formGroup}>
                            <label>Tema principal *</label>
                            <input type="text" value={tema} onChange={e => setTema(e.target.value)} required placeholder="De qué trata la clase" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Materia</label>
                            {!nuevaMateriaModo ? (
                                <div className={styles.subjectDropdownRow}>
                                    <select value={materia} onChange={e => setMateria(e.target.value)}>
                                        {existenteMaterias.length > 0 ? (
                                            existenteMaterias.map(m => <option key={m} value={m}>{m}</option>)
                                        ) : (
                                            <option value="General">General</option>
                                        )}
                                    </select>
                                    <button type="button" className={styles.textBtn} onClick={() => setNuevaMateriaModo(true)}>+ Nueva Materia</button>
                                </div>
                            ) : (
                                <div className={styles.subjectInputRow}>
                                    <input type="text" value={materia} onChange={e => setMateria(e.target.value)} placeholder="Nombre de la nueva materia" />
                                    <button type="button" className={styles.textBtn} onClick={() => setNuevaMateriaModo(false)}>Usar existente</button>
                                </div>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Objetivos y conceptos clave</label>
                            <textarea value={objetivos} onChange={e => setObjetivos(e.target.value)} placeholder="Qué querés que los alumnos se lleven de esta clase..." rows={4} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nivel de la audiencia</label>
                            <select value={nivel} onChange={e => setNivel(e.target.value)}>
                                <option value="secundario">Secundario</option>
                                <option value="universitario">Universitario Indroductorio</option>
                                <option value="avanzado">Seminario / Posgrado / Especializado</option>
                                <option value="publico">Público General / Divulgación</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading || !tema}>
                            <Sparkles size={18} /> {loading ? 'Construyendo estructura...' : 'Generar Estructura'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
