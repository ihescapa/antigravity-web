import os
import json
from datetime import datetime

# Rutas principales
BASE_DIR = os.path.expanduser("~/Desktop/ANTIGRAVITY/PORTFOLIO_WEB")
HUB_DIR = os.path.join(BASE_DIR, "ANTIGRAVITY_HUB")
JS_PATH = os.path.join(HUB_DIR, "projects.js")

# Ignorar carpetas del sistema y el propio hub
IGNORE_DIRS = [".git", ".system_generated", "gondwana_hub", "ANTIGRAVITY_HUB", ".idea", ".vscode", "tmp", "__pycache__"]

def determine_category(folder_name):
    name_lower = folder_name.lower()
    
    if any(k in name_lower for k in ["paleo", "ciencia", "bio", "araucaria", "fosil", "genealogia"]):
        return "Ciencia"
    elif any(k in name_lower for k in ["cooperativa", "gondwana", "taza"]):
        return "Emprende"
    elif any(k in name_lower for k in ["divulgacion", "video", "libro", "charla", "presentation", "flecha", "aventuras"]):
        return "Divulgacion"
    else:
        return "Lab"

def scan_projects():
    projects = []
    
    if not os.path.exists(BASE_DIR):
        print(f"Error: No se encontró el directorio {BASE_DIR}")
        return projects

    for item in os.listdir(BASE_DIR):
        item_path = os.path.join(BASE_DIR, item)
        
        # Filtrar solo directorios que no empiecen con punto y no esten ignorados
        if os.path.isdir(item_path) and not item.startswith(".") and item not in IGNORE_DIRS:
            
            # Obtener fecha de modificacion
            stat = os.stat(item_path)
            mod_time = datetime.fromtimestamp(stat.st_mtime)
            mod_time_str = mod_time.strftime("%d/%m/%Y")
            
            category = determine_category(item)
            
            # Determinar si hay un index.html para abrir directo
            index_path = os.path.join(item_path, "index.html")
            if os.path.exists(index_path):
                project_url = f"../{item}/index.html"
            else:
                project_url = f"../{item}"
            
            projects.append({
                "name": item.replace("_", " ").title(),
                "path": item_path,
                "url": project_url,
                "category": category,
                "modified": mod_time_str,
                "timestamp": stat.st_mtime
            })
            
    # Ordenar por fecha de modificacion (mas recientes primero)
    projects.sort(key=lambda x: x["timestamp"], reverse=True)
    
    # Limpiar timestamp temporal antes de guardar
    for p in projects:
        p.pop("timestamp", None)
        
    return projects

def update_json(projects):
    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    
    data = {
        "last_sync": now,
        "stats": {
            "total": len(projects)
        },
        "projects": list(projects)
    }
    
    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write("const __HUB_DATA__ = ")
        json.dump(data, f, indent=4, ensure_ascii=False)
        f.write(";")
        
    print(f"¡Sincronización exitosa! Se encontraron {len(projects)} proyectos.")
    print(f"Base de datos actualizada en: {JS_PATH}")

if __name__ == "__main__":
    print("Escaneando el laboratorio de Ignacio Escapa...")
    found_projects = scan_projects()
    update_json(found_projects)

