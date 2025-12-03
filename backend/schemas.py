from pydantic import BaseModel
from typing import List, Optional, Literal

class ClientFileBase(BaseModel):
    name: str

class ClientFileCreate(ClientFileBase):
    pass

class ClientFile(ClientFileBase):
    id: str
    uploaded_at: str

    class Config:
        orm_mode = True

class ClientBase(BaseModel):
    name: str
    address: str
    sno: str

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: str
    created_at: str
    files: List[ClientFile] = []

    class Config:
        orm_mode = True

class ProjectTransactionBase(BaseModel):
    type: Literal['bill', 'received']
    description: str
    amount: float
    date: str

class ProjectTransactionCreate(ProjectTransactionBase):
    pass

class ProjectTransaction(ProjectTransactionBase):
    id: str

    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    name: str
    location: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    created_at: str
    transactions: List[ProjectTransaction] = []

    class Config:
        orm_mode = True

class BillBase(BaseModel):
    item: str
    amount: float
    date: str
    note: str

class BillCreate(BillBase):
    payment_status: Optional[Literal['pending', 'paid', 'partial']] = 'pending'
    amount_paid: Optional[float] = 0.0

class Bill(BillBase):
    id: str
    created_at: str
    payment_status: str
    amount_paid: float
    payment_history: Optional[List[dict]] = []

    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    name: str
    date: str
    note: str
    credit: float
    debit: float
    sno: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    created_at: str

    class Config:
        orm_mode = True

class ValuationBase(BaseModel):
    client_name: str
    date: str
    purpose: Literal['agriculture', 'commercial', 'residence']
    page_count: Literal[1, 3]
    data: Optional[dict] = {}

class ValuationCreate(ValuationBase):
    pass

class Valuation(ValuationBase):
    id: str
    created_at: str

    class Config:
        orm_mode = True

class VendorBase(BaseModel):
    name: str
    phone: str
    category: Literal['cement', 'steel', 'sanitary', 'tiles']

class VendorCreate(VendorBase):
    pass

class Vendor(VendorBase):
    id: str
    created_at: str

    class Config:
        orm_mode = True
