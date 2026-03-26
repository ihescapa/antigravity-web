"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Maximize, MousePointer2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface TrailPoint {
    x: number;
    y: number;
    timestamp: number;
}

export default function PdfViewer({ propiedades, isPreview, styles }: any) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const nextSlide = () => {
        if (numPages && pageNumber < numPages) {
            setPageNumber(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (pageNumber > 1) {
            setPageNumber(prev => prev - 1);
        }
    };

    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        const elem = document.getElementById("pdf-viewer-wrapper");
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    if (!propiedades.src) {
        return (
            <div className={styles.emptyBlock}>
                <p>No se ha cargado ningún PDF aún.</p>
            </div>
        );
    }

    const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

    // LASER TRAIL LOGIC
    const [isLaserActive, setIsLaserActive] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trailRef = useRef<TrailPoint[]>([]);
    const reqRef = useRef<number>();

    const updateCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = Date.now();
        // Keep points up to 30 seconds
        const maxAge = 30000;

        trailRef.current = trailRef.current.filter(p => now - p.timestamp < maxAge);

        if (trailRef.current.length > 1) {
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)'; // semi transparent red
            ctx.lineWidth = 12;

            for (let i = 0; i < trailRef.current.length; i++) {
                const point = trailRef.current[i];
                const age = now - point.timestamp;
                const opacity = Math.max(0, 0.4 - (age / maxAge) * 0.4);

                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }

                // We draw segments so each can have different opacity if needed, 
                // but for performance, drawing a single path fading out is complex in 2d context.
                // An approximation is fading the whole line based on the oldest point,
                // or drawing multiple line segments. Here we draw multiple segments.
            }
            ctx.stroke();

            // Draw individual fading dots for better effect
            for (let i = 0; i < trailRef.current.length; i++) {
                const point = trailRef.current[i];
                const age = now - point.timestamp;
                const opacity = Math.max(0, 0.5 - (age / maxAge) * 0.5);

                ctx.beginPath();
                ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
                ctx.fill();
            }
        }

        reqRef.current = requestAnimationFrame(updateCanvas);
    }, []);

    useEffect(() => {
        if (isFullscreen && isLaserActive) {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            reqRef.current = requestAnimationFrame(updateCanvas);
        } else {
            trailRef.current = [];
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [isFullscreen, isLaserActive, updateCanvas]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isFullscreen) {
            setLaserPos({ x: e.clientX, y: e.clientY });
            if (isLaserActive && isMouseDown) {
                trailRef.current.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
            }
        }
    };

    // Aumentamos scale significativamente en Fullscreen, pero dejamos que CSS restrinja la medida para que nunca rebalse y mantenga el Aspect Ratio
    const displayScale = isPreview ? scale * 0.8 : (isFullscreen ? 2.5 : scale);

    return (
        <div className={`${styles.pdfContainer} ${isPreview ? styles.previewPdf : ''}`}>
            {propiedades.titulo && !isPreview && <h3 className={styles.pdfTitle}>{propiedades.titulo}</h3>}

            <style>{`
                .fullscreen-pdf {
                    width: 100vw !important;
                    height: 100vh !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin: 0 !important;
                    background-color: black;
                }
                .fullscreen-pdf .react-pdf__Page__canvas {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                    max-width: 100vw !important;
                    max-height: 100vh !important;
                }
            `}</style>

            <div
                className={styles.pdfViewerWrapper}
                id="pdf-viewer-wrapper"
                onMouseMove={handleMouseMove}
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseLeave={() => setIsMouseDown(false)}
                style={{
                    backgroundColor: isFullscreen ? 'black' : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isFullscreen ? '100vw' : '100%',
                    height: isFullscreen ? '100vh' : 'auto',
                    overflow: isFullscreen ? 'hidden' : 'visible',
                    transition: 'background-color 0.5s ease',
                    position: 'relative',
                    cursor: (isFullscreen && isLaserActive) ? 'none' : 'default'
                }}
            >
                {/* CANVAS FOR LASER TRAIL */}
                {isFullscreen && (
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            pointerEvents: 'none',
                            zIndex: 99998
                        }}
                    />
                )}

                {/* CURRENT LASER DOT */}
                {isFullscreen && isLaserActive && (
                    <div
                        style={{
                            position: 'fixed',
                            left: laserPos.x,
                            top: laserPos.y,
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#ff0000',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            zIndex: 99999,
                            boxShadow: '0 0 10px 4px rgba(255, 0, 0, 0.6), 0 0 20px 8px rgba(255, 0, 0, 0.3)',
                            transition: 'left 0.05s linear, top 0.05s linear',
                        }}
                    />
                )}

                {/* SIDEBAR */}
                {isFullscreen && (
                    <div
                        onMouseEnter={() => setIsHoveringSidebar(true)}
                        onMouseLeave={() => setIsHoveringSidebar(false)}
                        style={{
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: isHoveringSidebar ? '220px' : '15px',
                            backgroundColor: isHoveringSidebar ? 'rgba(30, 30, 30, 0.95)' : 'rgba(0, 0, 0, 0)',
                            borderRight: isHoveringSidebar ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            zIndex: 100000,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: isHoveringSidebar ? 'auto' : 'hidden',
                            padding: isHoveringSidebar ? '20px 15px' : '0',
                            backdropFilter: isHoveringSidebar ? 'blur(10px)' : 'none'
                        }}
                    >
                        {isHoveringSidebar ? (
                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {/* LASER TOGGLE */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsLaserActive(!isLaserActive);
                                    }}
                                    style={{
                                        background: isLaserActive ? 'rgba(255, 50, 50, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                        border: isLaserActive ? '1px solid rgba(255, 50, 50, 0.5)' : '1px solid rgba(255,255,255,0.2)',
                                        color: isLaserActive ? '#ff8888' : 'white',
                                        padding: '10px 12px',
                                        textAlign: 'left',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '20px',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <MousePointer2 size={16} />
                                    <span>Láser: {isLaserActive ? 'SI' : 'NO'}</span>
                                </button>

                                <div style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Diapositivas</div>
                                {Array.from({ length: numPages || 0 }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPageNumber(pageNum);
                                        }}
                                        style={{
                                            background: pageNumber === pageNum ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                            border: 'none',
                                            color: pageNumber === pageNum ? 'white' : '#ccc',
                                            fontWeight: pageNumber === pageNum ? 600 : 400,
                                            padding: '8px 12px',
                                            textAlign: 'left',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (pageNumber !== pageNum) Object.assign(e.currentTarget.style, { background: 'rgba(255, 255, 255, 0.05)' });
                                        }}
                                        onMouseLeave={(e) => {
                                            if (pageNumber !== pageNum) Object.assign(e.currentTarget.style, { background: 'transparent' });
                                        }}
                                    >
                                        <div style={{
                                            width: '24px', height: '24px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '4px',
                                            fontSize: '11px'
                                        }}>
                                            {pageNum}
                                        </div>
                                        <span style={{ fontSize: '14px' }}>Filmina {pageNum}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                height: '50px', width: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px',
                                transition: 'opacity 0.2s', opacity: 1
                            }} />
                        )}
                    </div>
                )}

                <Document
                    file={propiedades.src}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className={styles.pdfLoading}>Cargando PDF...</div>}
                    error={<div className={styles.pdfError}>Error al cargar el PDF. Revisa la ruta: {propiedades.src}</div>}
                >
                    <div style={{
                        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease',
                        transform: isFullscreen ? 'scale(1)' : 'scale(1)',
                        display: 'flex', justifyContent: 'center'
                    }}>
                        <Page
                            pageNumber={pageNumber}
                            scale={displayScale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className={isFullscreen ? `fullscreen-pdf ${styles.pdfPage}` : styles.pdfPage}
                        />
                    </div>
                </Document>

                {/* Slide floating controls */}
                <div
                    className={styles.pdfControls}
                    style={{
                        display: 'flex',
                        gap: '8px',
                        zIndex: 1000,
                        position: isFullscreen ? 'fixed' : 'absolute',
                        bottom: isFullscreen ? '30px' : '20px',
                        transition: 'bottom 0.4s ease, background-color 0.4s ease, border-color 0.4s ease',
                        backgroundColor: isFullscreen ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.95)',
                        border: isFullscreen ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--color-border)',
                        color: isFullscreen ? 'white' : 'black',
                        backdropFilter: isFullscreen ? 'blur(12px)' : 'blur(8px)'
                    }}
                >
                    <button
                        onClick={prevSlide}
                        disabled={pageNumber <= 1}
                        className={styles.pdfNavBtn}
                        style={{ color: isFullscreen ? (pageNumber <= 1 ? 'rgba(255,255,255,0.3)' : 'white') : '' }}
                        title="Página anterior"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span className={styles.pdfPageInfo} style={{ color: isFullscreen ? 'rgba(255,255,255,0.9)' : 'inherit' }}>
                        {pageNumber} / {numPages || '--'}
                    </span>
                    <button
                        onClick={nextSlide}
                        disabled={!numPages || pageNumber >= numPages}
                        className={styles.pdfNavBtn}
                        style={{ color: isFullscreen ? (!numPages || pageNumber >= numPages ? 'rgba(255,255,255,0.3)' : 'white') : '' }}
                        title="Página siguiente"
                    >
                        <ChevronRight size={24} />
                    </button>
                    <div style={{ width: '10px' }} /> {/* Spacer */}
                    <button
                        onClick={toggleFullscreen}
                        className={styles.pdfNavBtn}
                        style={{ color: isFullscreen ? 'white' : '' }}
                        title={isFullscreen ? "Salir Pantalla Completa" : "Pantalla Completa"}
                    >
                        <Maximize size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
