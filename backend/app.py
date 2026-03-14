from flask import Flask
from flask_cors import CORS

from config import Config
from models import db
from routes.auth import auth_bp
from routes.market import market_bp
from routes.portfolio import portfolio_bp
from routes.game import game_bp
from services.game_scheduler import start_scheduler, stop_scheduler


def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Extensions
    db.init_app(app)
    CORS(app, supports_credentials=True, origins=app.config["CORS_ORIGINS"])

    # Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(market_bp)
    app.register_blueprint(portfolio_bp)
    app.register_blueprint(game_bp)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        db.create_all()

    start_scheduler(app)

    try:
        app.run(debug=True, use_reloader=False, port=5000)
    finally:
        stop_scheduler()
