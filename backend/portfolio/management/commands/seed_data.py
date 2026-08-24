from datetime import date
from django.core.management.base import BaseCommand
from portfolio.models import Profile, Skill, Project, Experience, Education


class Command(BaseCommand):
    help = "Seed the database with Luis Nyaupane's initial portfolio data."

    def handle(self, *args, **options):
        self.seed_profile()
        self.seed_skills()
        self.seed_projects()
        self.seed_experience()
        self.seed_education()
        self.stdout.write(self.style.SUCCESS("Portfolio seed data created/updated successfully."))

    def seed_profile(self):
        Profile.objects.update_or_create(
            email="neupaneluis07@gmail.com",
            defaults=dict(
                name="Luis Nyaupane",
                title="Full Stack Developer",
                secondary_title="Django & Django REST Framework Developer",
                bio=(
                    "Full Stack Developer with hands-on experience building web applications using "
                    "Django, Django REST Framework, and JavaScript. Completed practical backend "
                    "training focused on REST API development, authentication, and database design "
                    "with PostgreSQL and SQLite. Skilled in Python, C++, and object-oriented "
                    "programming, with a growing portfolio of full-stack projects covering "
                    "e-commerce, restaurant management, and weather applications. Seeking a Full "
                    "Stack Developer role to apply strong fundamentals in web development, API "
                    "design, and collaborative, Git-based software engineering."
                ),
                short_intro=(
                    "Building modern, scalable web applications with Django, Django REST "
                    "Framework, and JavaScript."
                ),
                phone="+977 9864152762",
                github_url="https://github.com/luisnyaupane",
                linkedin_url="https://linkedin.com/in/luis-nyaupane-08168634a",
                location="Kathmandu, Nepal",
            ),
        )

    def seed_skills(self):
        skills = [
            # (name, category, order)
            ("Python", "languages", 1),
            ("JavaScript", "languages", 2),
            ("C++", "languages", 3),
            ("C", "languages", 4),
            ("HTML5", "frontend", 1),
            ("CSS3", "frontend", 2),
            ("JavaScript", "frontend", 3),
            ("Bootstrap", "frontend", 4),
            ("Django", "backend", 1),
            ("Django REST Framework", "backend", 2),
            ("REST API Development", "backend", 3),
            ("PostgreSQL", "database", 1),
            ("SQLite", "database", 2),
            ("Git", "tools", 1),
            ("GitHub", "tools", 2),
            ("VS Code", "tools", 3),
            ("Postman", "tools", 4),
            ("Object-Oriented Programming", "concepts", 1),
            ("Data Structures", "concepts", 2),
            ("CRUD Operations", "concepts", 3),
            ("Authentication", "concepts", 4),
            ("MVC Architecture", "concepts", 5),
            ("JSON", "concepts", 6),
        ]
        for name, category, order in skills:
            Skill.objects.update_or_create(
                name=name, category=category,
                defaults=dict(proficiency=80, order=order),
            )

    def seed_projects(self):
        projects = [
            dict(
                title="E-commerce Website",
                description=(
                    "Developed a full-stack e-commerce platform using Django, implementing product "
                    "catalog, shopping cart, and order management through complete CRUD operations. "
                    "Designed a relational database schema in PostgreSQL to manage products, orders, "
                    "and user accounts. Built a responsive frontend with HTML, CSS, Bootstrap, and "
                    "JavaScript for a consistent cross-device shopping experience."
                ),
                technologies="Django, PostgreSQL, HTML, CSS, Bootstrap, JavaScript",
                featured=True,
            ),
            dict(
                title="Restaurant Management System",
                description=(
                    "Built a restaurant management web application in Django to handle menu, order, "
                    "and booking data via CRUD functionality. Structured the application using MVC "
                    "architecture to keep business logic, data, and templates maintainable."
                ),
                technologies="Django, SQLite, HTML, CSS, Bootstrap, JavaScript",
                featured=True,
            ),
            dict(
                title="Weather App",
                description=(
                    "Developed a weather application that integrates an external REST API to fetch "
                    "and display real-time weather data. Implemented a responsive UI with Bootstrap "
                    "and JavaScript to render dynamic, location-based data."
                ),
                technologies="Django, REST API, HTML, CSS, Bootstrap, JavaScript",
                featured=False,
            ),
            dict(
                title="Authentication System",
                description=(
                    "Designed and implemented a user authentication system in C++, applying OOP "
                    "principles to structure secure login and registration logic."
                ),
                technologies="C++, Object-Oriented Programming",
                featured=False,
            ),
        ]
        for p in projects:
            Project.objects.update_or_create(title=p["title"], defaults=p)

    def seed_experience(self):
        Experience.objects.update_or_create(
            company="Django Training Program",
            position="Django Developer Trainee",
            defaults=dict(
                description=(
                    "Completed practical Django training, building backend web applications through "
                    "hands-on, project-based learning.\n"
                    "Developed REST APIs using Django REST Framework to support CRUD operations and "
                    "structured data exchange.\n"
                    "Used Git and GitHub for version control while collaborating in a team-based "
                    "development workflow.\n"
                    "Gained exposure to collaborative software development practices in a real-world "
                    "training environment."
                ),
                start_date=date(2024, 1, 1),
                currently_working=True,
                technologies="Python, Django, Django REST Framework, PostgreSQL, SQLite, Git, GitHub, REST API",
                order=1,
            ),
        )

    def seed_education(self):
        Education.objects.update_or_create(
            institution="Ambition College, Kathmandu",
            degree="BSc CSIT",
            defaults=dict(
                field="Computer Science and Information Technology",
                start_year=2023,
                end_year="Present",
                order=1,
            ),
        )
