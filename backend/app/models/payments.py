from sqlalchemy import Column, Enum, Integer, String, DateTime,ForeignKey,DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey('creditcards.id'))
    amount = Column(DECIMAL(10, 2))
    document_id = Column(Integer, ForeignKey('documents.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    status = Column(Enum('active', 'inactive', name='payment_status'), default='active')
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, nullable=True)

    credit_card = relationship("CreditCard", back_populates="payments")
    document = relationship("Document",back_populates="payments")
    user = relationship("Users", back_populates="payments")
