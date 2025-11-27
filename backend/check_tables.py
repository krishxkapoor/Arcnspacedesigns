import psycopg2
import sys

try:
    conn = psycopg2.connect(
        dbname="archiva_db",
        user="postgres",
        password="KRISH@1020",
        host="localhost",
        port="5432"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tables = cursor.fetchall()
    print("Tables in archiva_db:")
    for table in tables:
        print(f"- {table[0]}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
