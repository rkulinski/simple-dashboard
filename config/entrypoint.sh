#!/bin/sh

/scripts/wait-for-it.sh python manage.py runserver 0.0.0.0:8000
