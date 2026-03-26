from auth import hash_password
from models import Session, User, engine

def reset_admin_pass():
    session = Session()
    admin = session.query(User).filter_by(username="admin").first()
    if admin:
        print("Resetting admin password to admin123...")
        admin.password_hash = hash_password("admin123")
        session.commit()
        print("Admin password reset successfully.")
    else:
        print("Admin user not found. Creating it...")
        new_user = User(
            username="admin",
            password_hash=hash_password("admin123"),
            full_name="Sistema",
            institution="Admin"
        )
        session.add(new_user)
        session.commit()
        print("Admin user created successfully.")
    session.close()

if __name__ == "__main__":
    reset_admin_pass()
