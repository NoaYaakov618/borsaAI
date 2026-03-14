import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'borsaai.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000")

    # Session cookie settings for cross-origin deployment (Vercel → Render)
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True

    # Game mechanics
    DAILY_COINS = 10                  # Coins given to each user per day
    STARTING_COINS = 5000             # Coins on account creation
    CRASH_PROBABILITY = 0.03          # 3% chance per day of a market crash
    BOOM_PROBABILITY = 0.03           # 3% chance per day of a market boom
