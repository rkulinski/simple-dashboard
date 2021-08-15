# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY backend/requirements.txt /code/
RUN pip install -r requirements.txt
COPY backend /code
RUN apt-get update
RUN apt-get -y install postgresql

COPY config/wait-for-it.sh /scripts/
COPY config/entrypoint.sh /scripts/
RUN chmod +x /scripts/wait-for-it.sh
RUN chmod +x /scripts/entrypoint.sh
