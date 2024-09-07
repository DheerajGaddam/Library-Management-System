from pydantic import BaseModel
from typing import Optional


class AuthorBase(BaseModel):
    name: Optional[str] = None
    authorinfo: Optional[str] = None
    status: Optional[str] = "active"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(AuthorBase):
    pass


class Author(AuthorBase):
    id: int

    class Config:
        orm_mode = True
