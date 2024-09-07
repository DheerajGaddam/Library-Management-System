from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.payments import Payment
from app.schemas.payments import PaymentCreate, PaymentUpdate
from typing import Any

class CRUDPayment(CRUDBase[Payment, PaymentCreate, PaymentUpdate]):
    def create(self, db: Session, *, obj_in: PaymentCreate) -> Payment:
        obj_in_data = obj_in.dict()
        db_obj = Payment(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


    def remove(self, db: Session, *, id: int) -> Payment:
        obj = db.query(Payment).get(id)
        db.delete(obj)
        db.commit()
        return obj

    def get_by_amount(self, db: Session, *, amount: float) -> Payment:
        return db.query(Payment).filter(Payment.amount == amount).first()

    def get_payments_by_user_id(self, db: Session, user_id: int) -> Any:
        return db.query(Payment).filter(Payment.user_id == user_id).all()
    

payment=CRUDPayment(Payment)