from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import UserRegister, UserLogin, UserResponse, Token
from backend.app.security.auth import get_password_hash, verify_password, create_access_token, get_current_user
from backend.app.security.audit import log_audit_event

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User email already registered")
        
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role or "owner"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    log_audit_event(db, user, "USER_REGISTER", f"New user account registered: {user.email}")
    return user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    log_audit_event(db, user, "LOGIN", f"User logged in successfully: {user.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
