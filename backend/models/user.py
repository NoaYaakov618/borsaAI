from datetime import datetime, date, timezone, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from models import db

SESSION_BONUS_COOLDOWN = timedelta(minutes=10)
SESSION_BONUS_AMOUNT   = 50


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    coins = db.Column(db.Float, default=5000.0, nullable=False)  # Cash balance
    last_daily_reward = db.Column(db.Date, nullable=True)        # Last day coins were granted
    last_session_bonus = db.Column(db.DateTime, nullable=True)   # Last session bonus collection
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    holdings = db.relationship("Holding", back_populates="user", cascade="all, delete-orphan")
    transactions = db.relationship("Transaction", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def session_bonus_status(self) -> dict:
        """Return whether the session bonus is ready and seconds remaining."""
        now = datetime.now(timezone.utc)
        if self.last_session_bonus is None:
            return {"ready": True, "seconds_remaining": 0}
        last = self.last_session_bonus
        if last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        elapsed = now - last
        remaining = SESSION_BONUS_COOLDOWN - elapsed
        if remaining.total_seconds() <= 0:
            return {"ready": True, "seconds_remaining": 0}
        return {"ready": False, "seconds_remaining": int(remaining.total_seconds())}

    def claim_session_bonus(self) -> dict | None:
        """Award the session bonus if cooldown has elapsed. Returns award info or None."""
        status = self.session_bonus_status()
        if not status["ready"]:
            return None
        self.coins += SESSION_BONUS_AMOUNT
        self.last_session_bonus = datetime.now(timezone.utc)
        return {"coins_awarded": SESSION_BONUS_AMOUNT, "coins": round(self.coins, 4)}

    def claim_daily_reward(self, daily_coins: float) -> bool:
        """Award daily coins if not already claimed today. Returns True if awarded."""
        today = date.today()
        if self.last_daily_reward != today:
            self.coins += daily_coins
            self.last_daily_reward = today
            return True
        return False

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "coins": self.coins,
            "last_daily_reward": self.last_daily_reward.isoformat() if self.last_daily_reward else None,
            "last_session_bonus": self.last_session_bonus.isoformat() if self.last_session_bonus else None,
            "created_at": self.created_at.isoformat(),
        }
