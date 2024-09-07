from sqlalchemy import Column, Integer, String, Enum, DECIMAL, DateTime,func
from sqlalchemy.ext.declarative import declarative_base
from app.db.base_class import Base

from sqlalchemy.orm import relationship


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255), unique=True, index=True)
    hashedPassword = Column(String, nullable=False)
    address = Column(String(255), nullable=True)
    user_type = Column(Enum('librarian', 'client', name='user_types'), default='client')
    salary = Column(DECIMAL(10, 2), nullable=True, default=None)
    status = Column(Enum('active', 'inactive', name='user_status'), default='active')
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)
    ssn = Column(String(20), nullable=True)  

    loan = relationship("Loans", back_populates="user")
    payments = relationship("Payment",back_populates="user")
    credit_card = relationship("CreditCard",back_populates="user")



