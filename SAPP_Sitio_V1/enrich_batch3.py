from models import Session, Researcher

data_updates = [
    {
        "id": "gomez_g",
        "name": "Graciela Noemí Gómez",
        "institution": "Museo de La Plata / UNLP",
        "province": "Buenos Aires",
        "city": "La Plata",
        "keywords": "Triásico, Dicroidium, Barreal, San Juan, Paleobotánica",
        "verified": True
    },
    {
        "id": "moya_e",
        "name": "Eliana Vanesa Moya",
        "institution": "CICYTTP (CONICET - Entre Ríos)",
        "province": "Entre Ríos",
        "city": "Diamante",
        "keywords": "Anatomía de madera, Mioceno, Pleistoceno, Leguminosas, Paleofitogeografía",
        "verified": True
    },
    {
        "id": "robledo_j",
        "name": "Juan Manuel Robledo",
        "institution": "CECOAL (CONICET - UNNE)",
        "province": "Corrientes",
        "city": "Corrientes",
        "keywords": "Interacción Planta-Insecto, Herbivoría, Salviniaceae, Neógeno, Icnotaxonomía",
        "verified": True
    },
    {
        "id": "asurmendi_e",
        "name": "Estefania Asurmendi",
        "institution": "ICBIA (CONICET - UNRC)",
        "province": "Córdoba",
        "city": "Río Cuarto",
        "keywords": "Sedimentología, Estratigrafía, Análisis de Cuencas, Cretácico Tardío, Cuenca Neuquina",
        "verified": True
    },
    {
        "id": "mego_n",
        "name": "Natalia Mego",
        "institution": "IANIGLA (CONICET - Mendoza)",
        "province": "Mendoza",
        "city": "Mendoza",
        "keywords": "Paleopalinología, Cretácico, Bioestratigrafía, Paleodiversidad",
        "verified": True
    },
    {
        "id": "hinojosa_f",
        "name": "Felipe Hinojosa",
        "institution": "Universidad de Chile / IEB",
        "province": "Extranjero (Chile)",
        "city": "Santiago",
        "keywords": "Paleoecología, Cenozoico, Fisonomía Foliar, Paleoclimatología, Bosques Sudamericanos",
        "verified": True
    },
    {
        "id": "gaxiola_a",
        "name": "Aurora Gaxiola",
        "institution": "Pontificia Universidad Católica de Chile / IEB",
        "province": "Extranjero (Chile)",
        "city": "Santiago",
        "keywords": "Ecología de Plantas, Ciclos Biogeoquímicos, Interacción Planta-Suelo, Restauración",
        "verified": True
    },
    {
        "id": "scafati_l",
        "name": "Laura Scafati",
        "institution": "Museo Argentino de Ciencias Naturales (MACN)",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Palinofacies, Cutículas, Paleoclimatología, Jurásico, Geoquímica",
        "verified": True
    },
    {
        "id": "cornou_m",
        "name": "María Elina Cornou",
        "institution": "INGEOSUR (CONICET - Bahía Blanca)",
        "province": "Buenos Aires",
        "city": "Bahía Blanca",
        "keywords": "Palinoestratigrafía, Paleógeno, Hongos Fósiles, Ñirihuau",
        "verified": True
    },
    {
        "id": "aguero_l",
        "name": "Luis Sebastián Agüero",
        "institution": "INGEOSUR (CONICET - Bahía Blanca)",
        "province": "Buenos Aires",
        "city": "Bahía Blanca",
        "keywords": "Vaca Muerta, Oleogénesis, Palinoestratigrafía, Paleoceno, Cuenca Austral",
        "verified": True
    }
]

def apply_enrichment():
    session = Session()
    for item in data_updates:
        r = session.query(Researcher).filter_by(id=item["id"]).first()
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
    print("Enrichment Batch 3 complete.")

if __name__ == "__main__":
    apply_enrichment()
