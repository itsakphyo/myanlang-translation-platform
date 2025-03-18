from pydantic_settings import BaseSettings

from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    USE_CREDENTIALS: bool
    TEMPLATE_FOLDER: str
    MAIL_FROM_NAME: str
    ADMIN_EMAIL: str

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings() 