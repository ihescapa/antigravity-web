const slides = [
    {
        title: "La evolución del trabajo colaborativo",
        bullets: [
            "Transición histórica desde la producción de información en silos aislados y soportes físicos hacia ecosistemas integrados de nube.",
            "Desarrollo de Google Workspace como una plataforma de mediación técnica para la construcción de sentido y conocimiento grupal.",
            "Optimización de la productividad mediante la sincronización instantánea de flujos de trabajo sin barreras geográficas."
        ],
        illustration: "illustration_collaboration_1772904286405.png"
    },
    {
        title: "Instrumento frente al propósito",
        bullets: [
            "La tecnología se define como un medio y no como un fin para la producción y divulgación del conocimiento científico.",
            "El dominio técnico de las herramientas de la suite colaborativa permite una ejecución eficiente de los proyectos académicos.",
            "El propósito fundamental radica en la democratización del saber y en el fortalecimiento de una ciudadanía científica informada."
        ],
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "El origen de la red",
        bullets: [
            "Diseño de ARPANET en los años sesenta como una red descentralizada para asegurar la comunicación institucional ante vulnerabilidades.",
            "Innovación técnica mediante la tecnología de conmutación de paquetes para flexibilizar el envío de fragmentos de información.",
            "Evolución hacia el protocolo TCP/IP que permitió el nacimiento y la expansión global del Internet público."
        ],
        illustration: "illustration_network_global_1772904774156.png"
    },
    {
        title: "La filosofía del sharismo",
        bullets: [
            "Postura filosófica que sostiene que compartir conocimiento y creatividad potencia significativamente la innovación social.",
            "Fomento de la cultura de intercambio en lugar de la competencia para fortalecer las redes de colaboración humana.",
            "Diseño de herramientas colaborativas orientadas a la compartición abierta sin restricciones técnicas ni propietarios locales."
        ],
        citation: '"El conocimiento sólo tiene valor cuando es compartido" — Isaac Mao, pionero del sharismo',
        illustration: "illustration_collaboration_1772904286405.png"
    },
    {
        title: "La web de los noventa",
        bullets: [
            "Masificación de la World Wide Web y el inicio del intercambio global de datos a través de plataformas conectadas.",
            "Limitación operativa por la dependencia de software local y la necesidad de enviar archivos adjuntos de forma constante.",
            "Pérdida de coherencia informativa debido a la fragmentación de datos y al manejo de múltiples versiones de un mismo trabajo."
        ],
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "La organización de la información",
        bullets: [
            "Fundación de Google basada en el algoritmo PageRank para jerarquizar la relevancia de los contenidos web.",
            "Misión estratégica orientada a hacer que la información mundial sea útil, accesible y distribuida de manera sistemática.",
            "Transición de un motor de búsqueda hacia una infraestructura compleja de servicios para la productividad en la nube."
        ],
        logo: "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24dp.svg"
    },
    {
        title: "El hito de Google Docs",
        bullets: [
            "Lanzamiento en el año dos mil seis de la primera herramienta masiva de edición de texto basada enteramente en el navegador.",
            "Transformación radical del flujo de trabajo al permitir que el documento resida en la red y sea accesible simultáneamente.",
            "Eliminación del correo electrónico como canal de envío de archivos, favoreciendo la coautoría en tiempo real."
        ],
        citation: '"Las organizaciones cada vez más implementan estrategias para que el trabajo se haga de manera efectiva y eficaz" — Transcripción Edutin Academy',
        logo: "https://www.gstatic.com/images/branding/product/svg/docs_2020q4_48dp.svg"
    },
    {
        title: "Definición de una suite colaborativa",
        bullets: [
            "Conjunto de aplicaciones interconectadas diseñadas para centralizar la seguridad, el almacenamiento y la comunicación institucional.",
            "Interoperabilidad técnica que garantiza una integración fluida entre procesadores de texto, celdas de datos y presentaciones visuales.",
            "Entorno seguro diseñado para optimizar los procesos de gestión de información dentro de las comunidades educativas."
        ],
        logo: "https://www.gstatic.com/images/branding/product/svg/workspace_48dp.svg"
    },
    {
        title: "Google Drive como núcleo de gestión",
        bullets: [
            "Plataforma de almacenamiento en la nube que elimina la dependencia absoluta de dispositivos de hardware físico.",
            "Acceso universal que permite la gestión de archivos desde cualquier terminal móvil o de escritorio con conexión a la red.",
            "Trazabilidad de la información mediante la auditoría de cambios y la capacidad técnica de recuperación de versiones anteriores."
        ],
        citation: '"Conserva todos tus borradores en un único archivo de Drive y recupera versiones anteriores en cualquier momento" — Centro de Aprendizaje de Google Workspace',
        logo: "https://www.gstatic.com/images/branding/product/svg/drive_2020q4_48dp.svg"
    },
    {
        title: "Organización estratégica de activos",
        bullets: [
            "Jerarquización lógica de la información mediante el uso de carpetas y subcarpetas segmentadas por fases de tareas.",
            "Aplicación de una nomenclatura uniforme para facilitar la localización rápida y eficiente de los activos digitales del equipo.",
            "Sincronización automática de versiones que asegura que todos los colaboradores operen sobre la información más reciente."
        ],
        illustration: "illustration_management_drive_1772904828577.png"
    },
    {
        title: "Protocolos de invitación directa",
        bullets: [
            "Método de acceso vinculado estrictamente a la identidad de una cuenta de correo electrónico específica para máxima seguridad.",
            "Trazabilidad exacta de los ingresos al documento, permitiendo identificar qué usuario accede a la información y en qué momento.",
            "Capacidad de otorgar privilegios diferenciados y personalizados a cada colaborador invitado al proyecto."
        ],
        illustration: "illustration_collaboration_1772904286405.png"
    },
    {
        title: "Gestión mediante enlaces controlados",
        bullets: [
            "Generación de direcciones URL con permisos predefinidos para la distribución interna o masiva de contenidos.",
            "Configuración técnica de accesos que permite restringir la visualización solo a usuarios autorizados o abrirla al público general.",
            "Revocación dinámica de permisos en tiempo real sin necesidad de alterar la ubicación física del archivo en la nube."
        ],
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "Perfil de acceso para lectura",
        bullets: [
            "Restricción técnica que permite la visualización y descarga del contenido pero impide cualquier tipo de alteración de los datos.",
            "Nivel de seguridad ideal para la difusión institucional de manuales, normativas o productos académicos finales.",
            "Protección efectiva del mensaje original contra modificaciones accidentales o no autorizadas por parte de terceros."
        ],
        illustration: "illustration_management_drive_1772904828577.png"
    },
    {
        title: "Perfil de acceso para comentarios",
        bullets: [
            "Habilita la inserción de notas al margen y sugerencias de cambio sin modificar directamente el cuerpo del texto original.",
            "Herramienta fundamental para la mediación pedagógica, la revisión crítica entre pares y la tutoría docente.",
            "Fomento de procesos de coautoría mediante el debate en contexto sobre fragmentos específicos de la información."
        ],
        illustration: "illustration_collaboration_1772904286405.png"
    },
    {
        title: "Perfil de acceso para edición",
        bullets: [
            "Otorgamiento de control operativo total para crear, modificar, mover y eliminar archivos dentro del entorno compartido.",
            "Gestión técnica del equipo que permite invitar a nuevos integrantes y definir sus roles dentro de la estructura del proyecto.",
            "Rol base para el desarrollo dinámico de proyectos grupales donde la edición simultánea es el eje de la producción."
        ],
        illustration: "illustration_collaboration_1772904286405.png"
    },
    {
        title: "Edición avanzada en documentos",
        bullets: [
            "Implementación del modo de sugerencias donde los cambios quedan resaltados y requieren la aprobación formal de un editor.",
            "Uso de menciones específicas mediante el carácter arroba para delegar acciones y tareas a miembros determinados del equipo.",
            "Integración de hilos de conversación que permiten documentar las decisiones editoriales tomadas durante la elaboración del texto."
        ],
        logo: "https://www.gstatic.com/images/branding/product/svg/docs_2020q4_48dp.svg"
    },
    {
        title: "Auditoría mediante historial de versiones",
        bullets: [
            "Registro cronológico detallado de todas las intervenciones y modificaciones realizadas por los distintos colaboradores.",
            "Capacidad de restauración del sistema que permite revertir el archivo a cualquier estado anterior para subsanar errores críticos.",
            "Comparativa visual de estados que facilita la identificación de los aportes realizados por cada integrante del grupo."
        ],
        citation: '"hablar de escritura es hablar también de lectura; una y la otra van de la mano, son dos caras de la misma moneda" — M. Virginia Fuente',
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "Gestión y análisis con hojas de cálculo",
        bullets: [
            "Organización de información cuantitativa para el modelado de presupuestos, cronogramas técnicos y bases de datos.",
            "Uso de funciones estadísticas y matemáticas básicas para la limpieza y el procesamiento automatizado de la información.",
            "Visualización estratégica mediante la creación de gráficos de barras, líneas y sectores para el análisis de resultados."
        ],
        logo: "https://www.gstatic.com/images/branding/product/svg/sheets_2020q4_48dp.svg"
    },
    {
        title: "Interoperabilidad entre hojas y presentaciones",
        bullets: [
            "Sincronización técnica que permite la actualización automática de gráficos en las diapositivas al modificar los datos en la hoja origen.",
            "Mantenimiento de la consistencia visual y de los niveles de permiso a través de todas las aplicaciones de la suite.",
            "Fluidez en la circulación del trabajo desde la etapa de investigación y análisis hasta la exposición visual de los hallazgos."
        ],
        logo: "https://www.gstatic.com/images/branding/product/svg/slides_2020q4_48dp.svg"
    },
    {
        title: "Coordinación con calendario y videoconferencia",
        bullets: [
            "Gestión de hitos y plazos de entrega mediante el uso de calendarios grupales compartidos y notificaciones automáticas.",
            "Integración directa de enlaces para reuniones virtuales en los eventos de agenda para facilitar la comunicación remota.",
            "Técnica de superposición de calendarios para verificar la disponibilidad horaria de los integrantes del equipo de trabajo."
        ],
        logo: "https://www.gstatic.com/images/branding/product/svg/calendar_2020q4_48dp.svg"
    },
    {
        title: "Personalización mediante complementos",
        bullets: [
            "Instalación de aplicaciones de terceros para agregar funcionalidades técnicas no disponibles de forma predeterminada en la suite.",
            "Optimización del tiempo operativo y mejora de la precisión en tareas académicas y de investigación especializadas.",
            "Uso estratégico de extensiones para adaptar las herramientas digitales a las necesidades particulares de cada proyecto de divulgación."
        ],
        illustration: "illustration_management_drive_1772904828577.png"
    },
    {
        title: "Ejemplos de extensiones académicas",
        bullets: [
            "Uso de Mendeley para la gestión automatizada de citas y referencias bibliográficas bajo normas internacionales de escritura científica.",
            "Implementación de Lucidchart para la creación de mapas conceptuales y diagramas de flujo integrados directamente en los documentos.",
            "Aplicación de Grammarly para la corrección de estilo, gramática y ajuste del tono comunicacional según el destinatario."
        ],
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "Inteligencia artificial generativa en la suite",
        bullets: [
            "Introducción de Gemini como un asistente multimodal diseñado para asistir en tareas de redacción, síntesis y generación de ideas.",
            "Automatización de borradores iniciales y resúmenes de hilos de comunicación para potenciar la productividad operativa del usuario.",
            "Uso de la inteligencia artificial como una extensión cognitiva para delegar procesos repetitivos y priorizar la toma de decisiones estratégicas."
        ],
        citation: '"La IA ni es inteligencia ni es artificial" — Carlos Madrid',
        logo: "https://www.gstatic.com/images/branding/product/svg/gemini_48dp.svg"
    },
    {
        title: "Ética y responsabilidad humana en la era de la IA",
        bullets: [
            "Necesidad de una validación crítica constante para identificar alucinaciones y sesgos en los datos generados por modelos de lenguaje.",
            "El ser humano permanece como el único responsable ético y legal de los resultados y decisiones informadas por la tecnología.",
            "Importancia de la protección de la privacidad y el tratamiento ético de los datos personales en los entornos de aprendizaje automático."
        ],
        citation: '"Millones de decisiones se están tomando con base en IA... Por eso siempre debe haber un responsable humano" — Gabriela Ramos, UNESCO',
        illustration: "illustration_ai_future_1772904709623.png"
    },
    {
        title: "Consistencia del sistema como clave del éxito",
        bullets: [
            "Unificación del entorno de trabajo para evitar procesos paralelos que fragmenten la información y dispersen los esfuerzos del equipo.",
            "Adopción disciplinada de protocolos comunes para la organización de carpetas, la nomenclatura de archivos y los permisos de acceso.",
            "La eficiencia del sistema colaborativo depende directamente de su utilización consistente y coordinada por parte de todos los integrantes."
        ],
        illustration: "illustration_collaboration_1772904286405.png"
    },
    {
        title: "Alternativas de mercado y soberanía digital",
        bullets: [
            "Existencia de Microsoft trescientos sesenta y cinco como estándar corporativo que integra software tradicional con capacidades de nube.",
            "Opciones de código abierto como Nextcloud u OnlyOffice que ofrecen mayor control sobre la privacidad y la soberanía de los datos.",
            "Herramientas como Notion o Zoho Office orientadas a la gestión del conocimiento y la productividad mediante bases de datos flexibles."
        ],
        illustration: "illustration_network_global_1772904774156.png"
    },
    {
        title: "Alfabetización informacional y búsqueda estratégica",
        bullets: [
            "La búsqueda efectiva en la red se define como una habilidad que requiere entrenamiento y el uso de estrategias de filtrado crítico.",
            "Formulación de preguntas precisas y evaluación de la fiabilidad de las fuentes antes de integrar la información al proyecto.",
            "Refinamiento iterativo de los resultados para evitar sesgos informativos y asegurar la veracidad del contenido científico producido."
        ],
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "Sintaxis de búsqueda y operadores básicos",
        bullets: [
            "Uso de comillas para localizar frases exactas y el signo menos para excluir términos que generen ambigüedad semántica.",
            "Implementación del comando site para limitar los resultados de búsqueda a dominios institucionales, académicos o gubernamentales."
        ],
        citation: '"Un buen buscador no solo responde lo que pedimos: responde cómo lo pedimos" — Guía de Alfabetización Digital',
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "Comandos avanzados para la localización de datos",
        bullets: [
            "Uso del operador filetype para encontrar documentos con formatos específicos como PDF o planillas de cálculo de manera directa.",
            "Búsqueda dirigida mediante los comandos intitle o inurl para localizar términos presentes únicamente en el título o la dirección web.",
            "Definición de rangos temporales y numéricos para obtener datos estadísticos o históricos actualizados según el estado del arte."
        ],
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "Lógica booleana en la recuperación de información",
        bullets: [
            "Uso del operador OR para recuperar resultados que contengan al menos uno de los términos de interés definidos por el investigador.",
            "Aplicación del asterisco como comodín técnico para reemplazar palabras desconocidas o variables dentro de una frase de búsqueda.",
            "Comprensión del operador AND implícito que asegura que todos los términos de la consulta aparezcan en los resultados finales del buscador."
        ],
        illustration: "illustration_network_global_1772904774156.png"
    },
    {
        title: "Evaluación crítica de la fuente documental",
        bullets: [
            "Análisis riguroso de la procedencia de la información e identificación de la autoridad institucional o académica que respalda el dato.",
            "Contraste de la información obtenida a través de la búsqueda en múltiples repositorios y bases de datos científicas confiables.",
            "Verificación de la fecha de publicación y actualización de la fuente frente al desarrollo reciente del campo de estudio correspondiente."
        ],
        illustration: "illustration_data_search_1772904585025.png"
    },
    {
        title: "Sistematización y organización de la información",
        bullets: [
            "Almacenamiento estratégico de las fuentes halladas en Google Drive para construir una webteca o corpus documental del proyecto.",
            "Respeto absoluto por la propiedad intelectual mediante la cita correcta y la atribución de autoría en todos los documentos producidos.",
            "Generación de resúmenes y síntesis que permitan transformar la información recolectada en conocimiento original y significativo."
        ],
        logo: "https://www.gstatic.com/images/branding/product/svg/drive_2020q4_48dp.svg"
    },
    {
        title: "Glosario técnico de la cultura digital",
        bullets: [
            "Sharismo: filosofía orientada a potenciar el aprendizaje colectivo y la innovación social a través de la compartición abierta.",
            "Add-ons: extensiones instalables que agregan funcionalidades especializadas a las aplicaciones nativas de la suite de trabajo.",
            "Lote masivo: proceso técnico de actualización o creación de múltiples usuarios mediante archivos de formato CSV para optimizar la gestión."
        ],
        illustration: "illustration_management_drive_1772904828577.png"
    },
    {
        title: "Conclusión y perspectiva profesional",
        bullets: [
            "La colaboración en red exige el desarrollo constante de nuevas alfabetizaciones tecnológicas, informacionales y éticas.",
            "El éxito en la producción de conocimiento depende del equilibrio entre el rigor conceptual científico y el uso estratégico de herramientas digitales.",
            "Adaptación constante al cambio tecnológico como un pilar fundamental para la práctica docente y profesional en la era digital."
        ],
        illustration: "illustration_collaboration_1772904286405.png"
    },
    {
        title: "Epílogo sobre el futuro de la colaboración",
        bullets: [
            "Integración progresiva de agentes no humanos y sistemas de inteligencia artificial en los flujos de creación científica y académica.",
            "Necesidad imperativa de establecer marcos éticos globales para guiar el impacto de la tecnología en la dignidad humana y la sociedad."
        ],
        citation: '"Sólo podemos ver un poco del futuro, pero lo suficiente para darnos cuenta de que hay mucho que hacer" — Alan Turing',
        illustration: "illustration_ai_future_1772904709623.png"
    }
];

let currentSlideIndex = 0;
const viewer = document.getElementById('slide-viewer');
const progressBar = document.getElementById('progress-bar');

function renderSlide(index) {
    viewer.innerHTML = '';
    const slideData = slides[index];

    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide active';

    const title = document.createElement('h1');
    title.textContent = slideData.title;
    slideDiv.appendChild(title);

    const content = document.createElement('div');
    content.className = 'slide-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'slide-text';
    const ul = document.createElement('ul');
    slideData.bullets.forEach(bullet => {
        const li = document.createElement('li');
        li.textContent = bullet;
        ul.appendChild(li);
    });
    textDiv.appendChild(ul);
    content.appendChild(textDiv);

    const visualDiv = document.createElement('div');
    visualDiv.className = 'slide-visual';

    if (slideData.logo) {
        const img = document.createElement('img');
        img.src = slideData.logo;
        img.className = 'logo';
        visualDiv.appendChild(img);
    } else if (slideData.illustration) {
        const img = document.createElement('img');
        // Usar la ruta relativa a la carpeta assets
        img.src = 'assets/' + slideData.illustration;
        visualDiv.appendChild(img);
    }

    content.appendChild(visualDiv);
    slideDiv.appendChild(content);

    if (slideData.citation) {
        const citation = document.createElement('div');
        citation.className = 'citation';
        citation.textContent = slideData.citation;
        slideDiv.appendChild(citation);
    }

    viewer.appendChild(slideDiv);
    updateProgress();
}

function updateProgress() {
    const progress = ((currentSlideIndex + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        renderSlide(currentSlideIndex);
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide(currentSlideIndex);
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

window.addEventListener('click', () => {
    nextSlide();
});

// Initial render
renderSlide(currentSlideIndex);
