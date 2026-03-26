import Link from 'next/link';
import { useState } from 'react';
import { Calendar, Clock, BookOpen, MoreVertical, Trash2 } from 'lucide-react';
import { Clase } from '@/types/clase';
import styles from './ClaseCard.module.css';

interface Props {
    clase: Clase;
    onDelete?: (id: string) => void;
}

const estadoMap = {
    borrador: { label: 'Borrador', color: 'var(--color-borrador)', bg: 'var(--color-borrador-bg)' },
    lista: { label: 'Lista', color: 'var(--color-lista)', bg: 'var(--color-lista-bg)' },
    archivada: { label: 'Archivada', color: 'var(--color-archivada)', bg: 'var(--color-archivada-bg)' },
};

function formatDate(isoString: string) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-AR', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).format(date);
}

export function ClaseCard({ clase, onDelete }: Props) {
    const estado = estadoMap[clase.estado];
    const [showMenu, setShowMenu] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDeleteClick = () => {
        if (confirmDelete && onDelete) {
            onDelete(clase.id);
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000); // Reset after 3s
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div
                    className={styles.estado}
                    style={{ color: estado.color, backgroundColor: estado.bg }}
                >
                    {estado.label}
                </div>
                <div className={styles.menuContainer}>
                    <button
                        className={styles.menuBtn}
                        onClick={() => setShowMenu(!showMenu)}
                        title="Opciones"
                    >
                        <MoreVertical size={16} />
                    </button>
                    {showMenu && (
                        <div className={styles.dropdown}>
                            <button
                                className={`${styles.dropdownItem} ${confirmDelete ? styles.dropdownItemDangerConfirm : styles.dropdownItemDanger}`}
                                onClick={handleDeleteClick}
                            >
                                <Trash2 size={14} />
                                {confirmDelete ? '¿Seguro? Borrar' : 'Eliminar Clase'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.materia}>
                    <BookOpen size={14} />
                    <span>{clase.materia || 'Sin materia'}</span>
                </div>

                <h3 className={styles.titulo}>{clase.titulo}</h3>
                <p className={styles.subtitulo}>{clase.subtitulo}</p>

                <div className={styles.meta}>
                    <span className={styles.metaItem}>
                        <Calendar size={13} />
                        {formatDate(clase.updatedAt)}
                    </span>
                    <span className={styles.metaItem}>
                        <Clock size={13} />
                        {clase.bloques?.length || 0} bloques
                    </span>
                </div>
            </div>

            <div className={styles.actions}>
                <Link href={`/clases/${clase.id}/editar`} className={styles.editBtn}>
                    Editar
                </Link>
                <Link href={`/clases/${clase.id}/presentar`} className={styles.presentBtn}>
                    Presentar
                </Link>
            </div>
        </div>
    );
}
