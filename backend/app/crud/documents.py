from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.documents import Document
from app.schemas.documents import DocumentCreate, DocumentUpdate
from typing import Any

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    def filter_by_source_and_id(self, db: Session, *, source: str, source_id: int) -> Any:
        return db.query(self.model).filter(
            self.model.source == source,
            self.model.source_id == source_id,
            self.model.status == "active"
        ).all()

document = CRUDDocument(Document)
