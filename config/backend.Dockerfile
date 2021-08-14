# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY backend/requirements.txt /code/
RUN pip install -r requirements.txt
COPY backend /code
