from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from datetime import datetime, timedelta

router = APIRouter()


@router.post("/")
def create_payment(
    payment_in: schemas.payments.PaymentCreate,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    payment_in.created_at=datetime.now()
    payment_in.user_id=current_user.id
    payment = crud.payment.create(db=db, obj_in=payment_in)
    return payment


@router.get("/")
def list_payments(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    payments = crud.payment.get_multi(db=db)
    return payments


@router.get("/{payment_id}")
def get_payment_by_id(
    payment_id: int,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:

    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    payment = crud.payment.get(db=db, id=payment_id)
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


# @router.delete("/{payment_id}")
# def delete_payment(
#     payment_id: int,
#     current_user: models.Users = Depends(deps.get_current_user),
#     db: Session = Depends(deps.get_db),
# ) -> Any:
#     if current_user.status == "inactive":
#         raise HTTPException(
#             status_code=401,
#             detail="User not found",
#         )
#     payment = crud.payment.remove(db=db, id=payment_id)
#     if payment is None:
#         raise HTTPException(status_code=404, detail="Payment not found")
#     return payment

@router.get("/user/me")
def list_user_payments(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
) -> Any:

    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    payments = crud.payment.get_payments_by_user_id(db=db,user_id=current_user.id)
    return payments

@router.put("/{payment_id}")
def update_payment(
    payment_id: int,
    payment_in: schemas.payments.PaymentUpdate,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:

    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    
    payment = crud.payment.get(db=db, id=payment_id)
    updated_at = datetime.now()
    payment_in.updated_at = updated_at
    
    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )
    
    payment = crud.payment.update(db=db, db_obj=payment, obj_in=payment_in)
    return payment

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
    obj = crud.payment.remove(db=db, id=id)
    return obj