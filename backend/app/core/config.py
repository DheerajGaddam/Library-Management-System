from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator
from pydantic.typing import NoneType


import os

class Settings(BaseSettings):
    POSTGRES_SERVER: str = "host"
    POSTGRES_USER: str = "user"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "db"
    SQLALCHEMY_DATABASE_URI: Optional[str]  = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:5432/{POSTGRES_DB}"
    API_V1_STR: str = "/library/api/v1"
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SECRET_KEY: str="giqvijfXur1AyhPyvJwL2FFaLq4rQp5EV5C6GbuohoU"
    class Config:
        case_sensitive = True

settings = Settings()