'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PlusCircle, FolderPlus, Layers } from 'lucide-react';
import { Clase } from '@/types/clase';
import styles from './page.module.css';
import { MateriaCard } from '@/components/dashboard/MateriaCard';

export default function Dashboard() {
    const router = useRouter();
    const { data: session } = useSession();
    const isDocente = session?.user?.role === 'docente';

    const [clases, setClases] = useState<Clase[]>([]);
    const [materiasOficiales, setMateriasOficiales] = useState<{ id: string, nombre: string, color: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [resMaterias, resClases] = await Promise.all([
                fetch('/api/materias').then(r => r.json()),
                fetch('/api/clases').then(r => r.json())
            ]);
            setMateriasOficiales(Array.isArray(resMaterias) ? resMaterias : []);
            setClases(Array.isArray(resClases) ? resClases : []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubject = async (nombre: string) => {
        if (!isDocente) return;
        try {
            const res = await fetch(`/api/clases?materia=${encodeURIComponent(nombre)}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Actualizar la lista local con trim para mayor seguridad
                setClases(prev => prev.filter(c => c.materia.trim() !== nombre.trim()));
            } else {
                const error = await res.json();
                throw new Error(error.error || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
            throw error;
        }
    };

    const handleCreateMateria = async () => {
        const nombre = prompt('Nombre de la nueva materia:');
        if (nombre && nombre.trim()) {
            const res = await fetch('/api/clases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo: `Iniciación: ${nombre.trim()}`,
                    materia: nombre.trim(),
                    estado: 'borrador'
                })
            });
            if (res.ok) {
                loadData();
            }
        }
    };

    // Agrupar por materia oficial
    const materiasMap = new Map<string, Clase[]>();
    materiasOficiales.forEach(m => materiasMap.set(m.nombre, []));

    clases.forEach(c => {
        const mat = c.materia || 'General';
        if (materiasMap.has(mat)) {
            materiasMap.get(mat)!.push(c);
        } else {
            // Si la clase tiene una materia que no está en la lista oficial (por datos viejos), la metemos en la primera o creamos una "Otros"
            materiasMap.set(mat, [c]);
        }
    });

    const materias = Array.from(materiasMap.entries()).map(([nombre, lista]) => {
        const sorted = [...lista].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        return {
            nombre,
            clasesCount: lista.length,
            ultimaActualizacion: sorted[0]?.updatedAt,
            clases: sorted.slice(0, 3)
        };
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Mis Materias</h1>
                    <p className={styles.subtitle}>Seleccioná una materia para ver y gestionar sus clases</p>
                </div>
                {isDocente && (
                    <div className={styles.headerActions}>
                        <button className={styles.materiaAddBtnSecondary} onClick={handleCreateMateria}>
                            <FolderPlus size={18} />
                            <span>Nueva Materia</span>
                        </button>
                        <button className={styles.materiaAddBtn} onClick={() => router.push('/clases/nueva')}>
                            <PlusCircle size={20} />
                            <span>Nueva Clase</span>
                        </button>
                    </div>
                )}
            </header>

            {loading ? (
                <div className={styles.loading}>Cargando materias...</div>
            ) : materias.length === 0 ? (
                <div className={styles.emptyState}>
                    <Layers size={48} className={styles.emptyIcon} />
                    <h3>No tienes ninguna materia aún</h3>
                    <p>Creá tu primera materia o clase para empezar.</p>
                    {isDocente && (
                        <button onClick={handleCreateMateria} className={styles.materiaAddBtn} style={{ marginTop: '20px' }}>
                            Crear Materia
                        </button>
                    )}
                </div>
            ) : (
                <div className={styles.gridMaterias}>
                    {materias.map(m => (
                        <MateriaCard
                            key={m.nombre}
                            nombre={m.nombre}
                            clasesCount={m.clasesCount}
                            ultimaActualizacion={m.ultimaActualizacion}
                            clases={m.clases}
                            onDelete={isDocente ? handleDeleteSubject : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
