from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/finance",
    tags=["finance"],
)

@router.post("/", response_model=schemas.Transaction)
async def create_transaction(transaction: schemas.TransactionCreate, db: AsyncSession = Depends(database.get_db)):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    await db.commit()
    await db.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[schemas.Transaction])
async def read_transactions(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Transaction).offset(skip).limit(limit))
    transactions = result.scalars().all()
    return transactions

@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Transaction).where(models.Transaction.id == transaction_id))
    transaction = result.scalar_one_or_none()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    await db.delete(transaction)
    await db.commit()
    return {"ok": True}

@router.put("/{transaction_id}", response_model=schemas.Transaction)
async def update_transaction(transaction_id: str, transaction: schemas.TransactionCreate, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Transaction).where(models.Transaction.id == transaction_id))
    db_transaction = result.scalar_one_or_none()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    for key, value in transaction.dict().items():
        setattr(db_transaction, key, value)
    
    await db.commit()
    await db.refresh(db_transaction)
    return db_transaction
