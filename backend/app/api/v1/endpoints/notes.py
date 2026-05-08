from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session

from app.api.deps import get_db_session, get_current_user
from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteRead
from app.services.file_service import FileService

router = APIRouter()


@router.get("/", response_model=List[NoteRead])
async def list_notes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db_session)):
	def _get_notes():
		return db.query(Note).filter(Note.user_id == current_user.id).all()

	notes = await run_in_threadpool(_get_notes)
	return notes


@router.post("/", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
async def create_note(
	title: str = Form(...),
	content: Optional[str] = Form(None),
	file: Optional[UploadFile] = File(None),
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db_session),
):
	file_service = FileService()
	image_url = None
	if file:
		image_url = await file_service.save_upload(file)

	def _create():
		note = Note(user_id=current_user.id, title=title, content=content, image_url=image_url)
		db.add(note)
		db.commit()
		db.refresh(note)
		return note

	note = await run_in_threadpool(_create)
	return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db_session)):
	def _get_note():
		return db.query(Note).filter(Note.id == note_id).first()

	note = await run_in_threadpool(_get_note)
	if not note:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
	if note.user_id != current_user.id:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this note")

	# attempt to delete the associated image file (best-effort)
	file_service = FileService()
	if note.image_url:
		await run_in_threadpool(lambda: file_service.delete_file(note.image_url))

	def _delete():
		db.delete(note)
		db.commit()

	await run_in_threadpool(_delete)
	return None
