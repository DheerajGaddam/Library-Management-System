from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.loans import Loans
from app.schemas.loan import LoansCreate, LoansUpdate
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime

class CRUDLoans(CRUDBase[Loans, LoansCreate, LoansUpdate]):
    def get_by_document_id(self, db: Session, *, document_id: int) -> Any:
        return db.query(self.model).filter(
            self.model.document_id == document_id,
            self.model.status == "active"
        ).first()

    def get_by_user_id(self, db: Session, *, user_id: int) -> Any:
        return db.query(self.model).filter(
            self.model.user_id == user_id,
            self.model.status == "active"
        ).first()
    
    def is_document_available_for_loan(self, db: Session, document_id: int) -> bool:
        document = db.query(self.model).filter(self.model.document_id == document_id).first()
        if not document:
            return False
        return document.copies > 0

    def get_all_by_user_id(self, db: Session, *, user_id: int) -> Any:
        return db.query(self.model).filter(
            self.model.user_id == user_id,
            self.model.status == "active"
        ).all()
    
    def return_document(self, db: Session, loan_id: int) -> None:
        loan = db.query(self.model).filter(self.model.id == loan_id).first()
        if not loan:
            raise HTTPException(
                status_code=404,
                detail="Loan not found",
            )

        if loan.return_date:
            raise HTTPException(
                status_code=400,
                detail="Document has already been returned",
            )

        loan.return_date = datetime.now()
        db.add(loan)
        db.commit()
        db.refresh(loan)
        return loan
loan = CRUDLoans(Loans)



# yearly = 1200

# non leap = 1200 (365)
# leap = 1200 (366)

# non leap and non leap - 365
# [30, 28/29, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31]

# subsciption - starts day x of month y (100)
# the tokens will expire on end of day x%(number of days in month y+1) of month y+1



