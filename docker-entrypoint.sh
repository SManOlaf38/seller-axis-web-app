#!/bin/bash

echo "Apply database migrations"
python manage.py migrate

echo "Remove cache files"
rm -rf ./caches/*

echo "Starting server"
gunicorn --bind 0.0.0.0:80 --access-logfile - selleraxis.wsgi
