from pydantic import BaseModel
from typing import Optional
from enum import Enum


class MagazineStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class MagazineBase(BaseModel):
    name_of_magazine: Optional[str] = None
    publisher_id: Optional[int] = None
    issn: Optional[str] = None
    volume: Optional[int] = None
    year: Optional[int] = None
    month: Optional[int] = None
    status: Optional[MagazineStatus] = "active"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class MagazineCreate(MagazineBase):
    pass


class MagazineUpdate(MagazineBase):
    pass


class Magazine(MagazineBase):
    id: int
    publisher_id: Optional[int] = None

    class Config:
        orm_mode = True
