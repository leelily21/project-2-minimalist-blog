from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# --- Конфигурация приложения ---
app = FastAPI()

# --- Настройка CORS ---
origins = [
    "http://localhost:3000",
    "http://localhost",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic модели (структура данных) ---
class Post(BaseModel):
    slug: str
    title: str
    content: str
    author: str
    date: str
    category: str

# --- База данных в памяти (простой список Python) ---
fake_posts_db: List[Post] = [
    Post(
        slug="first-post",
        title="Мой первый пост",
        content="Это содержимое моего первого поста. Здесь много интересного текста о веб-разработке!",
        author="Rauli",
        date="2.07.2025",
        category='first'
    ),
    Post(
        slug="fastapi-and-nextjs",
        title="FastAPI + Next.js = ❤️",
        content="Сочетание FastAPI для бэкенда и Next.js для фронтенда - это мощный и современный стек. Асинхронность FastAPI и рендеринг Next.js творят чудеса.",
        author="Rauli",
        date="2.07.2025",
        category='second'
    ),

    Post(
        slug="why-i-love-python",
        title="Почему я люблю Python",
        content="Python - это язык с простым синтаксисом и огромной экосистемой. Он отлично подходит для бэкенда, анализа данных и многого другого.",
        author="Rauli",
        date="2.07.2025",
        category='third'
    )
]

# --- Эндпоинты API ---

# Отдает краткий список всех постов (slug и title)
@app.get("/api/posts", response_model=List[Post])
async def get_all_posts():
    return fake_posts_db

# Отдает полную информацию о конкретном посте по его slug
@app.get("/api/posts/{slug}", response_model=Post)
async def get_post_by_slug(slug: str):
    for post in fake_posts_db:
        if post.slug == slug:
            return post
    raise HTTPException(status_code=404, detail="Post not found")

@app.get("/")
async def root():
    return {"message": "Blog API is running"}