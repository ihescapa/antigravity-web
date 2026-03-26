from auth import hash_password
from models import Session, User, engine

def seed_admin():
    session = Session()
    # Check if admin already exists
    admin = session.query(User).filter_by(username="admin").first()
    if not admin:
        print("Creating admin user...")
        new_user = User(
            username="admin",
            password_hash=hash_password("admin123"),
            full_name="Administrador SAPP",
            institution="SAPP"
        )
        session.add(new_user)
        session.commit()
        print("Admin user created successfully.")
    else:
        print("Admin user already exists.")
    session.close()

if __name__ == "__main__":
    seed_admin()
