from pydantic import BaseModel


class AttachmentRead(BaseModel):
    id: int
    file_name: str
