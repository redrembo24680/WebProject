import os
import uuid
from typing import Optional

import aiofiles
from fastapi import UploadFile, HTTPException


class FileService:
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    upload_dir = os.path.join(os.getcwd(), "static", "uploads")

    def __init__(self) -> None:
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_upload(self, upload_file: UploadFile) -> Optional[str]:
        if not upload_file:
            return None
        if upload_file.content_type not in self.allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        ext = os.path.splitext(upload_file.filename)[1] or ""
        filename = f"{uuid.uuid4().hex}{ext}"
        dest_path = os.path.join(self.upload_dir, filename)

        async with aiofiles.open(dest_path, "wb") as out_file:
            content = await upload_file.read()
            await out_file.write(content)

        # return relative path
        return os.path.relpath(dest_path, os.getcwd()).replace("\\", "/")
