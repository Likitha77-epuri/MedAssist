import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "mediassist_db"
    jwt_secret: str = "super_secret_mediassist_key_123456_change_me_in_production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 120
    gemini_api_key: str = ""
    openai_api_key: str = ""
    port: int = 8000
    host: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
