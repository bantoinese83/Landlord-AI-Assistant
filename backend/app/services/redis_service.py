import redis
import json
from typing import Any, Optional, Dict
from app.config import settings

class RedisService:
    def __init__(self):
        self.redis_client = redis.from_url(settings.redis_url, decode_responses=True)
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis"""
        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None
    
    async def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Set value in Redis with expiration"""
        try:
            serialized_value = json.dumps(value, default=str)
            return self.redis_client.setex(key, expire, serialized_value)
        except Exception as e:
            print(f"Redis set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from Redis"""
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            print(f"Redis delete error: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in Redis"""
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            print(f"Redis exists error: {e}")
            return False
    
    async def get_user_session(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user session data"""
        return await self.get(f"session:user:{user_id}")
    
    async def set_user_session(self, user_id: int, session_data: Dict[str, Any], expire: int = 3600) -> bool:
        """Set user session data"""
        return await self.set(f"session:user:{user_id}", session_data, expire)
    
    async def delete_user_session(self, user_id: int) -> bool:
        """Delete user session data"""
        return await self.delete(f"session:user:{user_id}")
    
    async def cache_property_data(self, property_id: int, data: Dict[str, Any], expire: int = 1800) -> bool:
        """Cache property data"""
        return await self.set(f"property:{property_id}", data, expire)
    
    async def get_cached_property_data(self, property_id: int) -> Optional[Dict[str, Any]]:
        """Get cached property data"""
        return await self.get(f"property:{property_id}")
    
    async def cache_dashboard_data(self, user_id: int, data: Dict[str, Any], expire: int = 300) -> bool:
        """Cache dashboard data for user"""
        return await self.set(f"dashboard:user:{user_id}", data, expire)
    
    async def get_cached_dashboard_data(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get cached dashboard data for user"""
        return await self.get(f"dashboard:user:{user_id}")

# Global instance
redis_service = RedisService()
