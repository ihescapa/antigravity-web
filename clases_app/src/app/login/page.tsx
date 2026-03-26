'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, ChevronRight, Lock } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleLogin = async (role: 'docente' | 'alumno') => {
        setIsLoading(role);
        const username = role;
        const password = role + '123';

        const result = await signIn('credentials', {
            username,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push('/');
        } else {
            alert('Error al autenticar');
            setIsLoading(null);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            padding: 'var(--space-6)',
            fontFamily: 'var(--font-inter)'
        }}>
            <div style={{
                background: 'white',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                maxWidth: '800px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-8)'
            }}>
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: 'var(--color-gold-light)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto var(--space-4)'
                    }}>
                        <Lock size={32} color="var(--color-gold)" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', color: 'var(--color-text-primary)' }}>
                        Ecosistema Educativo
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                        Selecciona tu perfil para ingresar a la plataforma
                    </p>
                </div>

                {/* Perfil Docente */}
                <button
                    onClick={() => handleLogin('docente')}
                    disabled={isLoading !== null}
                    style={{
                        background: 'var(--color-slate-800)',
                        border: '2px solid transparent',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-6)',
                        textAlign: 'left',
                        cursor: isLoading !== null ? 'wait' : 'pointer',
                        transition: 'all var(--transition)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-4)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        width: 'fit-content'
                    }}>
                        <BookOpen size={24} color="var(--color-gold)" />
                    </div>
                    <div>
                        <h3 style={{ color: 'white', fontSize: '20px', marginBottom: 'var(--space-2)' }}>Acceso Docente</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
                            Editor de clases completo, gestión de materias, integración con DALL-E e importador IA.
                        </p>
                    </div>
                    <div style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        color: 'var(--color-gold)',
                        fontWeight: 600,
                        fontSize: 'var(--fs-sm)'
                    }}>
                        {isLoading === 'docente' ? 'Ingresando...' : 'Entrar como Docente'}
                        <ChevronRight size={16} />
                    </div>
                </button>

                {/* Perfil Alumno */}
                <button
                    onClick={() => handleLogin('alumno')}
                    disabled={isLoading !== null}
                    style={{
                        background: 'white',
                        border: '2px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-6)',
                        textAlign: 'left',
                        cursor: isLoading !== null ? 'wait' : 'pointer',
                        transition: 'all var(--transition)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-4)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                >
                    <div style={{
                        background: 'var(--color-bg)',
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        width: 'fit-content'
                    }}>
                        <GraduationCap size={24} color="var(--color-accent)" />
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--color-text-primary)', fontSize: '20px', marginBottom: 'var(--space-2)' }}>Acceso Alumno / Público</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
                            Explora las clases como consumidor. Solo visualización e interacción con los módulos.
                        </p>
                    </div>
                    <div style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        color: 'var(--color-accent)',
                        fontWeight: 600,
                        fontSize: 'var(--fs-sm)'
                    }}>
                        {isLoading === 'alumno' ? 'Ingresando...' : 'Entrar como Alumno'}
                        <ChevronRight size={16} />
                    </div>
                </button>
            </div>
        </div>
    );
}
