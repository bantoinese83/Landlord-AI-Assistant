from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.rent import RentPayment
from app.models.property import Property
from app.schemas.rent import RentPayment as RentPaymentSchema, RentPaymentCreate, RentPaymentUpdate
from app.auth import get_current_active_user

router = APIRouter(prefix="/rent", tags=["rent"])


@router.get("/", response_model=List[RentPaymentSchema])
def get_rent_payments(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get rent payments for properties owned by current user
    payments = db.query(RentPayment).join(Property).filter(
        Property.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return payments


@router.post("/", response_model=RentPaymentSchema)
def create_rent_payment(
    payment: RentPaymentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify property belongs to current user
    property = db.query(Property).filter(
        Property.id == payment.property_id,
        Property.owner_id == current_user.id
    ).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db_payment = RentPayment(**payment.dict(), payer_id=current_user.id)
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


@router.get("/{payment_id}", response_model=RentPaymentSchema)
def get_rent_payment(
    payment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    payment = db.query(RentPayment).join(Property).filter(
        RentPayment.id == payment_id,
        Property.owner_id == current_user.id
    ).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Rent payment not found")
    return payment


@router.put("/{payment_id}", response_model=RentPaymentSchema)
def update_rent_payment(
    payment_id: int,
    payment_update: RentPaymentUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    payment = db.query(RentPayment).join(Property).filter(
        RentPayment.id == payment_id,
        Property.owner_id == current_user.id
    ).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Rent payment not found")
    
    update_data = payment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(payment, field, value)
    
    db.commit()
    db.refresh(payment)
    return payment


@router.delete("/{payment_id}")
def delete_rent_payment(
    payment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    payment = db.query(RentPayment).join(Property).filter(
        RentPayment.id == payment_id,
        Property.owner_id == current_user.id
    ).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Rent payment not found")
    
    db.delete(payment)
    db.commit()
    return {"message": "Rent payment deleted successfully"}
