from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/valuations",
    tags=["valuations"],
)

@router.post("/", response_model=schemas.Valuation)
async def create_valuation(valuation: schemas.ValuationCreate, db: AsyncSession = Depends(database.get_db)):
    db_valuation = models.Valuation(**valuation.dict())
    db.add(db_valuation)
    await db.commit()
    await db.refresh(db_valuation)
    return db_valuation

@router.get("/", response_model=List[schemas.Valuation])
async def read_valuations(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Valuation).offset(skip).limit(limit))
    valuations = result.scalars().all()
    return valuations

@router.delete("/{valuation_id}")
async def delete_valuation(valuation_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Valuation).where(models.Valuation.id == valuation_id))
    valuation = result.scalar_one_or_none()
    if valuation is None:
        raise HTTPException(status_code=404, detail="Valuation not found")
    await db.delete(valuation)
    await db.commit()
    return {"ok": True}

@router.put("/{valuation_id}", response_model=schemas.Valuation)
async def update_valuation(valuation_id: str, valuation: schemas.ValuationCreate, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Valuation).where(models.Valuation.id == valuation_id))
    db_valuation = result.scalar_one_or_none()
    if db_valuation is None:
        raise HTTPException(status_code=404, detail="Valuation not found")
    
    for key, value in valuation.dict().items():
        setattr(db_valuation, key, value)
    
    await db.commit()
    await db.refresh(db_valuation)
    return db_valuation
