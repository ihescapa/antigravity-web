/**
 * canvas.js
 * Handles the infinite canvas, node creation, and dragging
 */

class InfiniteCanvas {
    constructor(containerId, innerId) {
        this.container = document.getElementById(containerId);
        this.inner = document.getElementById(innerId);
        this.connectionsLayer = document.getElementById('connections-layer');
        this.nodes = [];
        this.connections = [];
        this.zoom = 1;
        this.isPanning = false;
        this.startX = 0;
        this.startY = 0;
        this.scrollLeft = 0;
        this.scrollTop = 0;

        this.initEventListeners();
        this.centerCanvas();
    }

    initEventListeners() {
        this.container.addEventListener('mousedown', (e) => {
            if (e.target === this.container || e.target === this.inner) {
                this.isPanning = true;
                this.container.style.cursor = 'grabbing';
                this.startX = e.pageX - this.container.offsetLeft;
                this.startY = e.pageY - this.container.offsetTop;
                this.scrollLeft = this.container.scrollLeft;
                this.scrollTop = this.container.scrollTop;
            }
        });

        window.addEventListener('mouseup', () => {
            this.isPanning = false;
            this.container.style.cursor = 'crosshair';
        });

        this.container.addEventListener('mousemove', (e) => {
            if (!this.isPanning) return;
            e.preventDefault();
            const x = e.pageX - this.container.offsetLeft;
            const y = e.pageY - this.container.offsetTop;
            const walkX = (x - this.startX);
            const walkY = (y - this.startY);
            this.container.scrollLeft = this.scrollLeft - walkX;
            this.container.scrollTop = this.scrollTop - walkY;
            this.updateConnections();
        });
    }

    centerCanvas() {
        this.container.scrollLeft = (this.inner.offsetWidth / 2) - (this.container.offsetWidth / 2);
        this.container.scrollTop = (this.inner.offsetHeight / 2) - (this.container.offsetHeight / 2);
    }

    addNode(data) {
        const node = document.createElement('div');
        node.className = 'node animate-in';
        node.id = `node-${data.id}`;
        node.style.left = `${data.x}px`;
        node.style.top = `${data.y}px`;

        const iconPath = `../DIAGRAMAS/iconos/${this.getIconForType(data.type)}`;

        node.innerHTML = `
            <div class="node-header">
                <img src="${iconPath}" class="node-icon" onerror="this.src='/ArchitectingDecisions/assets/placeholder.svg'">
                <div>
                    <div class="node-type">${data.type}</div>
                    <div class="node-title">${data.name}</div>
                </div>
            </div>
            <div class="node-content">${data.desc}</div>
            <div style="margin-top: 10px; display: flex; gap: 4px;">
                ${data.metrics ? `<span style="font-size: 0.6rem; background: var(--border); padding: 2px 4px; border-radius: 3px;">${data.metrics.automation}</span>` : ''}
            </div>
        `;

        node.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.selectNode(node);
            this.initNodeDrag(node, e);
        });

        node.addEventListener('click', () => {
            this.showDetails(data);
        });

        this.inner.appendChild(node);
        this.nodes.push({ id: data.id, element: node, data });
        lucide.createIcons();
    }

    getIconForType(type) {
        const map = {
            'Inicio': 'contexto.svg',
            'Proceso': 'procesos.svg',
            'Decisión': 'decision.svg',
            'Humano': 'intervencion_humana.svg',
            'Input': 'input.svg',
            'Contexto': 'contexto.svg'
        };
        return map[type] || 'procesos.svg';
    }

    initNodeDrag(node, initialEvent) {
        let startX = initialEvent.clientX - node.offsetLeft;
        let startY = initialEvent.clientY - node.offsetTop;

        const onMouseMove = (e) => {
            node.style.left = `${e.clientX - startX}px`;
            node.style.top = `${e.clientY - startY}px`;
            this.updateConnections();
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    selectNode(node) {
        document.querySelectorAll('.node').forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
    }

    addConnection(fromId, toId) {
        this.connections.push({ from: fromId, to: toId });
        this.updateConnections();
    }

    updateConnections() {
        this.connectionsLayer.innerHTML = '';
        this.connections.forEach(conn => {
            const from = document.getElementById(`node-${conn.from}`);
            const to = document.getElementById(`node-${conn.to}`);
            if (from && to) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const x1 = from.offsetLeft + from.offsetWidth / 2;
                const y1 = from.offsetTop + from.offsetHeight / 2;
                const x2 = to.offsetLeft + to.offsetWidth / 2;
                const y2 = to.offsetTop + to.offsetHeight / 2;

                // Create a curved path
                const dx = x2 - x1;
                const dy = y2 - y1;
                const d = `M ${x1} ${y1} C ${x1 + dx / 2} ${y1}, ${x1 + dx / 2} ${y2}, ${x2} ${y2}`;

                line.setAttribute('d', d);
                line.setAttribute('class', 'connection-line');
                this.connectionsLayer.appendChild(line);
            }
        });
    }

    showDetails(data) {
        const panel = document.getElementById('details-panel');
        document.getElementById('detail-title').textContent = data.name;
        document.getElementById('detail-desc').textContent = data.desc;

        let extra = `<div style="margin-top: 15px;">
            <p style="font-size: 0.75rem; color: var(--accent);">Herramientas: ${data.tools || 'Ninguna'}</p>
            <p style="font-size: 0.75rem; color: var(--warning); margin-top: 5px;">Riesgo: ${data.risk || 'Bajo'}</p>
        </div>`;

        document.getElementById('detail-extra').innerHTML = extra;
        panel.style.display = 'block';
    }

    clear() {
        this.inner.innerHTML = '';
        this.connectionsLayer.innerHTML = '';
        this.nodes = [];
        this.connections = [];
    }
}

const Canvas = new InfiniteCanvas('canvas-container', 'canvas-inner');
window.Canvas = Canvas;
