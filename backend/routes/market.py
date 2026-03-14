from flask import Blueprint, jsonify, request
from models import db
from models.asset import Asset, PriceHistory
from models.transaction import MarketEvent

market_bp = Blueprint("market", __name__, url_prefix="/api/market")


@market_bp.get("/assets")
def list_assets():
    assets = Asset.query.all()
    return jsonify({"assets": [a.to_dict() for a in assets]})


@market_bp.get("/assets/<symbol>")
def get_asset(symbol: str):
    asset = Asset.query.filter_by(symbol=symbol.upper()).first_or_404()
    return jsonify({"asset": asset.to_dict()})


@market_bp.get("/assets/<symbol>/history")
def asset_history(symbol: str):
    asset = Asset.query.filter_by(symbol=symbol.upper()).first_or_404()
    limit = request.args.get("limit", 30, type=int)
    history = (
        PriceHistory.query.filter_by(asset_id=asset.id)
        .order_by(PriceHistory.recorded_at.desc())
        .limit(limit)
        .all()
    )
    return jsonify({
        "symbol": asset.symbol,
        "history": [h.to_dict() for h in reversed(history)],
    })


@market_bp.get("/events")
def recent_events():
    limit = request.args.get("limit", 10, type=int)
    events = (
        MarketEvent.query.order_by(MarketEvent.occurred_at.desc())
        .limit(limit)
        .all()
    )
    return jsonify({"events": [e.to_dict() for e in events]})
