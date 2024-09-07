from sqlalchemy import Column, Enum, Integer, String, DateTime,ForeignKey,DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class CreditCard(Base):
    __tablename__ = 'creditcards'

    id = Column(Integer, primary_key=True, index=True)
    cardnumber = Column(String(255), unique=True)
    email = Column(String(255))
    payment_address = Column(String(255))
    user_id = Column(Integer, ForeignKey('users.id'))
    status = Column(Enum('active', 'inactive', name='creditcard_status'), default='active')
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, nullable=True)

    payments = relationship("Payment", back_populates="credit_card")
    user = relationship("Users", back_populates="credit_card")
