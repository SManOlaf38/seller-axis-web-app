from datetime import datetime

import pytz
from croniter import croniter
from django.conf import settings
from django.core.cache import cache

client_events = settings.EVENT_CLIENT
NEXT_EXCUTION_TIME_CACHE = "next_excution_{}"


def get_next_execution_time(organization):
    try:
        cache_key = NEXT_EXCUTION_TIME_CACHE.format(organization)
        cache_response = cache.get(cache_key)
        if cache_response and cache_response > datetime.now(tz=pytz.utc):
            return cache_response
        rule_name = settings.GETTING_NEW_ORDER_RULE_NAME
        rule_details = client_events.describe_rule(Name=rule_name)
        schedule_expression = rule_details["ScheduleExpression"]
        schedule_expression = (
            schedule_expression.replace("cron(", "").replace(")", "").replace("?", "")
        )
        current_time = datetime.now(tz=pytz.utc)
        cron = croniter(schedule_expression, current_time)
        response = cron.get_next(datetime).astimezone(pytz.utc)
        cache.set(cache_key, response, 1800)
        return response
    except Exception:
        return None
