from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date


class TenantBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    lease_start_date: date
    lease_end_date: date
    monthly_rent: str
    security_deposit: Optional[str] = None
    notes: Optional[str] = None


class TenantCreate(TenantBase):
    property_id: int


class TenantUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    lease_start_date: Optional[date] = None
    lease_end_date: Optional[date] = None
    monthly_rent: Optional[str] = None
    security_deposit: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class TenantInDB(TenantBase):
    id: int
    property_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Tenant(TenantInDB):
    pass
