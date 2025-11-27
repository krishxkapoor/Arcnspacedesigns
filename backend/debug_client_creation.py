import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import sys

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend import models, database

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def test_create_client():
    async with AsyncSessionLocal() as session:
        try:
            print("Attempting to create client...")
            new_client = models.Client(
                id=models.generate_uuid(),
                name="Debug Client",
                address="Debug Address",
                sno="DEBUG001",
                created_at="2023-01-01T00:00:00"
            )
            session.add(new_client)
            await session.commit()
            print("Client created successfully!")
        except Exception as e:
            print(f"Error creating client: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_create_client())
