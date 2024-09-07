from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from .authors import Author
from .publishers import Publisher

class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    author_id = Column(Integer, ForeignKey('authors.id'))
    publisher_id = Column(Integer, ForeignKey('publishers.id'))
    isbn = Column(String(255))
    edition = Column(Integer)
    status = Column(Enum('active', 'inactive', name='book_status'), default='active')
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    author = relationship("Author", back_populates="books")
    publisher = relationship("Publisher", back_populates="books")
