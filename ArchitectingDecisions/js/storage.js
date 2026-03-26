/**
 * storage.js
 * handles data persistence and local file simulation
 */

const CONFIG = {
    ROOT: '~/Desktop/DIAGRAMAS/',
    PROJECTS_DIR: 'proyectos/',
    METRICS_PATH: 'metricas_ia/tabla_modelos.json'
};

class StorageSystem {
    constructor() {
        this.projects = this.loadFromLocalStorage('projects') || {};
        this.metrics = this.loadFromLocalStorage('metrics') || [];
        this.currentProject = null;
    }

    loadFromLocalStorage(key) {
        const data = localStorage.getItem(`arch_decisions_${key}`);
        return data ? JSON.parse(data) : null;
    }

    saveToLocalStorage(key, data) {
        localStorage.setItem(`arch_decisions_${key}`, JSON.stringify(data));
        this.showAutoSaveFeedBack();
    }

    // Since we are in a browser environment without immediate FS access,
    // we use localStorage as a cache and provide methods to "export" to the desktop path
    async saveProject(name, architecture) {
        const id = name.toLowerCase().replace(/\s+/g, '_');
        this.projects[id] = {
            name,
            id,
            architecture,
            lastModified: new Date().toISOString()
        };
        this.saveToLocalStorage('projects', this.projects);
        console.log(`Saved project ${name} to local state.`);
    }

    getProject(id) {
        return this.projects[id];
    }

    async loadMetrics() {
        // In a real server this would be a fetch. 
        // Here we mock the initial data if empty.
        if (this.metrics.length === 0) {
            this.metrics = [
                { modelo: "GPT-4o", tipo_tarea: "General", benchmark: "MMLU", score: "88.7", update: "2024-05", notes: "Top performer" },
                { modelo: "Claude 3.5", tipo_tarea: "Coding", benchmark: "SWE-bench", score: "37.0", update: "2024-06", notes: "Coding expert" }
            ];
            this.saveToLocalStorage('metrics', this.metrics);
        }
        return this.metrics;
    }

    showAutoSaveFeedBack() {
        const status = document.getElementById('auto-save-status');
        if (status) {
            status.textContent = 'Guardado...';
            setTimeout(() => {
                status.textContent = 'Autoguardado: Activo';
            }, 2000);
        }
    }
}

const Storage = new StorageSystem();
window.Storage = Storage; // Export to global scope
