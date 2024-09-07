from typing import Any,List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app import crud, models, schemas
from app.api import deps

from datetime import datetime, timedelta
import math

router = APIRouter()

@router.post("/")
def create_credit_card(
    credit_card_in: schemas.credit_card.CreditCardCreate,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:

    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    created_at = datetime.now()
    credit_card_in.created_at = created_at
    credit_card_in.user_id = current_user.id
    credit_card = crud.creditcard.create(db=db, obj_in=credit_card_in)
    return credit_card


@router.get("/{credit_card_id}")
def read_credit_card(
    credit_card_id: int,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    credit_card = crud.creditcard.get(db=db, id=credit_card_id)
    if not credit_card:
        raise HTTPException(
            status_code=404,
            detail="Credit card not found",
        )
    return credit_card


@router.get("/")
def list_credit_cards(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:

    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    credit_cards = crud.creditcard.get_multi(db=db)
    return credit_cards


@router.put("/{credit_card_id}")
def update_credit_card(
    credit_card_id: int,
    credit_card_in: schemas.credit_card.CreditCardUpdate,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:

    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    credit_card = crud.creditcard.get(db=db, id=credit_card_id)
    updated_at = datetime.now()
    credit_card_in.updated_at = updated_at
    if not credit_card:
        raise HTTPException(
            status_code=404,
            detail="Credit card not found",
        )
    credit_card = crud.creditcard.update(db=db, db_obj=credit_card, obj_in=credit_card_in)
    return credit_card


@router.delete("/{credit_card_id}")
def delete_credit_card(
    credit_card_id: int,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    credit_card = crud.creditcard.get(db=db, id=credit_card_id)
    if not credit_card:
        raise HTTPException(
            status_code=404,
            detail="Credit card not found",
        )
    credit_card = crud.creditcard.remove(db=db, id=credit_card_id)
    return credit_card

@router.get("/user/{user_id}")
def list_user_credit_cards(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:

    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )
    credit_cards = crud.creditcard.get_credit_cards_by_user(db=db,user_id=current_user.id)
    return credit_cards


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
    obj = crud.creditcard.remove(db=db, id=id)
    return obj