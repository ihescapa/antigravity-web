// Tipo de clase y sus bloques

export type EstadoClase = 'borrador' | 'lista' | 'archivada';

export type TipoBloque =
    | 'portada'
    | 'texto-intro'
    | 'texto-columnas'
    | 'imagen'
    | 'galeria'
    | 'tarjetas'
    | 'acordeon'
    | 'linea-tiempo'
    | 'pregunta'
    | 'quiz'
    | 'actividad'
    | 'cierre'
    | 'bibliografia'
    | 'pdf'
    | 'imagen-interactiva'
    | 'imagen-texto'
    | 'imagen-superpuesta'
    | 'imagen-doble'
    | 'imagen-ia'
    | 'sugerencia-ia'
    | 'importador-ia';

// --- Propiedades específicas de cada tipo de bloque ---

export interface PropiedadesPortada {
    titulo: string;
    subtitulo: string;
    imagen?: string;
    autor?: string;
    materia?: string;
}

export interface PropiedadesTextoIntro {
    titulo?: string;
    contenido: string;
}

export interface PropiedadesTextoColumnas {
    titulo?: string;
    columnaIzquierda: string;
    columnaDerecha: string;
}

export interface PropiedadesImagen {
    src: string;
    epigrafe?: string;
    alt?: string;
    tamano?: 'pequena' | 'mediana' | 'grande' | 'completa';
    posicion?: 'izquierda' | 'centro' | 'derecha';
}

export interface PropiedadesGaleria {
    titulo?: string;
    imagenes: Array<{
        src: string;
        epigrafe?: string;
        alt?: string;
    }>;
}

export interface PropiedadesTarjetas {
    titulo?: string;
    tarjetas: Array<{
        titulo: string;
        contenido: string;
        icono?: string;
        color?: string;
    }>;
}

export interface PropiedadesAcordeon {
    titulo?: string;
    items: Array<{
        pregunta: string;
        respuesta: string;
    }>;
}

export interface PropiedadesLineaTiempo {
    titulo?: string;
    hitos: Array<{
        fecha: string;
        titulo: string;
        descripcion?: string;
        imagen?: string;
    }>;
}

export interface PropiedadesPregunta {
    pregunta: string;
    contexto?: string;
    sugerencias?: string[];
}

export interface OpcionQuiz {
    texto: string;
    correcta: boolean;
    explicacion?: string;
}

export interface PropiedadesQuiz {
    pregunta: string;
    opciones: OpcionQuiz[];
    explicacionFinal?: string;
}

export interface PropiedadesActividad {
    titulo: string;
    consigna: string;
    tiempo?: string;
    materiales?: string[];
    grupal?: boolean;
}

export interface PropiedadesCierre {
    titulo?: string;
    resumen: string;
    conceptosClave?: string[];
    proximaClase?: string;
}

export interface PropiedadesBibliografia {
    titulo?: string;
    items: Array<{
        texto: string;
        url?: string;
        tipo?: 'libro' | 'articulo' | 'web' | 'video' | 'otro';
    }>;
}

export interface PropiedadesPdf {
    titulo?: string;
    src: string;
}

export interface PropiedadesImagenInteractiva {
    src?: string;
    escala: number; // 1.0 = 100%
    rotacion: number; // Grados 0-360
    posicionX: number; // Porcentaje o pixeles de offset
    posicionY: number;
}

export interface PropiedadesImagenTexto {
    titulo?: string;
    texto: string;
    imagenSrc?: string;
    imagenAlt?: string;
    posicionImagen: 'izquierda' | 'derecha';
}

export interface PropiedadesImagenSuperpuesta {
    imagenSrc?: string;
    textoAlternativo?: string;
    titulo: string;
    descripcion: string;
    filtroOscuro?: boolean;
}

export interface PropiedadesImagenDoble {
    titulo?: string;
    imagen1Src?: string;
    epigrafe1?: string;
    imagen2Src?: string;
    epigrafe2?: string;
}

export interface PropiedadesImagenIA {
    prompt: string;
    estilo: 'realista' | 'ilustración' | 'vintage' | 'esquema';
    url?: string;
    generando?: boolean;
}

export interface PropiedadesSugerenciaIA {
    prompt: string;
    resultado?: Omit<Bloque, 'id'>[];
    estado: 'idle' | 'generando' | 'completado' | 'error';
}

export interface PropiedadesImportadorIA {
    textoOriginal: string;
    resultado?: Omit<Bloque, 'id'>[];
    estado: 'idle' | 'generando' | 'completado' | 'error';
}

// Mapa de propiedades por tipo
export interface PropiedadesBloquePorTipo {
    portada: PropiedadesPortada;
    'texto-intro': PropiedadesTextoIntro;
    'texto-columnas': PropiedadesTextoColumnas;
    imagen: PropiedadesImagen;
    'imagen-interactiva': PropiedadesImagenInteractiva;
    galeria: PropiedadesGaleria;
    tarjetas: PropiedadesTarjetas;
    acordeon: PropiedadesAcordeon;
    'linea-tiempo': PropiedadesLineaTiempo;
    pregunta: PropiedadesPregunta;
    quiz: PropiedadesQuiz;
    actividad: PropiedadesActividad;
    cierre: PropiedadesCierre;
    bibliografia: PropiedadesBibliografia;
    pdf: PropiedadesPdf;
    'imagen-texto': PropiedadesImagenTexto;
    'imagen-superpuesta': PropiedadesImagenSuperpuesta;
    'imagen-doble': PropiedadesImagenDoble;
    'imagen-ia': PropiedadesImagenIA;
    'sugerencia-ia': PropiedadesSugerenciaIA;
    'importador-ia': PropiedadesImportadorIA;
}

// Bloque genérico
export interface Bloque<T extends TipoBloque = TipoBloque> {
    id: string;
    tipo: T;
    propiedades: T extends keyof PropiedadesBloquePorTipo
    ? PropiedadesBloquePorTipo[T]
    : Record<string, unknown>;
}

// Clase
export interface Clase {
    id: string;
    titulo: string;
    subtitulo: string;
    materia: string;
    resumen: string;
    objetivos: string[];
    etiquetas: string[];
    portada?: string;
    autor: string;
    createdAt: string;
    updatedAt: string;
    estado: EstadoClase;
    bloques: Bloque[];
}

// Plantilla
export interface Plantilla {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    preview?: string;
    bloques: Omit<Bloque, 'id'>[];
    createdAt: string;
}

// Recurso multimedia
export type TipoRecurso = 'imagen' | 'pdf' | 'video' | 'enlace' | 'documento';

export interface Recurso {
    id: string;
    nombre: string;
    tipo: TipoRecurso;
    url: string;
    descripcion?: string;
    etiquetas: string[];
    createdAt: string;
    tamanoBytes?: number;
}
