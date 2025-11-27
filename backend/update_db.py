import asyncio
from sqlalchemy import text
from database import engine

async def add_data_column():
    async with engine.begin() as conn:
        try:
            # Try to add the column
            await conn.execute(text("ALTER TABLE valuations ADD COLUMN data JSONB DEFAULT '{}'"))
            print("✅ Added 'data' column to valuations table")
        except Exception as e:
            print(f"ℹ️  Column might already exist or error: {e}")

if __name__ == "__main__":
    asyncio.run(add_data_column())
