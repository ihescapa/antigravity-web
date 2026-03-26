/**
 * app.js
 * Main controller for the application
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Metrics Table
    const metrics = await Storage.loadMetrics();
    renderMetricsTable(metrics);

    // Event Listeners
    document.getElementById('generate-btn').addEventListener('click', handleGenerate);
    document.getElementById('show-metrics-btn').addEventListener('click', () => {
        document.getElementById('metrics-overlay').classList.add('active');
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('metrics-overlay').classList.remove('active');
    });

    document.querySelector('.close-details').addEventListener('click', () => {
        document.getElementById('details-panel').style.display = 'none';
    });

    document.getElementById('recenter-btn').addEventListener('click', () => {
        Canvas.centerCanvas();
    });

    // Handle ESC for modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('metrics-overlay').classList.remove('active');
            document.getElementById('details-panel').style.display = 'none';
        }
    });
});

async function handleGenerate() {
    const prompt = document.getElementById('project-description').value;
    if (!prompt.trim()) return alert('Por favor, describe tu proyecto.');

    const btn = document.getElementById('generate-btn');
    btn.textContent = 'Analizando...';
    btn.disabled = true;

    // Simulation of AI processing
    // In a real production app, this would be a call to an LLM API
    setTimeout(async () => {
        const architecture = simulateAIGeneration(prompt);
        renderArchitecture(architecture);
        await Storage.saveProject("Nuevo Proyecto", architecture);

        btn.textContent = 'Generar Arquitectura';
        btn.disabled = false;
    }, 1500);
}

function renderArchitecture(arch) {
    Canvas.clear();
    const centerX = 2500;
    const centerY = 2500;

    arch.nodes.forEach(n => {
        Canvas.addNode({
            ...n,
            x: centerX + (n.gridX * 300),
            y: centerY + (n.gridY * 150)
        });
    });

    arch.edges.forEach(e => {
        Canvas.addConnection(e.from, e.to);
    });
}

function simulateAIGeneration(prompt) {
    // Basic heuristic to generate a plausible architecture based on prompt keywords
    const nodes = [
        { id: '1', name: 'Contexto Social', type: 'Contexto', desc: `Entorno para: ${prompt.substring(0, 30)}...`, gridX: 0, gridY: -1 },
        { id: '2', name: 'Input Datos', type: 'Input', desc: 'Entrada de requerimientos del usuario', gridX: 0, gridY: 0 },
        { id: '3', name: 'Procesamiento Core', type: 'Proceso', desc: 'Motor de lógica automatizada', gridX: 1, gridY: 0, tools: 'Python, LLM', risk: 'Alto (Alucinación)' },
        { id: '4', name: 'Revisión Crítica', type: 'Humano', desc: 'Punto de intervención humana sugerido', gridX: 2, gridY: 0 },
        { id: '5', name: 'Decisión Final', type: 'Decisión', desc: 'Validación de objetivos', gridX: 3, gridY: 0 }
    ];

    const edges = [
        { from: '1', to: '3' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '4', to: '5' }
    ];

    return { nodes, edges };
}

function renderMetricsTable(data) {
    const tbody = document.getElementById('metrics-tbody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.modelo}</strong></td>
            <td>${item.tipo_tarea}</td>
            <td>${item.benchmark}</td>
            <td><span style="color: var(--success); font-weight: 600;">${item.score}</span></td>
            <td>${item.update}</td>
            <td style="font-size: 0.8rem; color: var(--text-secondary);">${item.notes}</td>
        `;
        tbody.appendChild(tr);
    });
}
