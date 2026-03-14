import jwt
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, current_app
from models import db
from models.user import User
from routes.auth_utils import get_current_user

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _make_token(user_id: int) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


@auth_bp.post("/register")
def register():
    data = request.get_json()
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not username or not email or not password:
        return jsonify({"error": "username, email and password are required"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already taken"}), 409

    user = User(username=username, email=email)
    user.set_password(password)
    user.coins = current_app.config["STARTING_COINS"]
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created", "user": user.to_dict(), "token": _make_token(user.id)}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()
    identifier = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier.lower())
    ).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"user": user.to_dict(), "token": _make_token(user.id)})


@auth_bp.post("/logout")
def logout():
    return jsonify({"message": "Logged out"})


@auth_bp.get("/me")
def me():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Not authenticated"}), 401
    return jsonify({"user": user.to_dict()})
