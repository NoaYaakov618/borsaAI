from flask import Blueprint, jsonify, session
from models import db
from models.user import User
from flask import current_app

game_bp = Blueprint("game", __name__, url_prefix="/api/game")


@game_bp.get("/session-bonus/status")
def session_bonus_status():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.session_bonus_status())


@game_bp.post("/session-bonus")
def session_bonus():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    result = user.claim_session_bonus()
    if result is None:
        status = user.session_bonus_status()
        return jsonify({
            "error": "Bonus not ready yet",
            "seconds_remaining": status["seconds_remaining"],
        }), 429

    db.session.commit()
    return jsonify({
        "message": f"You earned {result['coins_awarded']} bonus coins for staying active!",
        "coins_awarded": result["coins_awarded"],
        "coins": result["coins"],
    })


@game_bp.post("/claim-daily")
def claim_daily():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    daily_coins = current_app.config["DAILY_COINS"]
    awarded = user.claim_daily_reward(daily_coins)

    if not awarded:
        return jsonify({"message": "Already claimed today", "coins": user.coins}), 200

    db.session.commit()
    return jsonify({
        "message": f"You received {daily_coins} coins!",
        "coins_awarded": daily_coins,
        "coins": round(user.coins, 4),
    })
