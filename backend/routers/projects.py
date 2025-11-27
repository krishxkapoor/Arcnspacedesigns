from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from .. import models, schemas, database
import datetime

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
)

@router.post("/", response_model=schemas.Project)
async def create_project(project: schemas.ProjectCreate, db: AsyncSession = Depends(database.get_db)):
    db_project = models.Project(
        id=models.generate_uuid(),
        name=project.name,
        created_at=datetime.datetime.utcnow().isoformat()
    )
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return schemas.Project(
        id=db_project.id,
        name=db_project.name,
        created_at=db_project.created_at,
        transactions=[]
    )

@router.get("/", response_model=List[schemas.Project])
async def read_projects(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Project).options(selectinload(models.Project.transactions)).offset(skip).limit(limit))
    projects = result.scalars().all()
    return projects

@router.delete("/{project_id}")
async def delete_project(project_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Project).where(models.Project.id == project_id))
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
    return {"ok": True}

@router.post("/{project_id}/transactions", response_model=schemas.ProjectTransaction)
async def create_project_transaction(project_id: str, transaction: schemas.ProjectTransactionCreate, db: AsyncSession = Depends(database.get_db)):
    db_transaction = models.ProjectTransaction(**transaction.dict(), project_id=project_id)
    db.add(db_transaction)
    await db.commit()
    await db.refresh(db_transaction)
    return db_transaction

@router.delete("/{project_id}/transactions/{transaction_id}")
async def delete_project_transaction(project_id: str, transaction_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.ProjectTransaction).where(models.ProjectTransaction.id == transaction_id, models.ProjectTransaction.project_id == project_id))
    transaction = result.scalar_one_or_none()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    await db.delete(transaction)
    await db.commit()
    return {"ok": True}

@router.put("/{project_id}", response_model=schemas.Project)
async def update_project(project_id: str, project: schemas.ProjectCreate, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Project).where(models.Project.id == project_id))
    db_project = result.scalar_one_or_none()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.name = project.name
    # created_at is not updated
    
    await db.commit()
    await db.refresh(db_project)
    return schemas.Project(
        id=db_project.id,
        name=db_project.name,
        created_at=db_project.created_at,
        transactions=[] # We don't need to return transactions on update
    )

@router.put("/{project_id}/transactions/{transaction_id}", response_model=schemas.ProjectTransaction)
async def update_project_transaction(project_id: str, transaction_id: str, transaction: schemas.ProjectTransactionCreate, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.ProjectTransaction).where(models.ProjectTransaction.id == transaction_id, models.ProjectTransaction.project_id == project_id))
    db_transaction = result.scalar_one_or_none()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    for key, value in transaction.dict().items():
        setattr(db_transaction, key, value)
    
    await db.commit()
    await db.refresh(db_transaction)
    return db_transaction
