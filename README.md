# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and Django server

## Get Started for window

### To start Django
$ git clone https://github.com/Ekaluk52003/django-vitejs-starter.git
$ py -m venv myenv
$ myenv\Scripts\activate
$ py install -r requirements.txt
 py manage.py runserver

### To start React-vite
$ pnpm i
$ pnpm run dev
**For development , you must both "py manage.py runserver" and "pnpm run dev" to be able for Django to serve React-vite**
Make sure to set Django setting Debg = True
**For Build to production
$ pnpm run build
$ py manage.py collectstatic
**For buidl step , you only need to run "py manage.py runserver**
**Make sure to set Django setting Debg = False**

### Deploy fly.io
-prepare Dockerfile
-Build react and collectstatic
$ pnpm run build
$ py manage.py collectstatic
$ fly deploy


### fly.io command
$ fly ssh console
$ fly status
$ fly secrets list
attach postgres to App "django-postgres" is prosgres app name
$ flyctl postgres attach django-postgres

### Futher reading
https://testdriven.io/blog/django-fly/


### PG admin
username : user@domain.com
password :SuperSecret


Postgres cluster django-postgres created
  Username:    postgres
  Password:    2TV814mHY6dVFsI
  Hostname:    django-postgres.internal
  Flycast:     fdaa:1:173f:0:1::5
  Proxy port:  5432
  Postgres port:  5433
  Connection string: postgres://postgres:2TV814mHY6dVFsI@django-postgres.flycast:5432

Save your credentials in a secure place -- you won't be able to see them again!


flyctl postgres attach django-postgres

Postgres cluster django-postgres is now attached to django-vitejs
The following secret was added to django-vitejs:
  fly secrets set DATABASE_URL="postgres://django_vitejs:kXSp824sqLhp8oC@django-postgres.flycast:5432/django_vitejs?sslmode=disable"

to remove
react select