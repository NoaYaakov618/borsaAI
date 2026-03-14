import jwt
from flask import request, current_app
from models import db
from models.user import User


def get_current_user():
    """Extract user from JWT Bearer token in Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:]
    try:
        payload = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"],
        )
        return db.session.get(User, payload["user_id"])
    except Exception:
        return None
