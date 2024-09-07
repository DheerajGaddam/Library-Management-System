from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, TIMESTAMP, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Loans(Base):
    __tablename__ = 'loans'

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey('documents.id'))
    lend_date = Column(DateTime)
    return_date = Column(DateTime)  
    user_id = Column(Integer, ForeignKey('users.id'))
    status = Column(Enum('active', 'inactive', name='loan_status'), default='active')
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    document = relationship("Document", back_populates="loan")
    user = relationship("Users", back_populates="loan")




