from typing import Any

from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.publishers import Publisher
from app.schemas.publishers import PublisherCreate, PublisherUpdate

class CRUDPublisher(CRUDBase[Publisher, PublisherCreate, PublisherUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Any:
        return db.query(self.model).filter(
            self.model.name == name, 
            self.model.status == "active"
        ).first()

publisher = CRUDPublisher(Publisher)
