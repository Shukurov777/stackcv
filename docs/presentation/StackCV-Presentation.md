---
marp: true
theme: default
paginate: true
backgroundColor: #0a0a0a
color: #fafafa
style: |
  section { font-family: 'Segoe UI', sans-serif; }
  h1 { color: #10b981; }
  h2 { color: #34d399; }
  a { color: #6ee7b7; }
  strong { color: #10b981; }
---

# StackCV
## AI-платформа для создания резюме по HR-стандартам

**Практическая работа**

🌐 https://stackcv.bakha.me  
📁 https://github.com/Shukurov777/stackcv

---

## Задача

Создать **full-stack веб-приложение**, которое помогает пользователю:

- составить профессиональное резюме по HR-нормам
- улучшить текст с помощью **ИИ**
- оформить документ (шаблон, фото, шрифт, цвет)
- скачать **PDF A4** и сохранить в личном кабинете

---

## Решение — StackCV

| Компонент | Описание |
|-----------|----------|
| Landing | Презентация продукта, шаблоны, отзывы |
| Конструктор | 6 шагов + live preview A4 |
| ИИ | Генерация текста и оценка резюме |
| Auth | Email + Google OAuth |
| Deploy | Production на VPS с SSL |

---

## Ключевой функционал

✅ **3 HR-шаблона** — Modern, Classic, Minimal  
✅ **Редактор оформления** — шрифт, цвет, фото, фильтры  
✅ **6 готовых примеров** — Frontend, PM, маркетинг и др.  
✅ **ИИ DeepSeek** — улучшение текста и scoring  
✅ **PDF A4** — скачивание в один клик  
✅ **Облако** — сохранение резюме после регистрации  

---

## Скриншоты

![width:900px](../screenshots/01-landing-hero.png)

---

## Конструктор резюме

![width:900px](../screenshots/02-builder.png)

- Галерея готовых примеров
- Панель дизайна (Canva-lite)
- Preview формата A4 в реальном времени

---

## Шаблоны и авторизация

![width:420px](../screenshots/04-templates.png) ![width:420px](../screenshots/03-login-google.png)

---

## Технологический стек

**Frontend:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion

**Backend:** Next.js API Routes · Prisma · SQLite · NextAuth.js

**AI:** DeepSeek API (OpenAI-compatible SDK)

**PDF:** html2canvas + jsPDF

**Deploy:** PM2 · Nginx · FastPanel · SSL

---

## Архитектура

```
Пользователь → Nginx (SSL) → Next.js (PM2, порт 3010)
                                    ↓
                    API: /generate, /score, /auth, /resumes
                                    ↓
                              SQLite (Prisma)
                                    ↓
                              DeepSeek API
```

---

## ИИ-интеграция

**Генерация:** переписывание «О себе» и bullet points с глаголами действия и метриками

**Оценка:** анализ разделов резюме, балл и рекомендации до отправки HR

---

## Деплой

- Домен: **stackcv.bakha.me**
- Node.js + PM2 (отдельный порт, не мешает PHP-сайтам)
- Nginx reverse proxy + SSL
- База SQLite на сервере

---

## Результат

| Метрика | Значение |
|---------|----------|
| Страниц | 8+ (landing, builder, auth, dashboard) |
| API routes | 6 |
| Шаблонов | 3 |
| Примеров | 6 профессий |
| Production | ✅ Работает онлайн |

---

## Спасибо за внимание!

**Live:** https://stackcv.bakha.me  
**GitHub:** https://github.com/Shukurov777/stackcv  
**README:** скриншоты, инструкция запуска, .env.example

**Вопросы?**
