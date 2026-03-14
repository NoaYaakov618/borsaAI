"""
Price Engine
------------
Simulates realistic daily price movements using Geometric Brownian Motion (GBM).

Each asset has a `daily_volatility` (sigma). A random daily return is drawn
from a normal distribution. Market-wide events (crash / boom) apply an
additional shock to all non–money-market assets.
"""

import random
import math
from datetime import datetime
from models import db
from models.asset import Asset, AssetType, PriceHistory
from models.transaction import MarketEvent


# ── Shock parameters ────────────────────────────────────────────────────────
CRASH_SHOCK_RANGE = (-0.30, -0.10)   # market falls 10–30 %
BOOM_SHOCK_RANGE  = (0.10,  0.25)    # market rises 10–25 %

# Money-market daily yield (very low risk)
MONEY_MARKET_DAILY_YIELD = 0.001      # ~0.1 % per day ≈ 36 % annualised


def _gbm_return(mu: float, sigma: float) -> float:
    """Draw one daily log-return and convert to simple return."""
    log_return = mu - 0.5 * sigma ** 2 + sigma * random.gauss(0, 1)
    return math.exp(log_return) - 1


def advance_day(crash_prob: float, boom_prob: float) -> dict:
    """
    Move all asset prices forward by one simulated day.

    Returns a summary dict with the event (if any) and per-asset changes.
    """
    assets = Asset.query.all()
    event = None

    # ── Determine market event ────────────────────────────────────────────
    roll = random.random()
    if roll < crash_prob:
        shock = random.uniform(*CRASH_SHOCK_RANGE)
        event = MarketEvent(
            event_type="crash",
            magnitude=round(shock, 4),
            description=_crash_description(shock),
        )
        db.session.add(event)
    elif roll < crash_prob + boom_prob:
        shock = random.uniform(*BOOM_SHOCK_RANGE)
        event = MarketEvent(
            event_type="boom",
            magnitude=round(shock, 4),
            description=_boom_description(shock),
        )
        db.session.add(event)
    else:
        shock = 0.0

    changes = []
    for asset in assets:
        old_price = asset.current_price

        if asset.asset_type == AssetType.MONEY_MARKET:
            # Money market: fixed tiny daily yield, no crash exposure
            new_price = old_price * (1 + MONEY_MARKET_DAILY_YIELD)
        else:
            # Regular GBM drift ≈ 0 (students learn markets can go up OR down)
            daily_return = _gbm_return(mu=0.0, sigma=asset.daily_volatility)
            new_price = old_price * (1 + daily_return + shock)
            new_price = max(new_price, 0.01)   # floor price

        asset.previous_price = old_price
        asset.current_price = round(new_price, 4)

        # Append to history
        db.session.add(PriceHistory(asset_id=asset.id, price=asset.current_price))

        changes.append({
            "symbol": asset.symbol,
            "old_price": round(old_price, 4),
            "new_price": round(asset.current_price, 4),
            "change_pct": round((asset.current_price - old_price) / old_price * 100, 2),
        })

    db.session.commit()
    return {
        "event": event.to_dict() if event else None,
        "changes": changes,
    }


def _crash_description(shock: float) -> str:
    pct = abs(round(shock * 100))
    scenarios = [
        f"A sudden recession fears drove markets down {pct}%.",
        f"Surprise interest rate hike sent stocks tumbling {pct}%.",
        f"Global uncertainty caused a market sell-off of {pct}%.",
    ]
    return random.choice(scenarios)


def _boom_description(shock: float) -> str:
    pct = round(shock * 100)
    scenarios = [
        f"Strong earnings season boosted markets by {pct}%.",
        f"Central bank stimulus sparked a {pct}% rally.",
        f"Breakthrough tech news lifted all assets by {pct}%.",
    ]
    return random.choice(scenarios)
