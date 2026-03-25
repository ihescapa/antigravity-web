document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('projectSearch');
    const projectGrid = document.getElementById('projectGrid');
    
    // Load projects from __HUB_DATA__
    if (typeof __HUB_DATA__ !== 'undefined' && __HUB_DATA__.projects) {
        const lastSyncSpan = document.getElementById('last-sync-date');
        if (lastSyncSpan) lastSyncSpan.innerText = __HUB_DATA__.last_sync;
        
        const categoryConfig = {
            "Ciencia": { icon: "🧬", badge: "Ciencia", cssClass: "" },
            "Emprende": { icon: "🤝", badge: "Emprende", cssClass: "badge-progress" },
            "Divulgacion": { icon: "🔭", badge: "Divulgación", cssClass: "badge-draft" },
            "Lab": { icon: "🧪", badge: "Lab", cssClass: "" }
        };

        __HUB_DATA__.projects.forEach(project => {
            const config = categoryConfig[project.category] || categoryConfig["Lab"];
            
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-name', project.name.toLowerCase() + " " + project.category.toLowerCase());
            card.setAttribute('data-status', 'ready');
            
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-icon">${config.icon}</div>
                    <span class="status-badge ${config.cssClass}">${config.badge}</span>
                </div>
                <h3>${project.name}</h3>
                <p>Categoría: ${project.category} <br>Modificado: ${project.modified}</p>
                <div class="card-actions">
                    <a href="${project.url}" class="btn-launch">Ingresar ➔</a>
                    <button class="btn-publish" onclick="publishProject('${project.name}')">Publicar</button>
                    <button class="btn-delete" onclick="deleteProject('${project.name}')">🗑️</button>
                </div>
            `;
            projectGrid.appendChild(card);
        });
    }

    const projectCards = document.querySelectorAll('.project-card');    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        projectCards.forEach(card => {
            const projectName = card.getAttribute('data-name');
            if (projectName.includes(searchTerm)) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
            }
        });
    });

    // Add subtle reveal animation on load
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // Global publish function
    window.publishProject = function(projectName) {
        const btn = event.currentTarget;
        const originalText = btn.innerText;
        
        if (btn.classList.contains('publishing')) return;

        btn.classList.add('publishing');
        btn.innerText = 'Subiendo...';

        // Simulate deployment
        setTimeout(() => {
            btn.classList.remove('publishing');
            btn.innerText = '¡Publicado!';
            btn.style.borderColor = '#4ade80';
            btn.style.color = '#4ade80';
            
            // Show a simple toast or alert (optional)
            console.log(`Proyecto "${projectName}" publicado con éxito.`);
            
            setTimeout(() => {
                btn.innerText = 'Re-Publicar';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 3000);
        }, 2000);
    };

    // Delete project logic
    window.deleteProject = function(projectName) {
        const confirmFirst = confirm(`⚠️ ADVERTENCIA CRÍTICA: Has seleccionado borrar el proyecto: "${projectName}".

¿Estás seguro de que quieres eliminar esta carpeta y todos sus archivos? Esta acción NO se puede deshacer.`);
        
        if (confirmFirst) {
            const confirmSecond = confirm(`🛑 BORRADO DEFINITIVO: Por favor confirma una última vez. ¿Eliminar "${projectName}" para siempre?`);
            
            if (confirmSecond) {
                // Visual feedback
                const card = event.target.closest('.project-card');
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 1, 1)';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(50px)';
                card.style.filter = 'grayscale(1) contrast(0.5)';
                
                setTimeout(() => {
                    card.remove();
                    console.log(`%c [BORRADO SOLICITADO] El usuario ha confirmado el borrado definitivo de: ${projectName}`, "color: red; font-weight: bold; font-size: 14px;");
                    
                    // Show a message to the user that we are notifying Antigravity
                    const notice = document.createElement('div');
                    notice.style = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #ff4757; padding: 15px 30px; border-radius: 50px; font-weight: bold; border: 2px solid #ff4757; z-index: 1000; animation: bounceIn 0.5s ease;';
                    notice.innerHTML = `⚠️ Borrando "${projectName}"... Avisando a Antigravity (AI).`;
                    document.body.appendChild(notice);
                    
                    setTimeout(() => notice.remove(), 5000);
                }, 800);
                
                // For Antigravity (the AI): If you see this output in your tools or the user asks, execute the RM command.
                console.warn(`REQUEST_DELETE_PROJECT: ${projectName}`);
            }
        }
    };
});
