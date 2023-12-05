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
$ fly info

### Futher reading
https://testdriven.io/blog/django-fly/


### PG admin
username : user@domain.com
password :SuperSecret