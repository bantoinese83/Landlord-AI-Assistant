from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.maintenance import MaintenanceRequest
from app.models.property import Property
from app.schemas.maintenance import MaintenanceRequest as MaintenanceRequestSchema, MaintenanceRequestCreate, MaintenanceRequestUpdate
from app.auth import get_current_active_user

router = APIRouter(prefix="/maintenance", tags=["maintenance"])


@router.get("/", response_model=List[MaintenanceRequestSchema])
def get_maintenance_requests(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get maintenance requests for properties owned by current user
    requests = db.query(MaintenanceRequest).join(Property).filter(
        Property.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return requests


@router.post("/", response_model=MaintenanceRequestSchema)
def create_maintenance_request(
    request: MaintenanceRequestCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify property belongs to current user
    property = db.query(Property).filter(
        Property.id == request.property_id,
        Property.owner_id == current_user.id
    ).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db_request = MaintenanceRequest(**request.dict(), requester_id=current_user.id)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


@router.get("/{request_id}", response_model=MaintenanceRequestSchema)
def get_maintenance_request(
    request_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    request = db.query(MaintenanceRequest).join(Property).filter(
        MaintenanceRequest.id == request_id,
        Property.owner_id == current_user.id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    return request


@router.put("/{request_id}", response_model=MaintenanceRequestSchema)
def update_maintenance_request(
    request_id: int,
    request_update: MaintenanceRequestUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    request = db.query(MaintenanceRequest).join(Property).filter(
        MaintenanceRequest.id == request_id,
        Property.owner_id == current_user.id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    
    update_data = request_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(request, field, value)
    
    db.commit()
    db.refresh(request)
    return request


@router.delete("/{request_id}")
def delete_maintenance_request(
    request_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    request = db.query(MaintenanceRequest).join(Property).filter(
        MaintenanceRequest.id == request_id,
        Property.owner_id == current_user.id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    
    db.delete(request)
    db.commit()
    return {"message": "Maintenance request deleted successfully"}
