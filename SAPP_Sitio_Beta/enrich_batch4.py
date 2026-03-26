from models import Session, Researcher

data_updates = [
    {
        "id": "lafuente_diaz_m",
        "institution": "Museo Argentino de Ciencias Naturales (MACN) / CONICET",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Cutículas, Espectroscopía FTIR, Cretácico Inferior, Quimiotaxonomía",
        "verified": True
    },
    {
        "id": "de_benedetti_f",
        "institution": "Museo Paleontológico Egidio Feruglio (MEF) / CONICET",
        "province": "Chubut",
        "city": "Trelew",
        "keywords": "Palinología, Cretácico Tardío, La Colonia, Paleoceno, Bioestratigrafía",
        "verified": True
    },
    {
        "id": "andruchow_a",
        "institution": "Universidad de Kansas (Postdoc) / MEF",
        "province": "Extranjero (USA)",
        "city": "Lawrence",
        "keywords": "Coníferas, Araucariales, Filogenia, Sistemática, Gimnospermas",
        "verified": True
    },
    {
        "id": "carrizo_m",
        "institution": "Museo Argentino de Ciencias Naturales (MACN) / CONICET",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Megafloras, Cretácico Inferior, Cuenca Austral, Paleoambientes",
        "verified": True
    },
    {
        "id": "de_giuseppe_b",
        "institution": "IANIGLA (CONICET-Mendoza)",
        "province": "Mendoza",
        "city": "Mendoza",
        "keywords": "Umkomasiales, Pteridospermas, Paleoecología, Triásico",
        "verified": True
    },
    {
        "id": "ruiz_d",
        "institution": "Museo Argentino de Ciencias Naturales (MACN) / CONICET",
        "province": "Buenos Aires",
        "city": "Buenos Aires",
        "keywords": "Xilología, Maderas Fósiles, Paleoclimatología, Mesozoico",
        "verified": True
    },
    {
        "id": "puebla_g",
        "institution": "IANIGLA (CONICET-Mendoza)",
        "province": "Mendoza",
        "city": "Mendoza",
        "keywords": "Stellula meridionalis, Angiospermas, Evolución, Cretácico",
        "verified": True
    },
    {
        "id": "munoz_n",
        "institution": "CICYTTP (CONICET - Entre Ríos)",
        "province": "Entre Ríos",
        "city": "Diamante",
        "keywords": "Palinología, Holoceno, El Palmar, Aeropalinología",
        "verified": True
    },
    {
        "id": "nunez_n",
        "institution": "CICYTTP (CONICET - Entre Ríos)",
        "province": "Entre Ríos",
        "city": "Diamante",
        "keywords": "Paleomicología, Hongos Fósiles, Holoceno, Paleoecología",
        "verified": True
    },
    {
        "id": "procopio_j",
        "institution": "Museo de La Plata / UNLP / CONICET",
        "province": "Buenos Aires",
        "city": "La Plata",
        "keywords": "Licófitas, Esfenófitas, Helechos, Triásico, Sistemática",
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
    print("Enrichment Batch 4 complete.")

if __name__ == "__main__":
    apply_enrichment()
