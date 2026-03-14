"""
Run once to create tables and seed the initial set of assets.
    python init_db.py
"""
from app import create_app
from models import db
from models.asset import Asset, AssetType, PriceHistory

SEED_ASSETS = [
    # Stocks
    {"symbol": "APPL",  "name": "Appleton Tech",      "asset_type": AssetType.STOCK,        "price": 150.0,  "volatility": 0.025, "description": "A big technology company"},
    {"symbol": "RIVR",  "name": "Riviera Motors",     "asset_type": AssetType.STOCK,        "price": 60.0,   "volatility": 0.030, "description": "Electric vehicle manufacturer"},
    {"symbol": "GROC",  "name": "GreenGroc Foods",    "asset_type": AssetType.STOCK,        "price": 35.0,   "volatility": 0.018, "description": "Consumer staples & grocery chain"},
    {"symbol": "BNKX",  "name": "BankEx Financial",   "asset_type": AssetType.STOCK,        "price": 85.0,   "volatility": 0.022, "description": "Large retail banking group"},
    {"symbol": "ENRG",  "name": "SolarEdge Energy",   "asset_type": AssetType.STOCK,        "price": 45.0,   "volatility": 0.035, "description": "Renewable energy company"},
    # Indices
    {"symbol": "MKT500","name": "Market 500 Index",   "asset_type": AssetType.INDEX,        "price": 500.0,  "volatility": 0.015, "description": "Tracks the top 500 companies (lower risk)"},
    {"symbol": "TECH20","name": "Tech 20 Index",       "asset_type": AssetType.INDEX,        "price": 200.0,  "volatility": 0.020, "description": "Tracks 20 leading technology companies"},
    # Money market
    {"symbol": "MMFND", "name": "Safe Haven Fund",    "asset_type": AssetType.MONEY_MARKET, "price": 10.0,   "volatility": 0.001, "description": "Very low risk, slow but steady growth"},
]


def seed():
    app = create_app()
    with app.app_context():
        db.create_all()
        for data in SEED_ASSETS:
            if not Asset.query.filter_by(symbol=data["symbol"]).first():
                asset = Asset(
                    symbol=data["symbol"],
                    name=data["name"],
                    asset_type=data["asset_type"],
                    current_price=data["price"],
                    previous_price=data["price"],
                    daily_volatility=data["volatility"],
                    description=data["description"],
                )
                db.session.add(asset)
                db.session.flush()
                db.session.add(PriceHistory(asset_id=asset.id, price=data["price"]))

        db.session.commit()
        print("Database initialised and assets seeded.")


if __name__ == "__main__":
    seed()
