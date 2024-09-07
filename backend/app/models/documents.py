from sqlalchemy import Column, Integer, String, Enum, DateTime,func,Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True,index=True)
    type = Column(Enum('book', 'magazine', 'article', name='document_type'), index=True)
    title = Column(String(255), index=True)
    author = Column(String(255),index=True)
    publisher = Column(String(255),index=True)
    query_name = Column(String(255),index=True)
    source = Column(Enum('book', 'magazine', 'journal_article', name='document_source'), index=True)
    source_id = Column(Integer, index=True)
    copies = Column(Integer, default=1)
    is_electronic_copy = Column(Boolean, default=False)
    status = Column(Enum('active', 'inactive', name='document_status'), default='active', index=True)
    created_at = Column(DateTime, index=True, default=func.current_timestamp())
    updated_at = Column(DateTime, nullable=True, index=True)

    loan = relationship("Loans", back_populates="document")
    payments = relationship("Payment",back_populates="document")
