from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session

from app.api.deps import get_db_session
from app.models.user import User
from app.core.security import verify_password, create_access_token, decode_access_token
from app.schemas.user import UserCreate, UserRead
from app.core.security import get_password_hash
from app.services.mail_service import MailService
from app.core.config import settings

router = APIRouter()


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db_session)):
	def _get_user():
		return db.query(User).filter(User.email == form_data.username).first()

	user = await run_in_threadpool(_get_user)
	if not user or not verify_password(form_data.password, user.hashed_password):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

	access_token = create_access_token(subject=str(user.id))
	return {"access_token": access_token, "token_type": "bearer"}



@router.post("/register", response_model=UserRead, status_code=201)
async def register(
	payload: UserCreate,
	background_tasks: BackgroundTasks,
	db: Session = Depends(get_db_session),
):
	def _get_existing():
		return db.query(User).filter(User.email == payload.email).first()

	existing = await run_in_threadpool(_get_existing)
	if existing:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

	def _create_user():
		user = User(email=payload.email, hashed_password=get_password_hash(payload.password), is_active=False)
		db.add(user)
		db.commit()
		db.refresh(user)
		return user

	user = await run_in_threadpool(_create_user)

	# send verification email after the response is returned
	def _send():
		print(f"[AUTH] Sending verification email to {user.email}")
		verification_token = create_access_token(subject=str(user.id))
		frontend = settings.frontend_url.rstrip("/")
		verification_link = f"{frontend}/verify?token={verification_token}"
		MailService().send_verification_email(user.email, verification_link=verification_link)
		print(f"[AUTH] Email send task completed for {user.email}")

	background_tasks.add_task(_send)
	return user


@router.get("/verify")
async def verify_email(token: str, db: Session = Depends(get_db_session)):
	"""Activate user account via email verification link"""
	try:
		payload = decode_access_token(token)
		user_id = payload.get("sub")
		if not user_id:
			raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification token")
		
		def _activate():
			user = db.query(User).filter(User.id == int(user_id)).first()
			if not user:
				raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
			user.is_active = True
			db.commit()
			return user
		
		user = await run_in_threadpool(_activate)
		return {"message": "Email verified successfully", "user": user}
	except Exception as e:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Verification failed: {str(e)}")
