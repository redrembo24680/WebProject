from fastapi import UploadFile


class FileStorage:
    def store(self, upload_file: UploadFile) -> str:
        return upload_file.filename or ""
