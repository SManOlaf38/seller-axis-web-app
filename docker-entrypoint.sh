#!/bin/bash

echo "Apply database migrations"
python manage.py migrate

echo "Starting server"
gunicorn --bind 0.0.0.0:80 --access-logfile - project_name.wsgi
