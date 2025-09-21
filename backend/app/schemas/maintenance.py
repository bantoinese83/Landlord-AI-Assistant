from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.maintenance import MaintenanceStatus, MaintenancePriority


class MaintenanceRequestBase(BaseModel):
    title: str
    description: str
    priority: MaintenancePriority = MaintenancePriority.MEDIUM
    estimated_cost: Optional[str] = None


class MaintenanceRequestCreate(MaintenanceRequestBase):
    property_id: int
    tenant_id: Optional[int] = None


class MaintenanceRequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[MaintenanceStatus] = None
    priority: Optional[MaintenancePriority] = None
    estimated_cost: Optional[str] = None
    actual_cost: Optional[str] = None
    completion_notes: Optional[str] = None


class MaintenanceRequestInDB(MaintenanceRequestBase):
    id: int
    property_id: int
    tenant_id: Optional[int] = None
    requester_id: int
    status: MaintenanceStatus
    actual_cost: Optional[str] = None
    completion_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MaintenanceRequest(MaintenanceRequestInDB):
    pass
