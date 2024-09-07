from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.magazines import Magazine
from app.schemas.magazines import MagazineCreate, MagazineUpdate
from typing import Any

class CRUDMagazine(CRUDBase[Magazine, MagazineCreate, MagazineUpdate]):
    def get_by_name(self, db: Session, *, name_of_magazine: str) -> Any:
        return db.query(self.model).filter(
            self.model.name_of_magazine == name_of_magazine, 
            self.model.status == "active"
        ).first()

magazine = CRUDMagazine(Magazine)