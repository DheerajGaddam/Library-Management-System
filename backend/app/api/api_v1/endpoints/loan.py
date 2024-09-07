from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app import crud, models, schemas
from app.api import deps

from datetime import datetime, timedelta
import math

router = APIRouter()

@router.post("/")
def create_loan(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.loan.LoansCreate = None
) -> Any:
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    
    document = crud.document.get(db=db, id=data.document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )
    
    if document.copies<1 and document.is_electronic_copy == False:
        raise HTTPException(
            status_code=400,
            detail="Document is not available for loan",
        )
    
    lend_date = datetime.now()
    created_at = datetime.now()
    data.created_at = created_at  
    data.lend_date=  lend_date
    data.user_id = current_user.id
    loan = crud.loan.create(db=db, obj_in=data)
    return loan


@router.put("/")
def return_loan(
    id: int,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
) -> Any:
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    
    loan = crud.loan.get(db=db, id=id)
    if not loan:
        raise HTTPException(
            status_code=404,
            detail="Loan not found",
        )
    
    loan_obj = crud.loan.return_document(db=db, loan_id=id)
    fine=calculate_fine(loan_obj.lend_date,loan_obj.return_date)
    response = {"loan": loan_obj}
    
    response["fine"] = fine
    if fine > 0:
        payment_data = {
            "amount": fine,
            "document_id": loan_obj.document_id,
            "user_id": current_user.id,
            "created_at":datetime.now(),
            "status": "active"
        }
        payment = crud.payment.create(db=db, obj_in=payment_data)
    return response

def calculate_fine(lend_date: datetime, return_date: datetime) -> float:
    fine_rate_per_week = 5.0
    borrowing_period_end_date = lend_date + timedelta(weeks=4)
    
    if return_date <= borrowing_period_end_date:
        return 0.0
    
    days_overdue = (return_date - borrowing_period_end_date).days
    weeks_overdue = math.ceil(days_overdue / 7)
    
    fine = weeks_overdue * fine_rate_per_week
    return fine


@router.get("/list_loans")
def list_loans(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
):
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    
    return crud.loan.get_multi(db=db)

@router.get("/list_loans/me")
def list_loans(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
):
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    
    return crud.loan.get_all_by_user_id(db=db, user_id=current_user.id)

@router.delete("/")
def delete(    
    id: int,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)):
    if current_user.status == "inactive" or current_user.user_type == "client":
        raise HTTPException(
            status_code=401,
            detail="Unauthorized access",
        )  
    obj = crud.loan.remove(db=db, id=id)
    return obj