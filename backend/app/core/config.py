from pydantic import BaseModel


class Settings(BaseModel):
    project_name: str = "Personal Note Manager"
    database_url: str = "postgresql+psycopg://user:password@db:5432/personal_note_manager"
    jwt_secret_key: str = "change-me"
    brevo_api_key: str = ""
    brevo_sender_email: str = ""


settings = Settings()
