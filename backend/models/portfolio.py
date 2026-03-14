from models import db


class Holding(db.Model):
    """Represents the number of shares of a given asset a user owns."""
    __tablename__ = "holdings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey("assets.id"), nullable=False)
    quantity = db.Column(db.Float, default=0.0, nullable=False)
    avg_buy_price = db.Column(db.Float, default=0.0, nullable=False)  # Cost basis per share

    user = db.relationship("User", back_populates="holdings")
    asset = db.relationship("Asset", back_populates="holdings")

    __table_args__ = (db.UniqueConstraint("user_id", "asset_id", name="uq_user_asset"),)

    @property
    def current_value(self) -> float:
        return self.quantity * self.asset.current_price

    @property
    def total_cost(self) -> float:
        return self.quantity * self.avg_buy_price

    @property
    def unrealized_pnl(self) -> float:
        return self.current_value - self.total_cost

    @property
    def unrealized_pnl_pct(self) -> float:
        if self.total_cost == 0:
            return 0.0
        return (self.unrealized_pnl / self.total_cost) * 100

    def to_dict(self):
        return {
            "id": self.id,
            "asset": self.asset.to_dict(),
            "quantity": self.quantity,
            "avg_buy_price": round(self.avg_buy_price, 4),
            "current_value": round(self.current_value, 4),
            "total_cost": round(self.total_cost, 4),
            "unrealized_pnl": round(self.unrealized_pnl, 4),
            "unrealized_pnl_pct": round(self.unrealized_pnl_pct, 2),
        }
