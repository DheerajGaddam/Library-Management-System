from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class CreditCardBase(BaseModel):
    cardnumber: Optional[str]=None
    email:  Optional[str]=None
    payment_address: Optional[str]=None
    status: Optional[str] = "active"
    user_id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class CreditCardCreate(CreditCardBase):
    pass


class CreditCardUpdate(CreditCardBase):
    pass


class CreditCardInDBBase(CreditCardBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class CreditCard(CreditCardInDBBase):
    pass