ARG PYTHON_VERSION=3.9-slim-bullseye

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies.
RUN apt-get update && apt-get install -y \
    cron -y \
    fonts-thai-tlwg \
    libpq-dev \
    gcc \
    python3-pip python3-cffi python3-brotli libpango-1.0-0 libpangoft2-1.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /code

WORKDIR /code

COPY requirements.txt /tmp/requirements.txt
RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/
COPY . /code

ENV SECRET_KEY "yLUpSPKuhTE8AXSqoTAwQWpC1C5QqOVaMH4A6qs9BWr50A0nOJ"
RUN python manage.py collectstatic --noinput

EXPOSE 8000

