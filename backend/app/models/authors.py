from sqlalchemy import Column, Enum, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from app.db.base_class import Base

class Author(Base):
    __tablename__ = 'authors'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    authorinfo = Column(Text)
    status = Column(Enum('active', 'inactive', name='author_status'), default='active')
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)

    books = relationship("Book", back_populates="author")
    journal_articles = relationship("JournalArticle", back_populates="author")
