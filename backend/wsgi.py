from app import create_app
from services.game_scheduler import start_scheduler

app = create_app()

with app.app_context():
    from models import db
    db.create_all()

start_scheduler(app)
