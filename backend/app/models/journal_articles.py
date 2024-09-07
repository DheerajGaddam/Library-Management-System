from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, Index,DateTime,func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from app.db.base_class import Base


class JournalArticle(Base):
    __tablename__ = 'journal_articles'

    id = Column(Integer, primary_key=True)
    name_of_journal = Column(String(255), index=True)
    title = Column(String(255))
    author_id = Column(Integer, ForeignKey('authors.id'), index=True)
    date_of_article = Column(Date)
    issue = Column(Integer)
    year = Column(Integer)
    publisher_id = Column(Integer, ForeignKey('publishers.id'), index=True)
    status = Column(Enum('active', 'inactive', name='journal_article_status'), default='active', index=True)
    created_at = Column(DateTime, index=True, default=func.current_timestamp())
    updated_at = Column(DateTime, nullable=True, index=True)

    author = relationship("Author", back_populates="journal_articles")
    publisher = relationship("Publisher", back_populates="journal_articles")
