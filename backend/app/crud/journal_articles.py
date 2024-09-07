from typing import Any

from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.journal_articles import JournalArticle
from app.schemas.journal_articles import JournalArticleCreate, JournalArticleUpdate

class CRUDJournalArticle(CRUDBase[JournalArticle, JournalArticleCreate, JournalArticleUpdate]):
    def get_by_title(self, db: Session, *, title: str) -> Any:
        return db.query(self.model).filter(
            self.model.title == title, 
            self.model.status == "active"
        ).first()

journal_article = CRUDJournalArticle(JournalArticle)