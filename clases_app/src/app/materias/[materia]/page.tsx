'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Filter, ArrowLeft } from 'lucide-react';
import { Clase } from '@/types/clase';
import { ClaseCard } from '@/components/dashboard/ClaseCard';
import styles from './page.module.css';

export default function MateriaPage({ params }: { params: { materia: string } }) {
    const { materia: encodedMateria } = params;
    const materiaName = decodeURIComponent(encodedMateria);

    const [clases, setClases] = useState<Clase[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<string>('todos');

    useEffect(() => {
        fetch('/api/clases')
            .then(res => res.json())
            .then(data => {
                const materiaClases = data.filter((c: Clase) => c.materia === materiaName);
                setClases(materiaClases);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching clases:', err);
                setLoading(false);
            });
    }, [materiaName]);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/clases/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setClases(prev => prev.filter(c => c.id !== id));
            } else {
                console.error('Error al eliminar:', await res.text());
                alert('No se pudo eliminar la clase');
            }
        } catch (error) {
            console.error('Error deleting clase:', error);
            alert('Error al intentar eliminar la clase');
        }
    };

    const filteredClases = clases.filter(c => {
        const matchesSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEstado = filterEstado === 'todos' || c.estado === filterEstado;
        return matchesSearch && matchesEstado;
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft size={16} /> Volver a Materias
                    </Link>
                    <h1 className={styles.title}>{materiaName}</h1>
                    <p className={styles.subtitle}>Clases de esta materia</p>
                </div>
                <Link href={`/clases/nueva?materia=${encodeURIComponent(materiaName)}`} className={styles.primaryBtn}>
                    <PlusCircle size={20} />
                    <span>Nueva Clase</span>
                </Link>
            </header>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterBox}>
                    <Filter size={18} className={styles.filterIcon} />
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="borrador">Borradores</option>
                        <option value="lista">Listas para presentar</option>
                        <option value="archivada">Archivadas</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Cargando clases...</div>
            ) : filteredClases.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>No se encontraron clases</h3>
                    <p>Prueba con otros filtros o crea una nueva clase para esta materia.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredClases.map(clase => (
                        <ClaseCard key={clase.id} clase={clase} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
