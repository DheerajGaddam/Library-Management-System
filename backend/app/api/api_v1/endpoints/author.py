from typing import Any, List
import logging

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

logger = logging.getLogger("fastapi")
from datetime import datetime

@router.post("/")
def create(
    current_user:models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.AuthorCreate = None
) -> Any:
    if(current_user.status=="inactive" or current_user.user_type=="client"):
        raise HTTPException(
            status_code=401,
            detail="User not found",)  
    created_at=datetime.now()
    data.created_at = datetime.now()
    author = crud.author.create(db=db,obj_in=data)
    return author

@router.put("/")
def update(
    id: int,
    current_user:models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.AuthorUpdate = None
) -> Any:
    if(current_user.status=="inactive" or current_user.user_type=="client"):
        raise HTTPException(
            status_code=401,
            detail="User not found",)  
    db_obj=crud.author.get(db=db,id=id)
    updated_at=datetime.now()
    data.updated_at = datetime.now()
    author = crud.author.update(db=db,db_obj=db_obj,obj_in=data)
    return author

@router.get("/list_authors")
def list( 
    current_user:models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    ):
    if(current_user.status=="inactive"):
        raise HTTPException(
            status_code=401,
            detail="User not found",)  
    return crud.author.get_multi(db=db)

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
    obj = crud.author.remove(db=db, id=id)
    return obj