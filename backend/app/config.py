from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite+aiosqlite:///./consonance.db"
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    frontend_origin: str = "http://localhost:3000"
    frontend_origins: str | None = None

    @property
    def cors_origins(self) -> list[str]:
        if self.frontend_origins:
            origins = [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]
            if origins:
                return origins
        return [self.frontend_origin, "http://127.0.0.1:3000"]


settings = Settings()
