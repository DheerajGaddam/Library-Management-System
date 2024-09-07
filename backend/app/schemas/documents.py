from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class DocumentType(str, Enum):
    book = "book"
    magazine = "magazine"
    article = "article"


class DocumentSource(str, Enum):
    book = "book"
    magazine = "magazine"
    journal_article = "journal_article"


class DocumentStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class DocumentBase(BaseModel):
    type: Optional[DocumentType] = "book"
    title: Optional[str] = None
    author: Optional[str] = None
    publisher: Optional[str] = None
    query_name: Optional[str] = None
    source: Optional[DocumentSource] = "book"
    source_id: Optional[int] = None
    copies: Optional[int] = 1
    is_electronic_copy: Optional[bool] = False
    status: Optional[DocumentStatus] = "active"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(DocumentBase):
    pass


class Document(DocumentBase):
    id: int
    source_id: Optional[int] = None

    class Config:
        orm_mode = True
