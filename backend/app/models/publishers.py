# backend/app/models/publishers.py

from sqlalchemy import Column, Enum, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Publisher(Base):
    __tablename__ = 'publishers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    type = Column(Enum('individual', 'company', name='publisher_type'))
    author = Column(String(255))
    publisher = Column(String(255))
    status = Column(Enum('active', 'inactive', name='publisher_status'), default='active')
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    books = relationship("Book", back_populates="publisher")
    magazines = relationship("Magazine",back_populates="publisher")
    journal_articles = relationship("JournalArticle", back_populates="publisher")