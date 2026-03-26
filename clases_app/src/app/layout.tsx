import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
    title: 'Clases | Sistema Docente',
    description: 'Sistema maestro para crear, gestionar y presentar clases interactivas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <AuthProvider>
                    <MainLayout>{children}</MainLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
