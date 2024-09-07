from datetime import datetime
from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session
from sqlalchemy.sql.sqltypes import DateTime
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.schemas.authors import AuthorCreate,AuthorUpdate
from app.models.authors import Author

class CRUDAuthor(CRUDBase[Author, AuthorCreate, AuthorUpdate]):
    def get_by_email(self, db: Session, *, name: str) -> Any:
        return db.query(self.model).filter(
            self.model.name == name, 
            self.model.status == "active"
        ).first()

author = CRUDAuthor(Author)