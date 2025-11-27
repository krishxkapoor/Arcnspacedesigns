from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/vendors",
    tags=["vendors"],
)

@router.post("/", response_model=schemas.Vendor)
async def create_vendor(vendor: schemas.VendorCreate, db: AsyncSession = Depends(database.get_db)):
    db_vendor = models.Vendor(**vendor.dict())
    db.add(db_vendor)
    await db.commit()
    await db.refresh(db_vendor)
    return db_vendor

@router.get("/", response_model=List[schemas.Vendor])
async def read_vendors(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Vendor).offset(skip).limit(limit))
    vendors = result.scalars().all()
    return vendors

@router.delete("/{vendor_id}")
async def delete_vendor(vendor_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Vendor).where(models.Vendor.id == vendor_id))
    vendor = result.scalar_one_or_none()
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    await db.delete(vendor)
    await db.commit()
    return {"ok": True}

@router.put("/{vendor_id}", response_model=schemas.Vendor)
async def update_vendor(vendor_id: str, vendor: schemas.VendorCreate, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Vendor).where(models.Vendor.id == vendor_id))
    db_vendor = result.scalar_one_or_none()
    if db_vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    for key, value in vendor.dict().items():
        setattr(db_vendor, key, value)
    
    await db.commit()
    await db.refresh(db_vendor)
    return db_vendor
