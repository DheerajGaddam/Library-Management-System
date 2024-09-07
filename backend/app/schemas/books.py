from pydantic import BaseModel
from typing import Optional
from enum import Enum


class BookStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class BookBase(BaseModel):
    title: Optional[str] = None
    author_id: Optional[int] = None
    publisher_id: Optional[int] = None
    isbn: Optional[str] = None
    edition: Optional[int] = None
    status: Optional[BookStatus] = "active"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class BookCreate(BookBase):
    pass


class BookUpdate(BookBase):
    pass


class Book(BookBase):
    id: int
    author_id: Optional[int] = None
    publisher_id: Optional[int] = None
    class Config:
        orm_mode = True
