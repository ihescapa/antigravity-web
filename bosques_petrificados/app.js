/* ============================================================
   BOSQUES PETRIFICADOS — app.js
   Lógica principal: mapa, filtros, carga de datos, exportación
   ============================================================ */

// ── ESTADO GLOBAL ────────────────────────────────────────────
const STATE = {
    map: null,
    basemap: 'satellite',
    layers: { candidates: null, reference: null },
    allFeatures: [],       // todos los candidatos GEE cargados
    refFeatures: [],       // sitios conocidos
    selectedPoint: null,     // punto seleccionado en detalle
    filters: {
        scoreMin: 30,
        areaMin: 900,
        formations: []
    }
};

// ── BASEMAPS ─────────────────────────────────────────────────
const BASEMAPS = {
    satellite: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Esri World Imagery', maxZoom: 19 }
    ),
    topo: L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenTopoMap', maxZoom: 17 }
    ),
    geo: L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap', maxZoom: 19 }
    )
};

// ── INICIALIZACIÓN DEL MAPA ───────────────────────────────────
function initMap() {
    STATE.map = L.map('map', {
        center: [-44.5, -68.0],  // centro de Chubut
        zoom: 7,
        zoomControl: true,
        layers: [BASEMAPS.satellite]
    });

    STATE.map.zoomControl.setPosition('bottomright');

    // Capa de candidatos (vacía al inicio)
    STATE.layers.candidates = L.layerGroup().addTo(STATE.map);
    STATE.layers.reference = L.layerGroup().addTo(STATE.map);

    // Cargar sitios de referencia
    loadReferenceData();

    // Escuchar click en mapa (para cerrar panel)
    STATE.map.on('click', function () { closeDetail(); });
}

// ── BASEMAP SWITCHER ──────────────────────────────────────────
function setBasemap(name) {
    if (STATE.basemap === name) return;

    // Remover actual
    STATE.map.removeLayer(BASEMAPS[STATE.basemap]);

    // Agregar nuevo
    BASEMAPS[name].addTo(STATE.map);
    BASEMAPS[name].bringToBack();

    STATE.basemap = name;

    // Update button styles
    document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('btn-basemap-' + name);
    if (btn) btn.classList.add('active');
}

// ── COLOR SEGÚN SCORE ─────────────────────────────────────────
function scoreColor(score) {
    if (score >= 70) return '#ff2200';
    if (score >= 50) return '#ff9900';
    if (score >= 30) return '#ffee00';
    return '#88ccff';
}

function scoreLabel(score) {
    if (score >= 70) return 'Muy alto';
    if (score >= 50) return 'Alto';
    if (score >= 30) return 'Medio';
    return 'Bajo';
}

function scoreClass(score) {
    if (score >= 70) return 'high';
    if (score >= 50) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
}

// ── CREAR MARCADOR CANDIDATO ──────────────────────────────────
function createCandidateMarker(feature) {
    const props = feature.properties || {};
    const score = parseFloat(props.score_promedio || props.Score || props.score || 0);
    const lat = feature.geometry.coordinates[1];
    const lon = feature.geometry.coordinates[0];
    const area = parseInt(props.area_m2 || props.area || 0);

    // Radio proporcional al área (mín 8px, máx 22px)
    const radius = Math.min(22, Math.max(8, Math.sqrt(area / 900) * 10));

    const marker = L.circleMarker([lat, lon], {
        radius: radius,
        fillColor: scoreColor(score),
        color: '#000000',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.75
    });

    marker.on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        showDetail(feature, score, lat, lon, area);
    });

    // Tooltip rápido
    marker.bindTooltip(
        `<strong>Score: ${score.toFixed(1)}</strong><br/>
     Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}<br/>
     Área: ${area > 0 ? area.toLocaleString() + ' m²' : 'N/D'}`,
        { direction: 'top', offset: [0, -6] }
    );

    return marker;
}

// ── CREAR MARCADOR DE REFERENCIA ──────────────────────────────
function createReferenceMarker(feature) {
    const props = feature.properties || {};
    const lat = feature.geometry.coordinates[1];
    const lon = feature.geometry.coordinates[0];

    const marker = L.circleMarker([lat, lon], {
        radius: 10,
        fillColor: '#00ff88',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
    });

    marker.bindTooltip(
        `<strong>✅ ${props.nombre}</strong><br/>
     ${props.edad || ''}<br/>
     ${props.formacion || ''}`,
        { direction: 'top', offset: [0, -8] }
    );

    marker.on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        showReferenceDetail(feature, lat, lon);
    });

    return marker;
}

// ── PANEL DE DETALLE ──────────────────────────────────────────
function showDetail(feature, score, lat, lon, area) {
    STATE.selectedPoint = { lat, lon, score, feature };

    const props = feature.properties || {};

    document.getElementById('detail-title').textContent =
        `Candidato — Score ${score.toFixed(1)} (${scoreLabel(score)})`;

    const fields = [
        { label: 'Coordenadas', value: `${lat.toFixed(5)}, ${lon.toFixed(5)}` },
        { label: 'Score probabilidad', value: `${score.toFixed(1)} / 100`, cls: scoreClass(score) },
        { label: 'Área del parche', value: area > 0 ? `${area.toLocaleString()} m²` : 'N/D' },
        { label: 'Formación (campo)', value: props.formacion || 'Sin clasificar' },
        { label: 'Iron Oxide Idx', value: props.iron_oxide ? parseFloat(props.iron_oxide).toFixed(3) : 'N/D' },
        { label: 'Sil. Index', value: props.sil_index ? parseFloat(props.sil_index).toFixed(3) : 'N/D' }
    ];

    const body = document.getElementById('detail-body');
    body.innerHTML = fields.map(f =>
        `<div class="detail-field">
       <span class="df-label">${f.label}</span>
       <span class="df-value ${f.cls || ''}">${f.value}</span>
     </div>`
    ).join('');

    // Links externos
    document.getElementById('btn-open-gearth').href =
        `https://earth.google.com/web/@${lat},${lon},1000a,1000d,35y,0h,0t,0r`;

    document.getElementById('btn-open-sentinel').href =
        `https://apps.sentinel-hub.com/eo-browser/?zoom=14&lat=${lat}&lng=${lon}`;

    document.getElementById('detail-panel').style.display = 'block';
}

function showReferenceDetail(feature, lat, lon) {
    const props = feature.properties || {};
    STATE.selectedPoint = { lat, lon, score: null, feature };

    document.getElementById('detail-title').textContent = `📍 ${props.nombre}`;

    const fields = [
        { label: 'Tipo', value: props.tipo?.replace(/_/g, ' ') || '—' },
        { label: 'Edad', value: props.edad || '—' },
        { label: 'Formación', value: props.formacion || '—' },
        { label: 'Tronco máx.', value: props.troncos_max_m ? `${props.troncos_max_m} m de largo` : 'N/D' },
        { label: 'Diámetro máx.', value: props.diametro_max_m ? `${props.diametro_max_m} m` : 'N/D' },
        { label: 'Acceso', value: props.acceso || '—' }
    ];

    const body = document.getElementById('detail-body');
    body.innerHTML = `
    <div class="detail-field" style="grid-column: 1/-1;">
      <span class="df-label">Descripción</span>
      <span class="df-value" style="font-family:inherit; font-size:12px;">${props.descripcion || '—'}</span>
    </div>
    ${fields.map(f =>
        `<div class="detail-field">
         <span class="df-label">${f.label}</span>
         <span class="df-value">${f.value}</span>
       </div>`
    ).join('')}
  `;

    document.getElementById('btn-open-gearth').href =
        `https://earth.google.com/web/@${lat},${lon},1000a,2000d,35y,0h,0t,0r`;

    document.getElementById('btn-open-sentinel').href =
        `https://apps.sentinel-hub.com/eo-browser/?zoom=13&lat=${lat}&lng=${lon}`;

    document.getElementById('detail-panel').style.display = 'block';
}

function closeDetail() {
    document.getElementById('detail-panel').style.display = 'none';
    STATE.selectedPoint = null;
}

function copyCoords() {
    if (!STATE.selectedPoint) return;
    const txt = `${STATE.selectedPoint.lat.toFixed(6)}, ${STATE.selectedPoint.lon.toFixed(6)}`;
    navigator.clipboard.writeText(txt).then(() => {
        const btn = document.getElementById('btn-copy-coords');
        btn.textContent = '✅ Copiado!';
        setTimeout(() => { btn.textContent = '📋 Copiar coords'; }, 2000);
    });
}

// ── CARGAR DATOS DE REFERENCIA ────────────────────────────────
const REFERENCE_DATA = {
    "type": "FeatureCollection",
    "name": "Sitios de Madera Petrificada — Patagonia Argentina",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "nombre": "Bosque Petrificado Sarmiento",
                "provincia": "Chubut",
                "edad": "Cretácico (65 Ma)",
                "formacion": "Grupo Sarmiento",
                "tipo": "area_protegida",
                "descripcion": "Área Natural Protegida y Monumento Natural. ~1900 ha. Troncos de coníferas silicificadas con anillos de crecimiento visibles. Colores ocres, rojizos y amarillentos.",
                "troncos_max_m": 30,
                "diametro_max_m": 1.5,
                "acceso": "30 km al sur de Sarmiento (Chubut). Acceso por ruta 25.",
                "coordenadas_ref": "[-68.93, -45.59]",
                "calidad_referencia": "alta",
                "notas": "Sitio de calibración primario. Flora y fauna del Cretácico, Terciario e Inferior y Cuaternario."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -68.93,
                    -45.59
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Bosque Petrificado Florentino Ameghino",
                "provincia": "Chubut",
                "edad": "Cretácico-Eoceno",
                "formacion": "Formación Florentino Ameghino",
                "tipo": "yacimiento_privado",
                "descripcion": "Descubierto en 1998. Campo privado a ~90 km de Trelew, valle inferior del Río Chubut. Contiene troncos de lauráceas y fagáceas de hasta 40 m de alto y 2.5 m de diámetro. Restos de hasta 25 m de largo.",
                "troncos_max_m": 25,
                "diametro_max_m": 2.5,
                "acceso": "~90 km de Trelew. Campo privado, acceso restringido.",
                "coordenadas_ref": "[-66.45, -43.35]",
                "calidad_referencia": "media",
                "notas": "Uno de los troncos más grandes conocidos en Chubut. Coordenadas aproximadas."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -66.45,
                    -43.35
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Parque Paleontológico Bryn Gwyn",
                "provincia": "Chubut",
                "edad": "Eoceno-Mioceno (40-14 Ma)",
                "formacion": "Grupo Sarmiento (superior)",
                "tipo": "parque_paleontologico",
                "descripcion": "Primer parque paleontológico de Sudamérica. Cerca de Gaiman / Trelew. Badlands eocenos con fósiles de vertebrados y vegetales. Exhibe 40 millones de años de historia geológica.",
                "troncos_max_m": null,
                "diametro_max_m": null,
                "acceso": "8 km de Gaiman. Acceso público.",
                "coordenadas_ref": "[-65.52, -43.35]",
                "calidad_referencia": "media",
                "notas": "Bueno como referencia espectral de formación Sarmiento. Foco en vertebrados pero contexto geológico relevante."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -65.52,
                    -43.35
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Formación Laguna del Hunco (sector norte)",
                "provincia": "Chubut",
                "edad": "Eoceno (~52 Ma)",
                "formacion": "Formación Laguna del Hunco",
                "tipo": "yacimiento_cientifico",
                "descripcion": "Noroeste de Chubut, en el Complejo Volcánico Chubut Medio. Flora tropical excepcionalmente conservada del Eoceno. Clima tropical durante el Máximo Térmico del Cenozoico. Una de las floras fósiles más diversas del mundo.",
                "troncos_max_m": null,
                "diametro_max_m": null,
                "acceso": "Noroeste de Chubut. Terreno volcánico.",
                "coordenadas_ref": "[-70.5, -43.5]",
                "calidad_referencia": "media",
                "notas": "Conectado con flora de Australasia. Angiospermas y helechos."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -70.5,
                    -43.5
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Bosque Petrificado de Jaramillo",
                "provincia": "Santa Cruz",
                "edad": "Jurásico-Cretácico (65 Ma)",
                "formacion": "Formación La Matilde",
                "tipo": "parque_nacional",
                "descripcion": "Monumento Natural Nacional en Santa Cruz. El bosque petrificado más grande del hemisferio sur. Troncos araucarioides de hasta 35 m de largo y 3 m de diámetro. REFERENCIA ESPECTRAL para calibrar el detector.",
                "troncos_max_m": 35,
                "diametro_max_m": 3.0,
                "acceso": "220 km al oeste de Caleta Olivia.",
                "coordenadas_ref": "[-68.02, -47.70]",
                "calidad_referencia": "alta",
                "notas": "Fuera de Chubut pero óptimo para calibración espectral — misma mineralogía de silicificación. Usar como muestra de entrenamiento GEE."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -68.02,
                    -47.70
                ]
            }
        }
    ]
};

function loadReferenceData() {
    const geojson = REFERENCE_DATA;
    STATE.refFeatures = geojson.features;
    STATE.layers.reference.clearLayers();
    geojson.features.forEach(f => {
        if (f.geometry?.type === 'Point') {
            STATE.layers.reference.addLayer(createReferenceMarker(f));
        }
    });
}

// ── CARGAR ARCHIVO GEE ────────────────────────────────────────
function loadGEOJSON(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const geojson = JSON.parse(e.target.result);
            const features = geojson.features || [];

            STATE.allFeatures = features.filter(f =>
                f.geometry?.type === 'Point' || f.geometry?.type === 'Polygon'
            );

            applyFilters();
            updateStats();

            const notice = document.getElementById('upload-zone');
            notice.innerHTML = `
        <div class="upload-icon">✅</div>
        <p><strong>${STATE.allFeatures.length} candidatos</strong> cargados.<br/>
        Archivo: <code>${file.name}</code></p>
      `;
        } catch {
            alert('El archivo no es un GeoJSON válido. Asegurate de exportarlo desde GEE con el formato correcto.');
        }
    };
    reader.readAsText(file);
}

// ── FILTRAR Y RENDERIZAR ──────────────────────────────────────
function applyFilters() {
    const scoreMin = parseInt(document.getElementById('score-min').value);
    const areaMin = parseInt(document.getElementById('area-min').value);
    const checked = Array.from(document.querySelectorAll('.form-check:checked')).map(c => c.value);

    STATE.filters = { scoreMin, areaMin, formations: checked };
    STATE.layers.candidates.clearLayers();

    let visible = 0;

    STATE.allFeatures.forEach(f => {
        const props = f.properties || {};
        const score = parseFloat(props.score_promedio || props.Score || props.score || 0);
        const area = parseInt(props.area_m2 || props.area || 0);
        const form = props.formacion || 'Pendiente verificación campo';

        const pass = score >= scoreMin
            && area >= areaMin
            && checked.some(c => form.includes(c) || c === form);

        if (pass) {
            if (f.geometry?.type === 'Point') {
                STATE.layers.candidates.addLayer(createCandidateMarker(f));
            }
            visible++;
        }
    });

    document.getElementById('stat-visible').textContent = visible;
}

// ── ESTADÍSTICAS ─────────────────────────────────────────────
function updateStats() {
    const features = STATE.allFeatures;
    if (!features.length) return;

    const scores = features.map(f => {
        const p = f.properties || {};
        return parseFloat(p.score_promedio || p.Score || p.score || 0);
    });

    const areas = features.map(f => {
        const p = f.properties || {};
        return parseInt(p.area_m2 || p.area || 0);
    });

    document.getElementById('stat-total').textContent = features.length;
    document.getElementById('stat-high').textContent = scores.filter(s => s > 60).length;
    document.getElementById('stat-visible').textContent = features.length;

    const meanArea = areas.length ? Math.round(areas.reduce((a, b) => a + b, 0) / areas.length) : 0;
    document.getElementById('stat-area').textContent = meanArea > 0 ? `${meanArea.toLocaleString()} m²` : '—';
}

// ── FIT TO DATA ───────────────────────────────────────────────
function fitToData() {
    const allMarkers = [];

    STATE.layers.candidates.eachLayer(m => {
        if (m.getLatLng) allMarkers.push(m.getLatLng());
    });
    STATE.layers.reference.eachLayer(m => {
        if (m.getLatLng) allMarkers.push(m.getLatLng());
    });

    if (allMarkers.length) {
        STATE.map.fitBounds(L.latLngBounds(allMarkers).pad(0.1));
    } else {
        STATE.map.setView([-44.5, -68.0], 7);
    }
}

// ── EXPORT KMZ (como KML dentro de ZIP) ──────────────────────
function exportKMZ() {
    const visible = [];
    STATE.layers.candidates.eachLayer(m => {
        if (m.getLatLng && m.feature) visible.push(m.feature);
    });

    if (!visible.length && !STATE.allFeatures.length) {
        alert('No hay candidatos para exportar. Cargá un archivo GeoJSON desde GEE primero.');
        return;
    }

    const features = visible.length ? visible : STATE.allFeatures;

    const placemarks = features.map((f, i) => {
        const p = f.properties || {};
        const lon = f.geometry.coordinates[0].toFixed(6);
        const lat = f.geometry.coordinates[1].toFixed(6);
        const score = parseFloat(p.score_promedio || p.Score || p.score || 0).toFixed(1);
        const area = parseInt(p.area_m2 || p.area || 0);

        return `  <Placemark>
    <name>Candidato ${i + 1} (Score: ${score})</name>
    <description>Score: ${score}/100 | Área: ${area} m² | Formación: ${p.formacion || 'N/D'}</description>
    <Style>
      <IconStyle>
        <color>${scoreKMLColor(parseFloat(score))}</color>
        <scale>1.0</scale>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon>
      </IconStyle>
    </Style>
    <Point><coordinates>${lon},${lat},0</coordinates></Point>
  </Placemark>`;
    }).join('\n');

    const refMarks = STATE.refFeatures.map(f => {
        const p = f.properties || {};
        const lon = f.geometry.coordinates[0].toFixed(6);
        const lat = f.geometry.coordinates[1].toFixed(6);
        return `  <Placemark>
    <name>✅ ${p.nombre}</name>
    <description>${p.descripcion || ''}</description>
    <Style><IconStyle><color>ff44ff22</color><scale>1.2</scale></IconStyle></Style>
    <Point><coordinates>${lon},${lat},0</coordinates></Point>
  </Placemark>`;
    }).join('\n');

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>Bosques Petrificados Chubut — Candidatos</name>
  <description>Generado con Buscador de Bosques Petrificados (Sentinel-2 / GEE)</description>
  <Folder>
    <name>Candidatos detectados</name>
${placemarks}
  </Folder>
  <Folder>
    <name>Sitios de referencia</name>
${refMarks}
  </Folder>
</Document>
</kml>`;

    downloadText(kml, 'candidatos_bosques_petrificados_chubut.kml', 'application/vnd.google-earth.kml+xml');
}

function scoreKMLColor(score) {
    // KML: aabbggrr
    if (score >= 70) return 'ff2222ff';  // rojo
    if (score >= 50) return 'ff0099ff';  // naranja
    if (score >= 30) return 'ff00eeff';  // amarillo
    return 'ffff8800';                   // azul claro
}

// ── EXPORT CSV ────────────────────────────────────────────────
function exportCSV() {
    const features = STATE.allFeatures;
    if (!features.length) {
        alert('No hay candidatos para exportar. Cargá un archivo GeoJSON desde GEE primero.');
        return;
    }

    const header = 'id,lat,lon,score_promedio,area_m2,formacion\n';
    const rows = features.map((f, i) => {
        const p = f.properties || {};
        const lon = f.geometry.coordinates[0].toFixed(6);
        const lat = f.geometry.coordinates[1].toFixed(6);
        return [
            i + 1,
            lat,
            lon,
            parseFloat(p.score_promedio || p.Score || p.score || 0).toFixed(1),
            parseInt(p.area_m2 || p.area || 0),
            `"${p.formacion || 'Sin clasificar'}"`
        ].join(',');
    }).join('\n');

    downloadText(header + rows, 'candidatos_bosques_petrificados_chubut.csv', 'text/csv');
}

function downloadText(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ── SLIDERS (live update) ─────────────────────────────────────
document.getElementById('score-min').addEventListener('input', function () {
    document.getElementById('score-min-val').textContent = this.value;
});

document.getElementById('area-min').addEventListener('input', function () {
    const val = parseInt(this.value);
    const label = val === 0 ? 'Sin mínimo' : `${val.toLocaleString()} m²`;
    document.getElementById('area-min-val').textContent = label;
});

// ── FILE UPLOAD ───────────────────────────────────────────────
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');

uploadZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', function () {
    if (this.files[0]) loadGEOJSON(this.files[0]);
});

uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) loadGEOJSON(e.dataTransfer.files[0]);
});

// ── ARRANCAR ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    document.getElementById('btn-basemap-sat').classList.add('active');

    // Simular algunos puntos de muestra para que la app no quede vacía
    STATE.allFeatures = SAMPLE_CANDIDATES;
    applyFilters();
    updateStats();
});

// ── DATOS DE MUESTRA (antes de usar GEE real) ─────────────────
// Puntos ficticios en zonas geológicamente plausibles de Chubut
// REEMPLAZAR con los datos reales exportados de GEE
const SAMPLE_CANDIDATES = [
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-68.85, -45.52] },
        properties: { score_promedio: 78.4, area_m2: 4500, formacion: 'Grupo Sarmiento', iron_oxide: '2.41', sil_index: '0.81' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-68.95, -45.65] },
        properties: { score_promedio: 65.2, area_m2: 2700, formacion: 'Grupo Sarmiento', iron_oxide: '1.98', sil_index: '0.67' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-69.12, -45.48] },
        properties: { score_promedio: 82.0, area_m2: 9000, formacion: 'Grupo Sarmiento', iron_oxide: '2.87', sil_index: '0.93' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-70.45, -43.41] },
        properties: { score_promedio: 54.1, area_m2: 1800, formacion: 'Fm. Laguna del Hunco', iron_oxide: '1.62', sil_index: '0.55' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-70.38, -43.55] },
        properties: { score_promedio: 71.3, area_m2: 5400, formacion: 'Fm. Laguna del Hunco', iron_oxide: '2.21', sil_index: '0.76' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-66.51, -43.40] },
        properties: { score_promedio: 88.5, area_m2: 12600, formacion: 'Fm. Florentino Ameghino', iron_oxide: '3.10', sil_index: '1.02' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-66.32, -43.28] },
        properties: { score_promedio: 47.8, area_m2: 1800, formacion: 'Pendiente verificación campo', iron_oxide: '1.45', sil_index: '0.48' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-67.80, -45.10] },
        properties: { score_promedio: 39.2, area_m2: 900, formacion: 'Grupo Chubut', iron_oxide: '1.31', sil_index: '0.37' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-67.55, -44.88] },
        properties: { score_promedio: 61.7, area_m2: 3600, formacion: 'Grupo Chubut', iron_oxide: '1.85', sil_index: '0.63' }
    },
    {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-69.05, -45.72] },
        properties: { score_promedio: 73.9, area_m2: 6300, formacion: 'Grupo Sarmiento', iron_oxide: '2.35', sil_index: '0.79' }
    }
];
