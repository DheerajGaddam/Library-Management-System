from typing import Any, List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.books import Book
from app.schemas.books import BookCreate, BookUpdate


class CRUDBook(CRUDBase[Book, BookCreate, BookUpdate]):
    def get_by_title(self, db: Session, *, title: str) -> Any:
        return db.query(self.model).filter(
            self.model.title == title,
            self.model.status == "active"
        ).first()

book = CRUDBook(Book)
