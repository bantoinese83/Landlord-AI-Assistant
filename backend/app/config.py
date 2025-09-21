from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
    database_url: str = "postgresql://username:password@localhost:5432/landlord_ai_db"
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    redis_url: str = "redis://localhost:6379"
    secret_key: str = "your_secret_key_here_make_it_long_and_secure"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    allowed_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    environment: str = "development"
    openai_api_key: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()