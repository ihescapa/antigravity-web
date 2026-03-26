from models import Session, Researcher

data_updates = [
    {
        "id": "romero_e",
        "institution": "Museo Argentino de Ciencias Naturales (MACN) / CONICET",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Angiospermas, Araucariaceae, Fitogeografía, Nothofagus, Cenozoico",
        "verified": True
    },
    {
        "id": "de_la_sota_er",
        "institution": "Universidad Nacional de La Plata (UNLP) / Museo de La Plata",
        "province": "Buenos Aires",
        "city": "La Plata",
        "keywords": "Pteridófitas, Helechos, Taxonomía, Polypodiaceae, Licófitas",
        "verified": True
    },
    {
        "id": "pottie_de_baldis_d",
        "institution": "Universidad Nacional de San Juan (UNSJ) / CONICET",
        "province": "San Juan",
        "city": "San Juan",
        "keywords": "Paleopalinología, Paleozoico, Bioestratigrafía, Trilobites",
        "verified": True
    },
    {
        "id": "morel_e",
        "institution": "Universidad Nacional de La Plata (UNLP) / Museo de La Plata",
        "province": "Buenos Aires",
        "city": "La Plata",
        "keywords": "Triásico, Gondwana, Paleobiología, Estratigrafía, Patagonia",
        "verified": True
    },
    {
        "id": "pramparo_m",
        "institution": "IANIGLA (CONICET-Mendoza) / UNCUYO",
        "province": "Mendoza",
        "city": "Mendoza",
        "keywords": "Palinoestratigrafía, Cretácico, Angiospermas, San Luis, Antártida",
        "verified": True
    },
    {
        "id": "martinez_m",
        "institution": "INGEOSUR (CONICET-UNS)",
        "province": "Buenos Aires",
        "city": "Bahía Blanca",
        "keywords": "Palinofacies, Mesozoico, Cuenca Neuquina, Evo-Devo, Jurásico",
        "verified": True
    },
    {
        "id": "gnaedinger_s",
        "institution": "CECOAL (CONICET-UNNE)",
        "province": "Corrientes",
        "city": "Corrientes",
        "keywords": "Megafloras, Jurásico, Triásico, Paleodendrología, Anatomía de Maderas",
        "verified": True
    },
    {
        "id": "pedernera_t",
        "institution": "IANIGLA (CONICET-Mendoza)",
        "province": "Mendoza",
        "city": "Mendoza",
        "keywords": "Tafonomía, Triásico, Paleoecología, Paleoclimatología, Gondwana",
        "verified": True
    },
    {
        "id": "elgorriaga_a",
        "institution": "Museo Paleontológico Egidio Feruglio (MEF) / Univ. Kansas",
        "province": "Chubut",
        "city": "Trelew",
        "keywords": "Pteridospermas, Equisetales, Filogenia, Mesozoico, Cladística",
        "verified": True
    },
    {
        "id": "fernandez_pacella_l",
        "institution": "CECOAL (CONICET-UNNE)",
        "province": "Corrientes",
        "city": "Corrientes",
        "keywords": "Holoceno, Mesopotamia, Cuaternario, Humedales, Polen",
        "verified": True
    }
]

def apply_enrichment():
    session = Session()
    for item in data_updates:
        # Using Session.get is the modern way in SQLAlchemy 2.0+
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
    print("Enrichment Batch 2 complete.")

if __name__ == "__main__":
    apply_enrichment()
