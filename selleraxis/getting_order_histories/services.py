from datetime import datetime

from croniter import croniter
from django.conf import settings
from django.core.cache import cache

client_events = settings.EVENT_CLIENT
NEXT_EXCUTION_TIME_CACHE = "next_excution_{}"


def get_next_execution_time(organization):
    cache_key = NEXT_EXCUTION_TIME_CACHE.format(organization)
    cache_response = cache.get(cache_key)
    if cache_response and cache_response > datetime.now():
        return cache_response
    rule_name = settings.GETTING_NEW_ORDER_RULE_NAME
    rule_details = client_events.describe_rule(Name=rule_name)
    schedule_expression = rule_details["ScheduleExpression"]
    schedule_expression = (
        schedule_expression.replace("cron(", "").replace(")", "").replace("?", "")
    )
    current_time = datetime.now()
    cron = croniter(schedule_expression, current_time)
    response = cron.get_next(datetime)
    cache.set(NEXT_EXCUTION_TIME_CACHE.format(organization), response)
    return response
