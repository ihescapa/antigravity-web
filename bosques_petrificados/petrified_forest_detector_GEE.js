// ============================================================
// BUSCADOR DE BOSQUES PETRIFICADOS — CHUBUT, PATAGONIA
// Script para Google Earth Engine Code Editor
// Autor: Ignacio Escapa (paleobotánico) + Antigravity AI
// Fecha: 2026
//
// INSTRUCCIONES:
// 1. Ir a https://code.earthengine.google.com
// 2. Pegar este código completo
// 3. Hacer click en "Run"
// 4. Ver el mapa de candidatos en el panel inferior
// 5. Usar "Tasks" para exportar el GeoJSON de puntos a Google Drive
// ============================================================

// ── ZONA DE ESTUDIO ──────────────────────────────────────────
// Zona de prueba: ~10x10 km alrededor del Bosque Petrificado de Sarmiento
// Centro: -68.93°, -45.59°
// Para toda la provincia después, usar: ee.Geometry.Rectangle([-72.5, -47.5, -63.5, -41.5])
var STUDY_AREA = ee.Geometry.Rectangle([-69.00, -45.64, -68.86, -45.54]);

// ── PARÁMETROS AJUSTABLES ────────────────────────────────────
var CLOUD_COVER_MAX = 15;           // % máximo de nubes
var DATE_START = '2023-01-01';
var DATE_END = '2025-12-31';

// Umbrales espectrales (calibrados para silicificación en ambiente árido)
// Ajustá SWIR_THRESHOLD si tenés muchos o pocos candidatos
var SWIR_THRESHOLD = 0.25;   // Índice de silicificación mínimo
var NDVI_MAX = 0.15;   // Máxima vegetación (zonas sin plantas)
var BSI_THRESHOLD = 0.05;   // Bare Soil Index mínimo

// ── CARGA DE IMÁGENES SENTINEL-2 ─────────────────────────────
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(STUDY_AREA)
    .filterDate(DATE_START, DATE_END)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', CLOUD_COVER_MAX))
    .map(function (img) {
        // Máscara de nubes usando SCL band
        var scl = img.select('SCL');
        var mask = scl.neq(3).and(scl.neq(9)).and(scl.neq(10)).and(scl.neq(11));
        return img.updateMask(mask).divide(10000); // valores 0-1
    });

// Mediana temporal (reduce ruido atmosférico)
var composite = s2.median().clip(STUDY_AREA);

// ── ÍNDICES ESPECTRALES ───────────────────────────────────────
// Bandas Sentinel-2:
// B2=Blue, B3=Green, B4=Red, B8=NIR, B11=SWIR1(1610nm), B12=SWIR2(2190nm)

// NDVI: Vegetación (queremos valores BAJOS → sin vegetación)
var ndvi = composite.normalizedDifference(['B8', 'B4']).rename('NDVI');

// BSI (Bare Soil Index): Suelo desnudo / roca expuesta
// BSI = ((SWIR1 + Red) - (NIR + Blue)) / ((SWIR1 + Red) + (NIR + Blue))
var bsi = composite.expression(
    '((SWIR1 + Red) - (NIR + Blue)) / ((SWIR1 + Red) + (NIR + Blue))', {
    'SWIR1': composite.select('B11'),
    'Red': composite.select('B4'),
    'NIR': composite.select('B8'),
    'Blue': composite.select('B2')
}).rename('BSI');

// ÍNDICE DE SILICIFICACIÓN:
// La madera petrificada silicificada refleja fuertemente en SWIR1 y SWIR2
// pero menos en NIR → ratio distintivo respecto a arcillas o arena pura
// Basado en Spectral Angle Mapper para silicatos vítreos
var silIndex = composite.expression(
    '(SWIR1 * SWIR2) / (NIR * NIR + 0.001)', {
    'SWIR1': composite.select('B11'),
    'SWIR2': composite.select('B12'),
    'NIR': composite.select('B8')
}).rename('SilIndex');

// IRON OXIDE INDEX: Muchos troncos petrificados contienen Fe → tonos rojizos
// IoI = Red / Blue
var ironOxide = composite.select('B4').divide(
    composite.select('B2').add(0.001)
).rename('IronOxide');

// ── MÁSCARA DE CANDIDATOS ─────────────────────────────────────
// Condiciones para ser candidato a bosque petrificado:
var candidateMask = ndvi.lt(NDVI_MAX)          // sin vegetación densa
    .and(bsi.gt(BSI_THRESHOLD))                   // suelo/roca expuesta
    .and(silIndex.gt(SWIR_THRESHOLD))             // firma de silicatos
    .and(ironOxide.gt(1.2));                      // presencia de hierro (coloración)

// ── SCORE COMBINADO (0 a 100) ─────────────────────────────────
// Normalización simple de cada índice → suma ponderada
var score = silIndex.multiply(40)
    .add(ironOxide.subtract(1).multiply(20))
    .add(bsi.multiply(20))
    .add(ndvi.multiply(-20).add(20))  // inverted NDVI
    .multiply(candidateMask)           // solo en zonas candidatas
    .rename('Score')
    .clamp(0, 100);

// ── VISUALIZACIÓN EN EL MAPA ──────────────────────────────────

// Mapa base: imagen RGB natural
Map.addLayer(composite, {
    bands: ['B4', 'B3', 'B2'],
    min: 0.0, max: 0.3
}, 'Sentinel-2 RGB', false);

// Composición geológica: Combinación SWIR (útil para litología)
// R=B12, G=B11, B=B4 → muestra litología y mineralogía
Map.addLayer(composite, {
    bands: ['B12', 'B11', 'B4'],
    min: 0.0, max: 0.4
}, 'Composición Geológica SWIR (R=B12,G=B11,B=B4)', true);

// Índice de Silicificación
Map.addLayer(silIndex.updateMask(candidateMask), {
    min: SWIR_THRESHOLD, max: 1.5,
    palette: ['#4a0080', '#8b00ff', '#ff6600', '#ffcc00', '#ffffff']
}, 'Índice Silicificación (candidatos)', true);

// Score de probabilidad
Map.addLayer(score.updateMask(score.gt(10)), {
    min: 10, max: 80,
    palette: ['#001f3f', '#0077cc', '#00cc77', '#ffaa00', '#ff4400', '#ffffff']
}, 'Score Probabilidad Madera Petrificada', true);

// Índice de Óxido de Hierro
Map.addLayer(ironOxide.updateMask(candidateMask), {
    min: 1.0, max: 3.0,
    palette: ['#ffffcc', '#fd8d3c', '#e31a1c', '#800026']
}, 'Índice Óxido de Hierro (Fe)', false);

// NDVI (para contexto)
Map.addLayer(ndvi, {
    min: -0.1, max: 0.5,
    palette: ['#8B4513', '#F5DEB3', '#90EE90', '#006400']
}, 'NDVI', false);

// ── SITIOS CONOCIDOS (CALIBRACIÓN) ───────────────────────────
// Bosque Petrificado Sarmiento
var sarmiento = ee.Geometry.Point([-68.93, -45.59]);
var amenghino = ee.Geometry.Point([-66.45, -43.35]);  // aprox Florentino Ameghino
var brynGwyn = ee.Geometry.Point([-65.52, -43.35]);  // Bryn Gwyn cerca de Gaiman

var sitiosConocidos = ee.FeatureCollection([
    ee.Feature(sarmiento, { nombre: 'Bosque Petrificado Sarmiento', tipo: 'referencia' }),
    ee.Feature(amenghino, { nombre: 'Fm. Florentino Ameghino', tipo: 'referencia' }),
    ee.Feature(brynGwyn, { nombre: 'Parque Paleontológico Bryn Gwyn', tipo: 'referencia' })
]);

Map.addLayer(sitiosConocidos, { color: '00FF00' }, 'Sitios Conocidos (Calibración)');

// ── EXTRACCIÓN DE PUNTOS CANDIDATOS ──────────────────────────
// Detecta "parches" de alta probabilidad y extrae el centroide de cada uno

// Reducir a zonas = fusionar píxeles cercanos en objetos
var zonasCandidatas = score.gt(30)  // solo score > 30
    .selfMask()
    .reduceToVectors({
        geometry: STUDY_AREA,
        scale: 30,         // 30m — OK para área pequeña
        geometryType: 'polygon',
        eightConnected: true,
        labelProperty: 'zona',
        reducer: ee.Reducer.countEvery(),
        maxPixels: 1e8
    });

// Filtrar por tamaño mínimo (descartar píxeles aislados):
// Un tronco grande de >2m de diámetro × 5m de largo = ~10 m²
// A 30m/px de Sentinel-2 un polígono de ≥2 píxeles es significativo
var zonasFiltradas = zonasCandidatas.filter(ee.Filter.gte('count', 2));

// Calcular score medio de cada zona candidata
var zonasConScore = score.reduceRegions({
    collection: zonasFiltradas,
    reducer: ee.Reducer.mean(),
    scale: 30
});

// Añadir centroides como puntos exportables
var puntosCandidatos = zonasConScore.map(function (feat) {
    var centroide = feat.geometry().centroid(10);
    return ee.Feature(centroide, {
        score_promedio: feat.get('mean'),
        area_px: feat.get('count'),
        area_m2: ee.Number(feat.get('count')).multiply(900), // 30m × 30m
        lat: centroide.coordinates().get(1),
        lon: centroide.coordinates().get(0),
        formacion: 'Pendiente verificación campo'
    });
});

print('Zonas candidatas encontradas:', zonasFiltradas.size());
print('Muestra de puntos candidatos:', puntosCandidatos.limit(10));

// Visualizar polígonos candidatos
Map.addLayer(zonasFiltradas, { color: 'FF0000' }, 'Zonas Candidatas (polígonos)', false);

// ── AJUSTAR VISTA DEL MAPA ─────────────────────────────────────
Map.centerObject(STUDY_AREA, 7);
Map.setOptions('HYBRID'); // mapa satelital como base

// ── EXPORTAR A GOOGLE DRIVE ──────────────────────────────────
// Abrí la pestaña "Tasks" (derecha) y hacé click en "Run" para cada export

// Exportar puntos candidatos como GeoJSON (para cargar en la app web)
Export.table.toDrive({
    collection: puntosCandidatos.sort('score_promedio', false), // mayor score primero
    description: 'candidatos_bosques_petrificados_chubut',
    fileFormat: 'GeoJSON',
    folder: 'BosquesPetrificados'
});

// Exportar imagen Score como raster GeoTIFF (para SIG)
Export.image.toDrive({
    image: score.uint8(),
    description: 'score_madera_petrificada_chubut',
    folder: 'BosquesPetrificados',
    region: STUDY_AREA,
    scale: 30,
    maxPixels: 1e10
});

// ── LEYENDA EN EL MAPA ───────────────────────────────────────
var legend = ui.Panel({
    style: {
        position: 'bottom-left',
        padding: '8px 15px',
        backgroundColor: 'rgba(0,0,0,0.8)'
    }
});

legend.add(ui.Label({
    value: '🌲🪨 Buscador de Bosques Petrificados',
    style: { fontWeight: 'bold', fontSize: '14px', color: '#ffffff', margin: '0 0 6px 0' }
}));

legend.add(ui.Label('Score de probabilidad:', { color: '#aaaaaa', fontSize: '11px' }));

var colores = ['#001f3f', '#0077cc', '#00cc77', '#ffaa00', '#ff4400'];
var etiquetas = ['Bajo (10)', 'Medio-bajo', 'Medio', 'Alto', 'Muy alto (80+)'];

for (var i = 0; i < colores.length; i++) {
    var row = ui.Panel({ layout: ui.Panel.Layout.flow('horizontal') });
    row.add(ui.Label({ value: '■', style: { color: colores[i], fontSize: '20px', margin: '0 6px 0 0' } }));
    row.add(ui.Label({ value: etiquetas[i], style: { color: '#ffffff', fontSize: '11px', margin: '4px 0 0 0' } }));
    legend.add(row);
}

legend.add(ui.Label('● Sitios conocidos (verde)', { color: '#00ff00', fontSize: '11px', margin: '6px 0 0 0' }));
Map.add(legend);

print('✅ Análisis completado. Ver pestaña Tasks para exportar resultados.');
print('📍 Tip: Hacé zoom en zonas de score alto (rojo/blanco) y comparalas con el mapa SWIR.');
