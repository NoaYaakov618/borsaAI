from flask import Blueprint, jsonify, request, session
from models import db
from models.user import User
from models.asset import Asset
from models.portfolio import Holding
from models.transaction import Transaction, TransactionType

portfolio_bp = Blueprint("portfolio", __name__, url_prefix="/api/portfolio")


def _get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return None
    return db.session.get(User, user_id)


@portfolio_bp.get("/")
def get_portfolio():
    user = _get_current_user()
    if not user:
        return jsonify({"error": "Not authenticated"}), 401

    holdings = Holding.query.filter_by(user_id=user.id).filter(Holding.quantity > 0).all()
    portfolio_value = sum(h.current_value for h in holdings)

    return jsonify({
        "coins": round(user.coins, 4),
        "portfolio_value": round(portfolio_value, 4),
        "total_value": round(user.coins + portfolio_value, 4),
        "holdings": [h.to_dict() for h in holdings],
    })


@portfolio_bp.post("/buy")
def buy_asset():
    user = _get_current_user()
    if not user:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json()
    symbol = (data.get("symbol") or "").upper()
    quantity = data.get("quantity")

    if not symbol or not quantity or float(quantity) <= 0:
        return jsonify({"error": "symbol and a positive quantity are required"}), 400

    quantity = float(quantity)
    asset = Asset.query.filter_by(symbol=symbol).first_or_404()
    total_cost = quantity * asset.current_price

    if user.coins < total_cost:
        return jsonify({"error": "Insufficient coins", "required": total_cost, "available": user.coins}), 400

    # Deduct coins
    user.coins -= total_cost

    # Update or create holding
    holding = Holding.query.filter_by(user_id=user.id, asset_id=asset.id).first()
    if holding:
        # Recalculate weighted average buy price
        total_qty = holding.quantity + quantity
        holding.avg_buy_price = (
            (holding.quantity * holding.avg_buy_price + quantity * asset.current_price) / total_qty
        )
        holding.quantity = total_qty
    else:
        holding = Holding(
            user_id=user.id,
            asset_id=asset.id,
            quantity=quantity,
            avg_buy_price=asset.current_price,
        )
        db.session.add(holding)

    # Record transaction
    tx = Transaction(
        user_id=user.id,
        asset_id=asset.id,
        transaction_type=TransactionType.BUY,
        quantity=quantity,
        price_per_unit=asset.current_price,
        total_cost=total_cost,
    )
    db.session.add(tx)
    db.session.commit()

    return jsonify({
        "message": f"Bought {quantity} {symbol}",
        "transaction": tx.to_dict(),
        "coins_remaining": round(user.coins, 4),
    })


@portfolio_bp.post("/sell")
def sell_asset():
    user = _get_current_user()
    if not user:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json()
    symbol = (data.get("symbol") or "").upper()
    quantity = data.get("quantity")

    if not symbol or not quantity or float(quantity) <= 0:
        return jsonify({"error": "symbol and a positive quantity are required"}), 400

    quantity = float(quantity)
    asset = Asset.query.filter_by(symbol=symbol).first_or_404()
    holding = Holding.query.filter_by(user_id=user.id, asset_id=asset.id).first()

    if not holding or holding.quantity < quantity:
        return jsonify({"error": "Insufficient shares to sell"}), 400

    proceeds = quantity * asset.current_price
    user.coins += proceeds
    holding.quantity -= quantity

    tx = Transaction(
        user_id=user.id,
        asset_id=asset.id,
        transaction_type=TransactionType.SELL,
        quantity=quantity,
        price_per_unit=asset.current_price,
        total_cost=proceeds,
    )
    db.session.add(tx)
    db.session.commit()

    return jsonify({
        "message": f"Sold {quantity} {symbol}",
        "transaction": tx.to_dict(),
        "coins_remaining": round(user.coins, 4),
    })


@portfolio_bp.get("/transactions")
def transaction_history():
    user = _get_current_user()
    if not user:
        return jsonify({"error": "Not authenticated"}), 401

    limit = request.args.get("limit", 50, type=int)
    txs = (
        Transaction.query.filter_by(user_id=user.id)
        .order_by(Transaction.executed_at.desc())
        .limit(limit)
        .all()
    )
    return jsonify({"transactions": [t.to_dict() for t in txs]})
