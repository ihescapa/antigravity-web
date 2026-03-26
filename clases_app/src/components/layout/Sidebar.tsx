'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen, LayoutDashboard, PlusCircle, FolderOpen,
    Image, BookMarked, ChevronLeft, ChevronRight, LogOut, User
} from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import styles from './Sidebar.module.css';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clases/nueva', label: 'Nueva Clase', icon: PlusCircle, highlight: true },
    { href: '/plantillas', label: 'Plantillas', icon: BookMarked },
    { href: '/recursos', label: 'Recursos', icon: Image },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { data: session } = useSession();

    // Filtramos navItems según rol (el alumno no ve "Nueva Clase")
    const filteredNavItems = navItems.filter(item => {
        if (session?.user?.role === 'alumno' && item.href === '/clases/nueva') return false;
        return true;
    });

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            <div className={styles.brand}>
                <div className={styles.brandIcon}>
                    <BookOpen size={20} />
                </div>
                {!collapsed && (
                    <div className={styles.brandText}>
                        <span className={styles.brandName}>Clases</span>
                        <span className={styles.brandSub}>Sistema Docente</span>
                    </div>
                )}
            </div>

            <nav className={styles.nav}>
                {filteredNavItems.map(({ href, label, icon: Icon, highlight }) => {
                    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`${styles.navItem} ${active ? styles.active : ''} ${highlight ? styles.highlight : ''}`}
                            title={collapsed ? label : undefined}
                        >
                            <Icon size={18} className={styles.navIcon} />
                            {!collapsed && <span className={styles.navLabel}>{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Panel de Usuario */}
            {session?.user && (
                <div className={styles.userPanel}>
                    <div className={styles.userInfo} title={collapsed ? session.user.name || '' : undefined}>
                        <div className={styles.userAvatar}>
                            <User size={16} />
                        </div>
                        {!collapsed && (
                            <div className={styles.userDetails}>
                                <span className={styles.userName}>{session.user.name}</span>
                                <span className={styles.userRole}>{session.user.role === 'docente' ? 'Docente' : 'Alumno'}</span>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/login' })} title="Cerrar sesión">
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            )}

            <button
                className={styles.collapseBtn}
                onClick={() => setCollapsed(c => !c)}
                title={collapsed ? 'Expandir' : 'Contraer'}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </aside>
    );
}
