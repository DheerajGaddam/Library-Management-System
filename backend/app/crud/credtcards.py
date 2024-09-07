from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.credit_cards import CreditCard
from app.schemas.credit_card import CreditCardCreate, CreditCardUpdate
from typing import Any

class CRUDCreditCard(CRUDBase[CreditCard, CreditCardCreate, CreditCardUpdate]):
    def create(self, db: Session, *, obj_in: CreditCardCreate) -> CreditCard:
        obj_in_data = obj_in.dict()
        db_obj = CreditCard(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


    def remove(self, db: Session, *, id: int) -> CreditCard:
        obj = db.query(CreditCard).get(id)
        db.delete(obj)
        db.commit()
        return obj

    def get_by_cardnumber(self, db: Session, *, cardnumber: str) -> CreditCard:
        return db.query(CreditCard).filter(CreditCard.cardnumber == cardnumber).first()

    def get_by_email(self, db: Session, *, email: str) -> CreditCard:
        return db.query(CreditCard).filter(CreditCard.email == email).first()

    def get_by_payment_address(self, db: Session, *, payment_address: str) -> CreditCard:
        return db.query(CreditCard).filter(CreditCard.payment_address == payment_address).first()

    def get_credit_cards_by_user(
        self, db: Session, user_id: int
    ) -> Any:
        return db.query(self.model).filter(self.model.user_id == user_id).all()

creditcard=CRUDCreditCard(CreditCard)