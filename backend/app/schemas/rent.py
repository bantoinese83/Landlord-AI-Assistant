from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from app.models.rent import PaymentStatus, PaymentMethod


class RentPaymentBase(BaseModel):
    amount: float
    due_date: date
    payment_method: Optional[PaymentMethod] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class RentPaymentCreate(RentPaymentBase):
    property_id: int
    tenant_id: int


class RentPaymentUpdate(BaseModel):
    amount: Optional[float] = None
    due_date: Optional[date] = None
    paid_date: Optional[date] = None
    status: Optional[PaymentStatus] = None
    payment_method: Optional[PaymentMethod] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class RentPaymentInDB(RentPaymentBase):
    id: int
    property_id: int
    tenant_id: int
    payer_id: int
    paid_date: Optional[date] = None
    status: PaymentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RentPayment(RentPaymentInDB):
    pass
