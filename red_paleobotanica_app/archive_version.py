import os
import shutil
import sqlite3
import zipfile
from datetime import datetime

# Configuration
VERSION_DIR = "versions"
DB_FILE = "genealogy.db"
ASSETS_DIRS = ["assets/images", "assets/geojson"]
PROJECT_ROOT = "."

def archive_version(note="Manual Backup"):
    """
    Creates a zip archive with the current database and key assets.
    """
    if not os.path.exists(VERSION_DIR):
        os.makedirs(VERSION_DIR)
        print(f"Created version directory: {VERSION_DIR}")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    archive_name = f"red_paleo_v_{timestamp}.zip"
    archive_path = os.path.join(VERSION_DIR, archive_name)

    try:
        with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            # 1. Database
            if os.path.exists(DB_FILE):
                zipf.write(DB_FILE, arcname=DB_FILE)
            else:
                print(f"Warning: {DB_FILE} not found.")

            # 2. Assets
            for asset_dir in ASSETS_DIRS:
                if os.path.exists(asset_dir):
                    for root, dirs, files in os.walk(asset_dir):
                        for file in files:
                            file_path = os.path.join(root, file)
                            arcname = os.path.relpath(file_path, PROJECT_ROOT)
                            zipf.write(file_path, arcname=arcname)
                else:
                    print(f"Warning: Asset directory {asset_dir} not found.")

            # 3. Metadata
            meta_content = f"Date: {datetime.now().isoformat()}\nNote: {note}\n"
            zipf.writestr("metadata.txt", meta_content)

        print(f"SUCCESS: Version archived at {archive_path}")
        return True, archive_path
    except Exception as e:
        print(f"ERROR: Failed to create archive: {e}")
        return False, str(e)

if __name__ == "__main__":
    archive_version()
