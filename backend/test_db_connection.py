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
    print("Connection successful!")
    conn.close()
except psycopg2.OperationalError as e:
    print(f"Connection failed: {e}")
    sys.exit(1)
