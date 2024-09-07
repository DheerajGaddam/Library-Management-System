from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

from app.db.base_class import Base


class Magazine(Base):
    __tablename__ = 'magazines'

    id = Column(Integer, primary_key=True, index=True)
    name_of_magazine = Column(String(255))
    publisher_id = Column(Integer, ForeignKey('publishers.id'), index=True)
    issn = Column(String(255))
    volume = Column(Integer)
    year = Column(Integer)
    month = Column(Integer)
    status = Column(Enum('active', 'inactive', name='magazine_status'), default='active', index=True)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, nullable=True)

    publisher = relationship("Publisher", back_populates="magazines")
