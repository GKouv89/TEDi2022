from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from . import matrixFactAPI

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(matrixFactAPI.update_recommendations, 'cron', hour=1, minute=0, second=0) # 01AM UTC = 04AM Athens Time
    scheduler.start()