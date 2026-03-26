import sqlite3
import os

db_path = "genealogy.db"

if not os.path.exists(db_path):
    print(f"Error: Database {db_path} not found.")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("Adding 'verified' column to researchers table...")
        cursor.execute("ALTER TABLE researchers ADD COLUMN verified BOOLEAN DEFAULT 0")
        print("Success.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Column 'verified' already exists in researchers.")
        else:
            print(f"Error adding column to researchers: {e}")
            
    try:
        print("Adding 'verified' column to relationships table...")
        cursor.execute("ALTER TABLE relationships ADD COLUMN verified BOOLEAN DEFAULT 0")
        print("Success.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Column 'verified' already exists in relationships.")
        else:
            print(f"Error adding column to relationships: {e}")
            
    conn.commit()
    conn.close()
    print("Migration complete.")
