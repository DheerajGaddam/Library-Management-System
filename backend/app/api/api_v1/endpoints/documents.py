from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/")
def create_document(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.DocumentCreate = None
) -> Any:
    if current_user.status == "inactive" or current_user.user_type == "client":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    created_at = datetime.now()
    data.created_at = created_at
    data.query_name = (data.title + data.author + data.publisher).lower()
    document = crud.document.create(db=db, obj_in=data)
    return document

@router.put("/")
def update_document(
    id: int,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.DocumentUpdate = None
) -> Any:
    if current_user.status == "inactive" or current_user.user_type == "client":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    db_obj = crud.document.get(db=db, id=id)
    updated_at = datetime.now()
    data.updated_at = updated_at
    document = crud.document.update(db=db, db_obj=db_obj, obj_in=data)
    return document

@router.get("/list_documents")
def list_documents(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
):
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    return crud.document.get_multi(db=db)

@router.get("/search_documents")
def search_documents(
    query: str,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
):
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    return crud.document.search(db=db, search_query=query,column="query_name")


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
    obj = crud.document.remove(db=db, id=id)
    return obj