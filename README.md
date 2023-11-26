# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and Django server

## Get Started for window

### To start Django
$ git clone https://github.com/Ekaluk52003/django-vitejs-starter.git
$ py -m venv myenv
$ myenv\Scripts\activate
$ py install -r requirements.txt

### To start React-vite
$ pnpm i
$ pnpm run dev

**For development , you must both "py manage.py runserver" and "pnpm run dev" to be able for Django to serve React-vite
Make sure to set Django setting Debg = True
**For Build to production
$ pnpm run build
$ py manage.py collectstatic
Make sure to set Django setting Debg = False