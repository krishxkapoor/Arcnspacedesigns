from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from pydantic import BaseModel
from datetime import datetime
from .. import models, schemas, database

router = APIRouter(
    prefix="/bills",
    tags=["bills"],
)

class PaymentRequest(BaseModel):
    amount: float
    note: str = ""

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

@router.post("/{bill_id}/payment", response_model=schemas.Bill)
async def add_payment(bill_id: str, payment: PaymentRequest, db: AsyncSession = Depends(database.get_db)):
    # Get the bill
    result = await db.execute(select(models.Bill).where(models.Bill.id == bill_id))
    bill = result.scalar_one_or_none()
    if bill is None:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    # Validate payment amount
    remaining = bill.amount - bill.amount_paid
    if payment.amount <= 0:
        raise HTTPException(status_code=400, detail="Payment amount must be positive")
    if payment.amount > remaining:
        raise HTTPException(status_code=400, detail=f"Payment amount exceeds remaining balance of ₹{remaining}")
    
    # Update payment history
    payment_record = {
        "amount": payment.amount,
        "date": datetime.utcnow().isoformat(),
        "note": payment.note
    }
    
    if bill.payment_history is None:
        bill.payment_history = []
    bill.payment_history.append(payment_record)
    
    # Update amount paid
    bill.amount_paid += payment.amount
    
    # Update payment status
    if bill.amount_paid >= bill.amount:
        bill.payment_status = 'paid'
    elif bill.amount_paid > 0:
        bill.payment_status = 'partial'
    else:
        bill.payment_status = 'pending'
    
    # Create a transaction record
    transaction = models.Transaction(
        name=f"Bill Payment: {bill.item}",
        date=datetime.utcnow().strftime('%Y-%m-%d'),
        note=payment.note or f"Payment for bill: {bill.item}",
        credit=0,
        debit=payment.amount,
        sno=f"BILL-{bill_id[:8]}"
    )
    db.add(transaction)
    
    await db.commit()
    await db.refresh(bill)
    return bill

