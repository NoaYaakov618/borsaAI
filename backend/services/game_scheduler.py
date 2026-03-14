"""
Game Scheduler
--------------
Uses APScheduler to run the daily price-tick automatically.
One simulated "day" passes every real-world minute in development,
configurable via the TICK_INTERVAL_SECONDS env var.
"""

import os
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger


_scheduler: BackgroundScheduler | None = None


def start_scheduler(app):
    global _scheduler
    if _scheduler and _scheduler.running:
        return

    tick_seconds = int(os.environ.get("TICK_INTERVAL_SECONDS", 60))

    _scheduler = BackgroundScheduler()
    _scheduler.add_job(
        func=_daily_tick,
        trigger=IntervalTrigger(seconds=tick_seconds),
        id="daily_tick",
        name="Advance simulated market day",
        replace_existing=True,
        args=[app],
    )
    _scheduler.start()
    app.logger.info(f"Scheduler started — tick every {tick_seconds}s")


def stop_scheduler():
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown()


def _daily_tick(app):
    """Runs inside the scheduler thread; needs an app context."""
    with app.app_context():
        from services.price_engine import advance_day
        result = advance_day(
            crash_prob=app.config["CRASH_PROBABILITY"],
            boom_prob=app.config["BOOM_PROBABILITY"],
        )
        event = result.get("event")
        if event:
            app.logger.info(f"Market event: {event['event_type']} ({event['magnitude']*100:.1f}%)")
        app.logger.info(f"Daily tick complete — {len(result['changes'])} assets updated")
