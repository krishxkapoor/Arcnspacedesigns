from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from .. import models, schemas, database
import datetime

router = APIRouter(
    prefix="/clients",
    tags=["clients"],
)

@router.post("/", response_model=schemas.Client)
async def create_client(client: schemas.ClientCreate, db: AsyncSession = Depends(database.get_db)):
    try:
        db_client = models.Client(
            id=models.generate_uuid(),
            name=client.name,
            address=client.address,
            sno=client.sno,
            created_at=datetime.datetime.utcnow().isoformat()
        )
        db.add(db_client)
        await db.commit()
        await db.refresh(db_client)
        # Manually construct response to avoid MissingGreenlet error
        return schemas.Client(
            id=db_client.id,
            name=db_client.name,
            address=db_client.address,
            sno=db_client.sno,
            created_at=db_client.created_at,
            files=[]
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[schemas.Client])
async def read_clients(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Client).options(selectinload(models.Client.files)).offset(skip).limit(limit))
    clients = result.scalars().all()
    return clients

@router.get("/{client_id}", response_model=schemas.Client)
async def read_client(client_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Client).options(selectinload(models.Client.files)).where(models.Client.id == client_id))
    client = result.scalar_one_or_none()
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.delete("/{client_id}")
async def delete_client(client_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Client).where(models.Client.id == client_id))
    client = result.scalar_one_or_none()
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    await db.delete(client)
    await db.commit()
    return {"ok": True}

@router.put("/{client_id}", response_model=schemas.Client)
async def update_client(client_id: str, client: schemas.ClientCreate, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Client).where(models.Client.id == client_id))
    db_client = result.scalar_one_or_none()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db_client.name = client.name
    db_client.address = client.address
    db_client.sno = client.sno
    
    await db.commit()
    await db.refresh(db_client)
    return schemas.Client(
        id=db_client.id,
        name=db_client.name,
        address=db_client.address,
        sno=db_client.sno,
        created_at=db_client.created_at,
        files=[]
    )

@router.post("/{client_id}/files", response_model=schemas.ClientFile)
async def create_client_file(client_id: str, file: schemas.ClientFileCreate, db: AsyncSession = Depends(database.get_db)):
    db_file = models.ClientFile(**file.dict(), client_id=client_id)
    db.add(db_file)
    await db.commit()
    await db.refresh(db_file)
    return db_file

@router.delete("/{client_id}/files/{file_id}")
async def delete_client_file(client_id: str, file_id: str, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.ClientFile).where(models.ClientFile.id == file_id, models.ClientFile.client_id == client_id))
    file = result.scalar_one_or_none()
    if file is None:
        raise HTTPException(status_code=404, detail="File not found")
    await db.delete(file)
    await db.commit()
    return {"ok": True}
