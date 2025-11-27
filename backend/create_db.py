import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

try:
    # Connect to the default 'postgres' database
    conn = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="KRISH@1020",
        host="localhost",
        port="5432"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'archiva_db'")
    exists = cursor.fetchone()
    
    if not exists:
        cursor.execute("CREATE DATABASE archiva_db")
        print("Database 'archiva_db' created successfully!")
    else:
        print("Database 'archiva_db' already exists.")
        
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error creating database: {e}")
    sys.exit(1)
