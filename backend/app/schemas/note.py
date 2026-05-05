from pydantic import BaseModel


class NoteBase(BaseModel):
    title: str


class NoteCreate(NoteBase):
    content: str | None = None


class NoteRead(NoteBase):
    id: int
