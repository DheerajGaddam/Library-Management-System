from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/")
def create_journal_article(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.JournalArticleCreate = None
) -> Any:
    if current_user.status == "inactive" or current_user.user_type == "client":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    created_at = datetime.now()
    data.created_at = created_at
    journal_article = crud.journal_article.create(db=db, obj_in=data)
    return journal_article

@router.put("/")
def update_journal_article(
    id: int,
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    data: schemas.JournalArticleUpdate = None
) -> Any:
    if current_user.status == "inactive" or current_user.user_type == "client":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    db_obj = crud.journal_article.get(db=db, id=id)
    updated_at = datetime.now()
    data.updated_at = updated_at
    journal_article = crud.journal_article.update(db=db, db_obj=db_obj, obj_in=data)
    return journal_article

@router.get("/list_journal_articles")
def list_journal_articles(
    current_user: models.Users = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
):
    if current_user.status == "inactive":
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )  
    return crud.journal_article.get_multi(db=db)


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
    obj = crud.journal_article.remove(db=db, id=id)
    return obj