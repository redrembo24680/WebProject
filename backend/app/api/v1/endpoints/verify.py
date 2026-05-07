from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.concurrency import run_in_threadpool

from app.api.deps import get_db_session
from app.models.user import User
from app.core.security import decode_access_token

router = APIRouter()


@router.get("/verify")
async def verify_account(token: str, db: Session = Depends(get_db_session)):
    user_id = None
    # try decode JWT
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        # fallback: token might be plain user id
        try:
            user_id = int(token)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    def _get_user():
        return db.query(User).filter(User.id == user_id).first()

    user = await run_in_threadpool(_get_user)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    def _activate():
        user.is_active = True
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    await run_in_threadpool(_activate)
    return {"message": "Акаунт активовано"}
