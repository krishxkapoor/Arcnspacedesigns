from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from .. import database

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

@router.delete("/clear-all-data")
async def clear_all_data(db: AsyncSession = Depends(database.get_db)):
    """Clear all data from all tables"""
    
    # Delete in correct order to respect foreign key constraints
    tables = [
        'client_files',
        'project_transactions', 
        'bills',
        'transactions',  # This is the finance/amount table
        'valuations',
        'projects',
        'vendors',
        'clients'
    ]
    
    results = {}
    
    for table in tables:
        try:
            result = await db.execute(text(f"DELETE FROM {table}"))
            results[table] = f"Deleted {result.rowcount} records"
        except Exception as e:
            results[table] = f"Error: {str(e)}"
    
    # Commit all deletions at once
    await db.commit()
    
    return {
        "message": "Database cleared successfully",
        "results": results
    }
