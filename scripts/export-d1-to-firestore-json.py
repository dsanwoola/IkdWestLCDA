import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SQL_PATH = ROOT / "d1_dump.sql"
OUT_DIR = ROOT / "firebase-seed"
OUT_PATH = OUT_DIR / "firestore-data.json"

TABLES = [
    "staff_users",
    "departments",
    "service_requests",
    "audit_logs",
    "cms_articles",
    "cms_announcements",
    "cms_projects",
    "marriage_applications",
    "status_history",
]


def main() -> None:
    db = sqlite3.connect(":memory:")
    db.row_factory = sqlite3.Row
    db.executescript(SQL_PATH.read_text(encoding="utf-8"))

    export = {}
    for table in TABLES:
      rows = db.execute(f'SELECT * FROM "{table}"').fetchall()
      export[table] = [dict(row) for row in rows]

    OUT_DIR.mkdir(exist_ok=True)
    OUT_PATH.write_text(json.dumps(export, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
