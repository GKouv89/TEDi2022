from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from . import matrixFactAPI

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(matrixFactAPI.update_recommendations, 'cron', hour=14, minute=0, second=0)
    scheduler.start()