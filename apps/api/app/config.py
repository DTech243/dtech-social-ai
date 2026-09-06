from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    secret_key: str = "change-me"
    database_url: str = "sqlite:///./dtech_social_ai.db"
    cors_origins: str = "http://localhost:5173"
    frontend_url: str = "http://localhost:5173"
    meta_app_id: str = ""
    meta_app_secret: str = ""
    meta_redirect_uri: str = "http://localhost:8000/api/meta/oauth/callback"
    meta_api_version: str = "v23.0"
    ai_provider: str = ""
    ai_api_key: str = ""
    storage_endpoint: str = ""
    storage_bucket: str = "dtech-social-ai"
    storage_access_key: str = ""
    storage_secret_key: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
