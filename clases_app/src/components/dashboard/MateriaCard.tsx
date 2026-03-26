'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, MoreVertical, Trash2 } from 'lucide-react';
import styles from '@/app/page.module.css';

interface Props {
    nombre: string;
    clasesCount: number;
    ultimaActualizacion?: string;
    clases: Array<{ id: string; titulo: string }>;
    onDelete?: (nombre: string) => Promise<void>;
}

export function MateriaCard({ nombre, clasesCount, ultimaActualizacion, clases, onDelete }: Props) {
    const [showMenu, setShowMenu] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirmDelete && onDelete) {
            setIsDeleting(true);
            try {
                await onDelete(nombre);
            } catch (error) {
                console.error('Error deleting subject:', error);
                alert('No se pudo eliminar la materia');
                setIsDeleting(false);
                setConfirmDelete(false);
                setShowMenu(false);
            }
        } else {
            setConfirmDelete(true);
            // Reset confirmation after 3 seconds
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    return (
        <div className={styles.materiaCardContainer}>
            <Link href={`/materias/${encodeURIComponent(nombre)}`} className={styles.materiaCard}>
                <div className={styles.materiaHeader}>
                    <div className={styles.materiaIcon}>
                        <BookOpen size={24} />
                    </div>
                    <h2>{nombre}</h2>
                </div>
                <div className={styles.materiaStats}>
                    <span>{clasesCount} {clasesCount === 1 ? 'clase' : 'clases'}</span>
                    {ultimaActualizacion && (
                        <span>Última mod: {new Date(ultimaActualizacion).toLocaleDateString()}</span>
                    )}
                </div>
                <div className={styles.materiaPreview}>
                    <h4>Clases recientes:</h4>
                    <ul>
                        {clases.map(c => (
                            <li key={c.id}>{c.titulo}</li>
                        ))}
                    </ul>
                </div>
            </Link>

            {onDelete && (
                <div className={styles.materiaCardMenu}>
                    <button
                        className={styles.deleteMenuBtn}
                        onClick={toggleMenu}
                        title="Opciones de materia"
                    >
                        <MoreVertical size={18} />
                    </button>

                    {showMenu && (
                        <div className={styles.dropdown}>
                            <button
                                className={`${styles.dropdownItem} ${confirmDelete ? styles.dropdownItemConfirm : ''}`}
                                onClick={handleDeleteClick}
                                disabled={isDeleting}
                            >
                                <Trash2 size={14} />
                                {isDeleting ? 'Borrando...' : confirmDelete ? '¿Seguro? Borrar todo' : 'Eliminar Materia'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
