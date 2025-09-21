from typing import List, Dict, Any
import openai
from app.config import settings
import json

class AIService:
    def __init__(self):
        # Initialize OpenAI client
        # Note: You'll need to set OPENAI_API_KEY in your environment
        try:
            if settings.openai_api_key and settings.openai_api_key != "your_openai_api_key_here":
                self.client = openai.OpenAI(api_key=settings.openai_api_key)
            else:
                self.client = None
        except Exception:
            self.client = None
    
    async def generate_property_insights(self, properties: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate AI insights for property management"""
        if not self.client:
            return {"error": "AI service not configured"}
        
        try:
            prompt = f"""
            Analyze the following property data and provide insights:
            
            Properties: {json.dumps(properties, default=str)}
            
            Please provide:
            1. Market analysis and recommendations
            2. Maintenance suggestions
            3. Rent optimization opportunities
            4. Risk assessment
            5. General property management advice
            
            Format as JSON with clear, actionable insights.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a property management AI assistant. Provide practical, actionable insights for landlords."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            return {
                "insights": response.choices[0].message.content,
                "status": "success"
            }
        except Exception as e:
            return {"error": f"AI service error: {str(e)}"}
    
    async def generate_maintenance_recommendations(self, property_data: Dict[str, Any], maintenance_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate maintenance recommendations based on property and history"""
        if not self.client:
            return {"error": "AI service not configured"}
        
        try:
            prompt = f"""
            Based on this property and maintenance history, provide recommendations:
            
            Property: {json.dumps(property_data, default=str)}
            Maintenance History: {json.dumps(maintenance_history, default=str)}
            
            Provide:
            1. Preventive maintenance suggestions
            2. Priority items to address
            3. Cost estimates
            4. Timeline recommendations
            5. Vendor suggestions if applicable
            
            Format as JSON with actionable recommendations.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a property maintenance AI assistant. Provide practical maintenance recommendations."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            return {
                "recommendations": response.choices[0].message.content,
                "status": "success"
            }
        except Exception as e:
            return {"error": f"AI service error: {str(e)}"}
    
    async def analyze_rent_market(self, property_data: Dict[str, Any], market_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze rent pricing and market conditions"""
        if not self.client:
            return {"error": "AI service not configured"}
        
        try:
            prompt = f"""
            Analyze rent pricing for this property:
            
            Property: {json.dumps(property_data, default=str)}
            Market Data: {json.dumps(market_data or {}, default=str)}
            
            Provide:
            1. Recommended rent price
            2. Market comparison
            3. Pricing strategy
            4. Seasonal considerations
            5. Competitive analysis
            
            Format as JSON with pricing recommendations.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a real estate pricing AI assistant. Provide data-driven rent pricing recommendations."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=600,
                temperature=0.7
            )
            
            return {
                "analysis": response.choices[0].message.content,
                "status": "success"
            }
        except Exception as e:
            return {"error": f"AI service error: {str(e)}"}
    
    async def generate_tenant_communication(self, tenant_data: Dict[str, Any], context: str) -> Dict[str, Any]:
        """Generate professional tenant communications"""
        if not self.client:
            return {"error": "AI service not configured"}
        
        try:
            prompt = f"""
            Generate a professional communication for this tenant:
            
            Tenant: {json.dumps(tenant_data, default=str)}
            Context: {context}
            
            Create a professional, friendly, and clear message that addresses the context.
            Include appropriate tone and necessary details.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a property management communication AI. Generate professional, friendly tenant communications."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.7
            )
            
            return {
                "message": response.choices[0].message.content,
                "status": "success"
            }
        except Exception as e:
            return {"error": f"AI service error: {str(e)}"}

# Global instance
ai_service = AIService()
