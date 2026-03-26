from models import Session, Researcher, Relationship

def unverify_all():
    session = Session()
    try:
        # Unverify all researchers
        researchers = session.query(Researcher).all()
        for r in researchers:
            r.verified = False
        
        # Unverify all relationships
        relationships = session.query(Relationship).all()
        for rel in relationships:
            rel.verified = False
            
        session.commit()
        print(f"Successfully unverified {len(researchers)} researchers and {len(relationships)} relationships.")
    except Exception as e:
        session.rollback()
        print(f"Error unverifying data: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    unverify_all()
