from models import Session, Researcher, Relationship
import pandas as pd

def diagnostic():
    session = Session()
    researchers = session.query(Researcher).all()
    relationships = session.query(Relationship).all()
    
    total_r = len(researchers)
    no_inst = len([r for r in researchers if not r.institution])
    no_prov = len([r for r in researchers if not r.province])
    no_keywords = len([r for r in researchers if not r.keywords])
    no_gender = len([r for r in researchers if r.gender == "Desconocido"])
    
    print(f"--- Diagnóstico de Datos ---")
    print(f"Total Investigadores/as: {total_r}")
    print(f"Sin Institución: {no_inst} ({no_inst/total_r:.1%})")
    print(f"Sin Provincia: {no_prov} ({no_prov/total_r:.1%})")
    print(f"Sin Palabras Clave: {no_keywords} ({no_keywords/total_r:.1%})")
    print(f"Género Desconocido: {no_gender} ({no_gender/total_r:.1%})")
    
    print("\n--- Lista de Prioridades para Investigación ---")
    priorities = [r for r in researchers if not r.institution or not r.keywords]
    for r in priorities[:10]:
        missing = []
        if not r.institution: missing.append("Institución")
        if not r.keywords: missing.append("Keywords")
        print(f"- {r.name} ({r.id}): Faltan {', '.join(missing)}")
        
    session.close()

if __name__ == "__main__":
    diagnostic()
