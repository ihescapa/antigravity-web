'use client';

import { Sidebar } from './Sidebar';
import styles from './MainLayout.module.css';

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.main}>
                {children}
            </div>
        </div>
    );
}
