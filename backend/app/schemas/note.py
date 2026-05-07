from datetime import datetime
from pydantic import BaseModel


class NoteBase(BaseModel):
    title: str
    content: str | None = None
    image_url: str | None = None


class NoteCreate(NoteBase):
    pass


class NoteRead(NoteBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
