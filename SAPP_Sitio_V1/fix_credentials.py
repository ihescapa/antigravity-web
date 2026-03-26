from auth import hash_password
from models import Session, User, engine

def fix_credentials():
    session = Session()
    admin = session.query(User).filter_by(username="admin").first()
    if admin:
        print("Changing admin password to 'sapp2026'...")
        admin.password_hash = hash_password("sapp2026")
        session.commit()
        print("Password updated.")
    else:
        print("Creating admin user with password 'sapp2026'...")
        new_user = User(
            username="admin",
            password_hash=hash_password("sapp2026"),
            full_name="Administrador SAPP",
            institution="SAPP"
        )
        session.add(new_user)
        session.commit()
        print("User created.")
    session.close()

if __name__ == "__main__":
    fix_credentials()
