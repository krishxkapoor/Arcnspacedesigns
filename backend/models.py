from sqlalchemy import Column, String, Integer, Float, Date, ForeignKey, Text, Enum, JSON
from sqlalchemy.orm import relationship
from .database import Base
import uuid
from datetime import datetime

def generate_uuid():
    return str(uuid.uuid4())

class Client(Base):
    __tablename__ = "clients"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    address = Column(String)
    sno = Column(String)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    files = relationship("ClientFile", back_populates="client", cascade="all, delete-orphan")

class ClientFile(Base):
    __tablename__ = "client_files"

    id = Column(String, primary_key=True, default=generate_uuid)
    client_id = Column(String, ForeignKey("clients.id"))
    name = Column(String)
    uploaded_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    client = relationship("Client", back_populates="files")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    transactions = relationship("ProjectTransaction", back_populates="project", cascade="all, delete-orphan")

class ProjectTransaction(Base):
    __tablename__ = "project_transactions"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"))
    type = Column(String) # 'bill' or 'received'
    description = Column(String)
    amount = Column(Float)
    date = Column(String)

    project = relationship("Project", back_populates="transactions")

class Bill(Base):
    __tablename__ = "bills"

    id = Column(String, primary_key=True, default=generate_uuid)
    item = Column(String)
    amount = Column(Float)
    date = Column(String)
    note = Column(String)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    date = Column(String)
    note = Column(String)
    credit = Column(Float)
    debit = Column(Float)
    sno = Column(String, nullable=True)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

class Valuation(Base):
    __tablename__ = "valuations"

    id = Column(String, primary_key=True, default=generate_uuid)
    client_name = Column(String)
    date = Column(String)
    purpose = Column(String) # 'agriculture' | 'commercial' | 'residence'
    page_count = Column(Integer) # 1 | 3
    data = Column(JSON, default={})
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    phone = Column(String)
    category = Column(String) # 'cement' | 'steel' | 'sanitary' | 'tiles'
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
