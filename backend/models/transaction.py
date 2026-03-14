from datetime import datetime
from models import db


class TransactionType:
    BUY = "buy"
    SELL = "sell"


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey("assets.id"), nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)  # buy | sell
    quantity = db.Column(db.Float, nullable=False)
    price_per_unit = db.Column(db.Float, nullable=False)
    total_cost = db.Column(db.Float, nullable=False)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="transactions")
    asset = db.relationship("Asset")

    def to_dict(self):
        return {
            "id": self.id,
            "asset_symbol": self.asset.symbol,
            "asset_name": self.asset.name,
            "transaction_type": self.transaction_type,
            "quantity": self.quantity,
            "price_per_unit": round(self.price_per_unit, 4),
            "total_cost": round(self.total_cost, 4),
            "executed_at": self.executed_at.isoformat(),
        }


class MarketEvent(db.Model):
    """Records market-wide events like crashes or booms."""
    __tablename__ = "market_events"

    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(20), nullable=False)   # crash | boom
    magnitude = db.Column(db.Float, nullable=False)          # % impact, e.g. -0.20 for -20%
    description = db.Column(db.String(255), nullable=True)
    occurred_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "event_type": self.event_type,
            "magnitude": self.magnitude,
            "description": self.description,
            "occurred_at": self.occurred_at.isoformat(),
        }
