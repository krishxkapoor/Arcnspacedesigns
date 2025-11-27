from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/bills",
    tags=["bills"],
)

@router.post("/", response_model=schemas.Bill)
async def create_bill(bill: schemas.BillCreate, db: AsyncSession = Depends(database.get_db)):
    db_bill = models.Bill(**bill.dict())
    db.add(db_bill)
    await db.commit()
    await db.refresh(db_bill)
    return db_bill

@router.get("/", response_model=List[schemas.Bill])
async def read_bills(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Bill).offset(skip).limit(limit))
    bills = result.scalars().all()
    return bills

@router.delete("/{bill_id}")
async def delete_bill(bill_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Bill).where(models.Bill.id == bill_id))
    bill = result.scalar_one_or_none()
    if bill is None:
        raise HTTPException(status_code=404, detail="Bill not found")
    await db.delete(bill)
    await db.commit()
    return {"ok": True}

@router.put("/{bill_id}", response_model=schemas.Bill)
async def update_bill(bill_id: str, bill: schemas.BillCreate, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Bill).where(models.Bill.id == bill_id))
    db_bill = result.scalar_one_or_none()
    if db_bill is None:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    for key, value in bill.dict().items():
        setattr(db_bill, key, value)
    
    await db.commit()
    await db.refresh(db_bill)
    return db_bill
