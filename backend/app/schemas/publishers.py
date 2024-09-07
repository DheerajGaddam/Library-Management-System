from pydantic import BaseModel
from typing import Optional
from enum import Enum


class PublisherType(str, Enum):
    individual = "individual"
    company = "company"


class PublisherBase(BaseModel):
    name: Optional[str] = None
    type: Optional[PublisherType]
    author: Optional[str] = None
    publisher: Optional[str] = None
    status: Optional[str] = "active"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class PublisherCreate(PublisherBase):
    pass


class PublisherUpdate(PublisherBase):
    pass


class Publisher(PublisherBase):
    id: int

    class Config:
        orm_mode = True
