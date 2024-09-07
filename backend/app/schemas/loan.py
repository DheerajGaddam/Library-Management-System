from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LoansBase(BaseModel):
    document_id: Optional[int]
    lend_date: Optional[datetime]
    return_date: Optional[datetime]
    status: str = "active"
    user_id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class LoansCreate(LoansBase):
    pass

class LoansUpdate(LoansBase):
    pass

class LoansInDBBase(LoansBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True

# Schema to use when interacting with the API
class Loans(LoansInDBBase):
    pass
