from pydantic import BaseModel
from typing import Optional
from datetime import date
from enum import Enum


class JournalArticleStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class JournalArticleBase(BaseModel):
    name_of_journal: Optional[str] = None
    title: Optional[str] = None
    author_id: Optional[int] = None
    date_of_article: Optional[date] = None
    issue: Optional[int] = None
    year: Optional[int] = None
    publisher_id: Optional[int] = None
    status: Optional[JournalArticleStatus] = "active"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class JournalArticleCreate(JournalArticleBase):
    pass


class JournalArticleUpdate(JournalArticleBase):
    pass


class JournalArticle(JournalArticleBase):
    id: int
    author_id: Optional[int] = None
    publisher_id: Optional[int] = None

    class Config:
        orm_mode = True
