from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.tenant import Tenant
from app.models.property import Property
from app.schemas.tenant import Tenant as TenantSchema, TenantCreate, TenantUpdate
from app.auth import get_current_active_user

router = APIRouter(prefix="/tenants", tags=["tenants"])


@router.get("/", response_model=List[TenantSchema])
def get_tenants(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get tenants for properties owned by current user
    tenant_query = db.query(Tenant).join(Property).filter(
        Property.owner_id == current_user.id
    ).offset(skip).limit(limit)
    tenants = tenant_query.all()
    return tenants


@router.post("/", response_model=TenantSchema)
def create_tenant(
    tenant: TenantCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify property belongs to current user
    property = db.query(Property).filter(
        Property.id == tenant.property_id,
        Property.owner_id == current_user.id
    ).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db_tenant = Tenant(**tenant.dict())
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant


@router.get("/{tenant_id}", response_model=TenantSchema)
def get_tenant(
    tenant_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    tenant = db.query(Tenant).join(Property).filter(
        Tenant.id == tenant_id,
        Property.owner_id == current_user.id
    ).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant


@router.put("/{tenant_id}", response_model=TenantSchema)
def update_tenant(
    tenant_id: int,
    tenant_update: TenantUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    tenant = db.query(Tenant).join(Property).filter(
        Tenant.id == tenant_id,
        Property.owner_id == current_user.id
    ).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    update_data = tenant_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tenant, field, value)
    
    db.commit()
    db.refresh(tenant)
    return tenant


@router.delete("/{tenant_id}")
def delete_tenant(
    tenant_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    tenant = db.query(Tenant).join(Property).filter(
        Tenant.id == tenant_id,
        Property.owner_id == current_user.id
    ).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    db.delete(tenant)
    db.commit()
    return {"message": "Tenant deleted successfully"}
