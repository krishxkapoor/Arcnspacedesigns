import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

async def test_connection():
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    print("=" * 60)
    print("DATABASE CONNECTION TEST")
    print("=" * 60)
    
    if not DATABASE_URL:
        print("❌ ERROR: DATABASE_URL not found in .env file!")
        print("\nPlease ensure your .env file contains:")
        print("DATABASE_URL=postgresql+asyncpg://user:password@host/database")
        return
    
    # Hide password in output
    safe_url = DATABASE_URL.replace(DATABASE_URL.split('@')[0].split('://')[1], '***:***')
    print(f"\n📍 Database URL: {safe_url}")
    
    try:
        print("\n🔄 Attempting to connect to database...")
        engine = create_async_engine(DATABASE_URL, echo=False)
        
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("✅ SUCCESS: Database connection established!")
            print("✅ Database is ready to use!")
            
    except Exception as e:
        print(f"\n❌ ERROR: Failed to connect to database!")
        print(f"Error details: {str(e)}")
        print("\nPossible issues:")
        print("1. Check if DATABASE_URL is correct in .env file")
        print("2. Ensure the Render database is accessible")
        print("3. Verify your IP is whitelisted (if required)")
        print("4. Check if asyncpg is installed: pip install asyncpg")
    finally:
        await engine.dispose()
    
    print("=" * 60)

if __name__ == "__main__":
    from sqlalchemy import text
    asyncio.run(test_connection())
