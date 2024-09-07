from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/")
def create_magazine(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.MagazineCreate = None
) -> Any:
    if current_user.status == "inactive" or current_user.user_type == "client":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    created_at = datetime.now()
    data.created_at = created_at
    magazine = crud.magazine.create(db=db, obj_in=data)
    return magazine

@router.put("/")
def update_magazine(
    id: int,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.MagazineUpdate = None
) -> Any:
    if current_user.status == "inactive" or current_user.user_type == "client":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    db_obj = crud.magazine.get(db=db, id=id)
    updated_at = datetime.now()
    data.updated_at = updated_at
    magazine = crud.magazine.update(db=db, db_obj=db_obj, obj_in=data)
    return magazine

@router.get("/list_magazines")
def list_magazines(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
):
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    return crud.magazine.get_multi(db=db)

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
    obj = crud.magazine.remove(db=db, id=id)
    return obj