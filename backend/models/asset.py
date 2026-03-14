from datetime import datetime
from models import db


class AssetType:
    STOCK = "stock"
    INDEX = "index"
    MONEY_MARKET = "money_market"


class Asset(db.Model):
    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    asset_type = db.Column(db.String(20), nullable=False)       # stock | index | money_market
    current_price = db.Column(db.Float, nullable=False)
    previous_price = db.Column(db.Float, nullable=False)        # Price at start of current day
    daily_volatility = db.Column(db.Float, default=0.02)        # Std dev of daily % change
    description = db.Column(db.String(255), nullable=True)

    # Relationships
    price_history = db.relationship("PriceHistory", back_populates="asset", cascade="all, delete-orphan")
    holdings = db.relationship("Holding", back_populates="asset")

    @property
    def daily_change(self) -> float:
        """Absolute price change since previous close."""
        return self.current_price - self.previous_price

    @property
    def daily_change_pct(self) -> float:
        """Percentage price change since previous close."""
        if self.previous_price == 0:
            return 0.0
        return (self.daily_change / self.previous_price) * 100

    def to_dict(self):
        return {
            "id": self.id,
            "symbol": self.symbol,
            "name": self.name,
            "asset_type": self.asset_type,
            "current_price": round(self.current_price, 4),
            "previous_price": round(self.previous_price, 4),
            "daily_change": round(self.daily_change, 4),
            "daily_change_pct": round(self.daily_change_pct, 2),
            "daily_volatility": self.daily_volatility,
            "description": self.description,
        }


class PriceHistory(db.Model):
    __tablename__ = "price_history"

    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.Integer, db.ForeignKey("assets.id"), nullable=False)
    price = db.Column(db.Float, nullable=False)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)

    asset = db.relationship("Asset", back_populates="price_history")

    def to_dict(self):
        return {
            "price": round(self.price, 4),
            "recorded_at": self.recorded_at.isoformat(),
        }
