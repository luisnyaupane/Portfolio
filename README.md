# Luis Nyaupane — Full Stack Django REST Portfolio

A dynamic personal portfolio website. The backend (Django + Django REST
Framework) owns all the content — profile, skills, projects, experience,
education, and contact messages — and the frontend (plain HTML/CSS/JS)
renders everything by calling the REST API. Nothing about a project, skill,
or profile detail is hardcoded into the frontend; edit it in Django Admin
and it updates on the site automatically.

## 1. Technologies

- **Backend:** Django 5, Django REST Framework, django-cors-headers, Pillow
- **Frontend:** HTML5, CSS3 (custom properties, Grid/Flexbox), vanilla JavaScript (no frameworks)
- **Database:** SQLite for development (swap in PostgreSQL later via `DATABASE_URL`)

## 2. Folder structure

```
portfolio_project/
├── backend/
│   ├── manage.py
│   ├── config/            # settings, root urls
│   ├── portfolio/         # models, serializers, views, admin, seed command
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── css/ (style.css, responsive.css)
│   ├── js/  (api.js, main.js, projects.js, contact.js)
│   └── assets/
└── README.md
```

## 3. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # then edit SECRET_KEY etc.

python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data        # loads the initial profile/skills/projects/experience/education
python manage.py runserver
```

The API is now live at `http://127.0.0.1:8000/api/` and the admin at
`http://127.0.0.1:8000/admin/`.

## 4. Running the frontend

The frontend is static — no build step. Serve it with any static server so
`fetch()` calls aren't blocked by `file://` restrictions, e.g.:

```bash
cd frontend
python -m http.server 5500
```

Then open `http://127.0.0.1:5500`. `js/api.js` points at
`http://127.0.0.1:8000/api` by default — change `API_BASE_URL` there if your
backend runs elsewhere.

## 5. API endpoints

| Endpoint                          | Method | Notes                                   |
|------------------------------------|--------|------------------------------------------|
| `/api/profile/`                    | GET    | Returns the single profile object        |
| `/api/skills/`                     | GET    | Optional `?category=` filter             |
| `/api/projects/`                   | GET    | Paginated, `?page=`, `?featured=true`    |
| `/api/projects/<id>/`              | GET    | Project detail (used by the modal)       |
| `/api/experience/`                 | GET    | Ordered timeline entries                 |
| `/api/education/`                  | GET    | Ordered education entries                |
| `/api/contact/`                    | POST   | `{name, email, subject, message}`        |

## 6. Adding or editing content

Everything is managed from Django Admin (`/admin/`):

- **Profile** — one row; edit name, bio, photo, links.
- **Skills** — add/remove; grouped by `category` on the site.
- **Projects** — add/remove/edit; toggle `featured` to control the
  homepage's featured row; upload an `image`.
- **Experience** / **Education** — add/remove entries; `order` controls
  display order.
- **Contact Messages** — read-only inbox of form submissions, with an
  `is_read` flag.

No frontend file needs to change for any of this — `index.html`,
`style.css`, and the `.js` files are all data-driven.

## 7. Deployment notes

- Set `DEBUG=False`, a real `SECRET_KEY`, and your real domains in
  `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` via environment variables.
- Never set `CORS_ALLOW_ALL_ORIGINS = True` in production — list the exact
  frontend origin(s) in `CORS_ALLOWED_ORIGINS`.
- To move to PostgreSQL, install `dj-database-url` and `psycopg2-binary`
  and set `DATABASE_URL` — `config/settings.py` already reads it.
- Serve `frontend/` from any static host (Netlify, Nginx, S3, etc.) and
  point `API_BASE_URL` in `js/api.js` at the deployed backend.
