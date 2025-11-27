import asyncio
import asyncpg
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

# Extract params from DATABASE_URL for asyncpg (since it doesn't use sqlalchemy style url directly usually, or does it?)
# Actually asyncpg.connect takes a DSN.
# SQLAlchemy URL: postgresql+asyncpg://...
# asyncpg DSN: postgresql://...
# We need to strip +asyncpg

DSN = DATABASE_URL.replace("+asyncpg", "")

async def main():
    print(f"Testing connection to: {DSN}")
    try:
        conn = await asyncpg.connect(DSN)
        print("Connection successful!")
        await conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
