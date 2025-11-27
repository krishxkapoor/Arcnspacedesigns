"""
Clear all data from database - Simple version
"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
import asyncpg

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

async def clear_database():
    # Get DATABASE_URL from environment or use default
    database_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@localhost/archiva_db")
    
    # Parse the connection string
    # Format: postgresql+asyncpg://user:password@host:port/database
    url_parts = database_url.replace("postgresql+asyncpg://", "").split("@")
    user_pass = url_parts[0].split(":")
    host_db = url_parts[1].split("/")
    
    user = user_pass[0]
    password = user_pass[1]
    
    # Handle host:port
    if ":" in host_db[0]:
        host, port = host_db[0].split(":")
        port = int(port)
    else:
        host = host_db[0]
        port = 5432  # Default PostgreSQL port
    
    database = host_db[1]
    
    print(f"🔌 Connecting to database: {database} on {host}:{port}")
    
    try:
        conn = await asyncpg.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database
        )
        
        print("🗑️  Clearing all data from database...\n")
        
        # Delete in correct order to respect foreign key constraints
        tables = [
            'client_files',
            'project_transactions', 
            'bills',
            'finance',
            'valuations',
            'projects',
            'vendors',
            'clients'
        ]
        
        for table in tables:
            try:
                result = await conn.execute(f"DELETE FROM {table}")
                # Extract count from result like "DELETE 14"
                count = result.split()[-1] if result else '0'
                print(f"   ✅ Deleted {count} records from '{table}'")
            except Exception as e:
                print(f"   ⚠️  Table '{table}': {str(e)[:50]}")
        
        print("\n✨ Database cleared successfully!")
        print("🚀 You can now start fresh with a clean database.\n")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        print(f"\nConnection details:")
        print(f"  Host: {host}")
        print(f"  User: {user}")
        print(f"  Database: {database}")

if __name__ == "__main__":
    asyncio.run(clear_database())
