from fastapi import UploadFile


class FileService:
    def save_upload(self, upload_file: UploadFile) -> str:
        return upload_file.filename or ""
