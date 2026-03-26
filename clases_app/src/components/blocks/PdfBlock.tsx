"use client";

import dynamic from 'next/dynamic';
import { PropiedadesPdf } from '@/types/clase';
import styles from './BlockRenderer.module.css';

// Dynamically import the whole viewer client-side
const PdfViewer = dynamic(() => import('./PdfViewer'), {
    ssr: false,
    loading: () => <div className={styles.pdfLoading}>Cargando componente PDF...</div>
});

interface Props {
    propiedades: PropiedadesPdf;
    isPreview?: boolean;
}

export function PdfBlock({ propiedades, isPreview }: Props) {
    return <PdfViewer propiedades={propiedades} isPreview={isPreview} styles={styles} />;
}
