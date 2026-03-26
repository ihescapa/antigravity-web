from models import Session, Researcher
import sqlite3

data_updates = [
    {
        "id": "kurtz_f",
        "institution": "Universidad Nacional de Córdoba (Museo Botánico)",
        "province": "Córdoba",
        "city": "Córdoba",
        "keywords": "Gondwana, Bajo de Véliz, Paleofitología, Sistemática, Botánica",
        "verified": True
    },
    {
        "id": "frenguelli_j",
        "institution": "Museo de La Plata / Universidad Nacional del Litoral",
        "province": "Buenos Aires",
        "city": "La Plata",
        "keywords": "Diatomeas, Paleobotánica, Mesozoico, Cenozoico, Estratigrafía, Geomorfología",
        "verified": True
    },
    {
        "id": "feruglio_e",
        "institution": "YPF / Universidad Nacional de Cuyo",
        "province": "Mendoza",
        "city": "Mendoza",
        "keywords": "Patagonia, Estratigrafía, Geología, Petróleo, Paleozoico",
        "verified": True
    },
    {
        "id": "castellanos_a",
        "institution": "Universidad de Buenos Aires (UBA)",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Cactáceas, Fitogeografía, Flora Argentina, Paleobotánica, Bromeliáceas",
        "verified": True
    },
    {
        "id": "stipanicic_p",
        "institution": "Asociación Geológica Argentina / CNEA",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Triásico, Jurásico, Bioestratigrafía, Gondwana, Energía Nuclear",
        "verified": True
    },
    {
        "id": "menendez_c",
        "institution": "Museo Argentino de Ciencias Naturales (MACN)",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Palinología, Bennettitales, Ticó, Mesozoico, Microplancton",
        "verified": True
    },
    {
        "id": "bonetti_m",
        "institution": "Universidad de Buenos Aires (UBA) / MACN",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Triásico, Barreal, Flora Fósil, Paleobotánica, Geología",
        "verified": True
    },
    {
        "id": "gamerro_j",
        "institution": "IBODA (Darwinion) / Universidad Nacional de La Plata",
        "province": "Buenos Aires",
        "city": "San Isidro",
        "keywords": "Palinología, Coníferas, Cretácico, Baqueró, Microfotografía",
        "verified": True
    },
    {
        "id": "amos_a",
        "institution": "Universidad de Buenos Aires (UBA) / Museo de La Plata",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Invertebrados, Geología Estructural, Andes, Patagonia, Estratigrafía",
        "verified": True
    },
    {
        "id": "azcuy_cl",
        "institution": "Universidad de Buenos Aires (UBA) / CONICET",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Palinología, Paleozoico Superior, Paganzo, Biostratigrafía, Cuaternario",
        "verified": True
    }
]

def apply_enrichment():
    session = Session()
    for item in data_updates:
        r = session.query(Researcher).get(item["id"])
        if r:
            r.institution = item["institution"]
            r.province = item["province"]
            r.city = item["city"]
            r.keywords = item["keywords"]
            r.verified = item["verified"]
            print(f"Updated {r.name}")
        else:
            print(f"Warning: Researcher ID {item['id']} not found.")
    
    session.commit()
    session.close()
    print("Enrichment Batch 1 complete.")

if __name__ == "__main__":
    apply_enrichment()
