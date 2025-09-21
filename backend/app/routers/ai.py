from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.property import Property
from app.models.maintenance import MaintenanceRequest
from app.auth import get_current_active_user
from app.services.ai_service import ai_service
from app.services.redis_service import redis_service
from typing import List

router = APIRouter(prefix="/ai", tags=["ai-assistant"])


@router.get("/insights")
async def get_property_insights(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get AI-generated property insights"""
    try:
        # Check cache first
        cached_insights = await redis_service.get_cached_dashboard_data(current_user.id)
        if cached_insights and 'ai_insights' in cached_insights:
            return cached_insights['ai_insights']
        
        # Get properties data
        properties = db.query(Property).filter(Property.owner_id == current_user.id).all()
        properties_data = [
            {
                "id": prop.id,
                "name": prop.name,
                "address": prop.address,
                "city": prop.city,
                "state": prop.state,
                "property_type": prop.property_type,
                "rent_amount": prop.rent_amount,
                "bedrooms": prop.bedrooms,
                "bathrooms": prop.bathrooms,
                "square_feet": prop.square_feet,
                "is_active": prop.is_active
            }
            for prop in properties
        ]
        
        # Generate AI insights
        insights = await ai_service.generate_property_insights(properties_data)
        
        # Cache the results
        await redis_service.cache_dashboard_data(current_user.id, {"ai_insights": insights})
        
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")


@router.get("/maintenance-recommendations/{property_id}")
async def get_maintenance_recommendations(
    property_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get AI-generated maintenance recommendations for a property"""
    try:
        # Verify property ownership
        property = db.query(Property).filter(
            Property.id == property_id,
            Property.owner_id == current_user.id
        ).first()
        
        if not property:
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Get maintenance history
        maintenance_history = db.query(MaintenanceRequest).filter(
            MaintenanceRequest.property_id == property_id
        ).all()
        
        property_data = {
            "id": property.id,
            "name": property.name,
            "address": property.address,
            "property_type": property.property_type,
            "bedrooms": property.bedrooms,
            "bathrooms": property.bathrooms,
            "square_feet": property.square_feet,
            "rent_amount": property.rent_amount,
            "created_at": property.created_at.isoformat()
        }
        
        maintenance_data = [
            {
                "id": req.id,
                "title": req.title,
                "description": req.description,
                "status": req.status,
                "priority": req.priority,
                "estimated_cost": req.estimated_cost,
                "actual_cost": req.actual_cost,
                "created_at": req.created_at.isoformat()
            }
            for req in maintenance_history
        ]
        
        # Generate recommendations
        recommendations = await ai_service.generate_maintenance_recommendations(
            property_data, maintenance_data
        )
        
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")


@router.get("/rent-analysis/{property_id}")
async def get_rent_analysis(
    property_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get AI-generated rent market analysis for a property"""
    try:
        # Verify property ownership
        property = db.query(Property).filter(
            Property.id == property_id,
            Property.owner_id == current_user.id
        ).first()
        
        if not property:
            raise HTTPException(status_code=404, detail="Property not found")
        
        property_data = {
            "id": property.id,
            "name": property.name,
            "address": property.address,
            "city": property.city,
            "state": property.state,
            "property_type": property.property_type,
            "bedrooms": property.bedrooms,
            "bathrooms": property.bathrooms,
            "square_feet": property.square_feet,
            "rent_amount": property.rent_amount,
            "created_at": property.created_at.isoformat()
        }
        
        # Generate rent analysis
        analysis = await ai_service.analyze_rent_market(property_data)
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate rent analysis: {str(e)}")


@router.post("/generate-communication")
async def generate_tenant_communication(
    tenant_id: int,
    context: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered tenant communication"""
    try:
        # Get tenant data (simplified for this example)
        # In a real implementation, you'd query the tenant from the database
        tenant_data = {
            "id": tenant_id,
            "context": context
        }
        
        # Generate communication
        communication = await ai_service.generate_tenant_communication(
            tenant_data, context
        )
        
        return communication
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate communication: {str(e)}")
