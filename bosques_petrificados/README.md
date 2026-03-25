# 🪨 Buscador de Bosques Petrificados — Chubut

Herramienta paleobotánica para detectar sitios candidatos a contener madera petrificada silicificada en la provincia de Chubut, Patagonia Argentina. Combina análisis espectral satelital (Sentinel-2), filtro geológico y detección morfológica.

---

## 📂 Estructura del proyecto

```
bosques_petrificados/
├── index.html                          ← App web interactiva (mapa)
├── app.js                              ← Lógica del mapa + filtros + exportación
├── style.css                           ← Estilos premium (tema oscuro)
├── petrified_forest_detector_GEE.js    ← Script para Google Earth Engine
├── data/
│   └── sitios_conocidos.geojson        ← Bosques conocidos de Chubut (referencia)
└── README.md                           ← Este archivo
```

---

## 🔄 Flujo de uso

```
1. Correr script GEE  →  2. Exportar GeoJSON  →  3. Cargar en app web  →  4. Filtrar + exportar KMZ
```

---

## Paso 1: Correr el script en Google Earth Engine

**Requisito:** Cuenta gratuita en [earthengine.google.com](https://earthengine.google.com)  
*(El registro puede tardar 1-2 días en aprobarse)*

1. Ir a **[code.earthengine.google.com](https://code.earthengine.google.com)**
2. Crear un nuevo script (botón `+`)
3. Copiar y pegar todo el contenido de `petrified_forest_detector_GEE.js`
4. Hacer click en **Run**
5. Esperar que el mapa cargue (puede tardar 1-2 minutos para toda la provincia)
6. Ver los resultados en el mapa interactivo de GEE

**Lo que verás en GEE:**
- 🔵→🔴 Mapa de calor de probabilidad de madera petrificada
- 🟥 Polígonos de zonas candidatas
- 🟢 Sitios conocidos de referencia (Sarmiento, Ameghino, Bryn Gwyn)

---

## Paso 2: Exportar resultados

En GEE, abrí la pestaña **Tasks** (panel derecho) y hacé click en **Run** para dos tareas:

| Tarea | Formato | Destino |
|-------|---------|---------|
| `candidatos_bosques_petrificados_chubut` | **GeoJSON** | Google Drive / BosquesPetrificados |
| `score_madera_petrificada_chubut` | GeoTIFF (raster) | Google Drive / BosquesPetrificados |

Descargá el `.geojson` a tu computadora.

---

## Paso 3: Ver en la app web

La app necesita un servidor local (no funciona abriendo el HTML directamente por las restricciones de CORS al cargar el GeoJSON de referencia).

**Opción A — Python (recomendado):**
```bash
cd bosques_petrificados
python3 -m http.server 8080
```
Luego abrir: [http://localhost:8080](http://localhost:8080)

**Opción B — Node.js:**
```bash
npx serve bosques_petrificados
```

---

## Paso 4: Filtrar y exportar para campo

En la app web:
1. **Arrastrá el GeoJSON** exportado desde GEE al panel izquierdo
2. **Filtrá** por score mínimo y área mínima de parche
3. **Seleccioná formaciones** geológicas de interés
4. **Exportá KMZ** para llevar al GPS de campo, o **CSV** para análisis en SIG

---

## 🎯 Criterios de detección

La puntuación se calcula con tres índices espectrales de Sentinel-2:

| Índice | Descripción | Por qué funciona |
|--------|-------------|-----------------|
| **Sil. Index** | Ratio SWIR1×SWIR2/NIR² | La sílice refleja fuerte en SWIR |
| **Iron Oxide** | Ratio Red/Blue | Troncos con Fe tienen color rojizo |
| **BSI** | Bare Soil Index | Zonas sin vegetación = exposición rocosa |
| **NDVI (inv.)** | Vegetación invertida | Sin plantas sobre el tronco |

> La detección es **probabilística**, no confirmatoria. Los puntos de alto score son candidatos para verificación en campo.

---

## 📐 Ajustar parámetros GEE

Al inicio del script podés modificar:

```javascript
var CLOUD_COVER_MAX = 15;       // % máximo de nubes
var SWIR_THRESHOLD  = 0.25;     // umbral de silicificación (bajar = más candidatos)
var NDVI_MAX        = 0.15;     // máxima vegetación tolerada
var BSI_THRESHOLD   = 0.05;     // exposición de suelo mínima
```

Para **acotar la zona de búsqueda** y acelerar el análisis, cambiá `STUDY_AREA`:
```javascript
// Solo zona Sarmiento:
var STUDY_AREA = ee.Geometry.Rectangle([-70.5, -46.5, -67.5, -44.5]);
```

---

## 🗺️ Formaciones geológicas objetivo en Chubut

| Formación | Edad | Relevancia |
|-----------|------|-----------|
| Grupo Sarmiento | Eoceno-Oligoceno | Bosque de Sarmiento, palmeras fósiles |
| Fm. Laguna del Hunco | Eoceno (~52 Ma) | Flora tropical extraordinaria |
| Fm. Florentino Ameghino | Cretácico-Eoceno | Troncos hasta 25m, diám. 2.5m |
| Grupo Chubut | Cretácico | Araucaria, primeras angiospermas |

---

## 💡 Próximos pasos posibles

- [ ] Añadir análisis con imágenes **hiperespectrales** (DESIS, EMIT) para mayor precisión
- [ ] Integrar mapa geológico SEGEMAR en formato vectorial como capa de filtro
- [ ] Entrenar un clasificador supervisado en GEE con muestras del campo
- [ ] Conectar con base de datos de hallazgos propios del usuario

---

*Desarrollado en colaboración con Antigravity AI — Febrero 2026*
