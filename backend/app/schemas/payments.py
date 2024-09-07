from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class PaymentBase(BaseModel):
    card_id: Optional[int] 
    amount: Optional[Decimal] 
    document_id: Optional[int]
    status: Optional[str] = "active"
    user_id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(PaymentBase):
    pass


class PaymentInDBBase(PaymentBase):
    id: int
    user_id: int


    class Config:
        orm_mode = True


class Payment(PaymentInDBBase):
    pass