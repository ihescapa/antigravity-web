import bcrypt
from models import Session, User

def verify():
    session = Session()
    user = session.query(User).filter_by(username="admin").first()
    if not user:
        print("Admin user not found in DB!")
        return
        
    password = "sapp2026"
    plain_bytes = password.encode('utf-8')
    hashed_bytes = user.password_hash.encode('utf-8')
    
    if bcrypt.checkpw(plain_bytes, hashed_bytes):
        print("SUCCESS: 'sapp2026' matches the hash in DB.")
    else:
        print("FAILURE: 'sapp2026' DOES NOT match the hash in DB.")
    session.close()

if __name__ == "__main__":
    verify()
