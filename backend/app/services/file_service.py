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

    def delete_file(self, relative_path: Optional[str]) -> None:
        """Delete a previously saved file given its relative path.

        This method is defensive: it only deletes files that live under the
        configured upload directory to avoid accidental/unsafe deletes.
        """
        if not relative_path:
            return

        # Normalize and build absolute path
        try:
            # Protect against absolute paths or path traversal
            rel = relative_path.replace("/", os.path.sep).lstrip(os.path.sep)
            target_path = os.path.normpath(os.path.join(os.getcwd(), rel))
            upload_dir_norm = os.path.normpath(self.upload_dir)

            if not target_path.startswith(upload_dir_norm):
                # Don't delete files outside upload dir
                return

            if os.path.exists(target_path):
                os.remove(target_path)
        except Exception:
            # Swallow errors - deletion is a best-effort cleanup
            return
