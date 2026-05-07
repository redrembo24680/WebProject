# Personal Note Manager 📝

**English** | [Українська](#українська)

A full-stack web application for managing personal notes with user authentication, email verification, and image uploads. Built with FastAPI, React, and PostgreSQL.

## 🎯 Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Email Verification** - Verification links sent via SMTP (Brevo)
- **Note Management** - Create, read, and delete personal notes
- **Image Uploads** - Attach images to notes with automatic validation
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Dark Theme** - Modern dark mode interface with animations and gradients
- **Production Ready** - Docker Compose configuration for easy deployment

## 🏗️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 16
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT tokens (24-hour expiry)
- **Password Hashing**: Argon2 (via passlib)
- **Email**: SMTP via Brevo
- **File Handling**: aiofiles for async uploads
- **Database Migrations**: Alembic

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT interceptors
- **Icons**: Lucide React
- **State Management**: React Context API + Custom Hooks

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (production)
- **Health Checks**: PostgreSQL and backend service monitoring

## 📋 Prerequisites

- Docker & Docker Compose (v1.29+)
- Node.js 18+ (for local development)
- Python 3.11+ (for local backend development)
- Git

## 🚀 Quick Start

### Option 1: Production Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/personal-note-manager.git
cd personal-note-manager

# Create production environment file
cp .env.example .env

# Edit .env with your configuration
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
# JWT_SECRET=your-secure-random-secret
# SMTP credentials from your email provider

# Start all services (PostgreSQL, Backend, Frontend, Nginx)
docker-compose -f docker-compose.prod.yml up -d --build

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

The application will be available at `http://localhost` (port 80)

### Option 2: Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/personal-note-manager.git
cd personal-note-manager

# Start backend services
docker-compose up -d

# Run database migrations
docker-compose exec backend alembic upgrade head

# Install and start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5174
- Database Admin: http://localhost:8080 (Adminer)
- API Docs: http://localhost:8000/docs (Swagger)

## 📁 Project Structure

```
personal-note-manager/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py              # Authentication endpoints
│   │   │   │   └── notes.py             # Notes CRUD endpoints
│   │   │   └── router.py
│   │   ├── models/
│   │   │   ├── user.py                  # User ORM model
│   │   │   └── note.py                  # Note ORM model
│   │   ├── schemas/
│   │   │   ├── user.py                  # User Pydantic schemas
│   │   │   └── note.py                  # Note Pydantic schemas
│   │   ├── services/
│   │   │   ├── mail_service.py          # Email sending via Brevo SMTP
│   │   │   ├── file_service.py          # File upload validation
│   │   │   └── note_service.py          # Note business logic
│   │   ├── core/
│   │   │   ├── config.py                # Environment configuration
│   │   │   └── security.py              # JWT & password hashing
│   │   ├── main.py                      # FastAPI app initialization
│   │   └── database.py                  # Database session management
│   ├── migrations/                      # Alembic database migrations
│   ├── static/
│   │   └── uploads/                     # User uploaded images
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.ts                # Axios HTTP client
│   │   ├── services/authService.ts      # API service methods
│   │   ├── context/AuthContext.tsx      # Auth state management
│   │   ├── hooks/useNotes.ts            # Notes CRUD hook
│   │   ├── components/
│   │   │   ├── NoteCard.tsx             # Note display component
│   │   │   ├── NoteForm.tsx             # Create note modal
│   │   │   └── ProtectedRoute.tsx       # Route protection
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── VerifyPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── App.tsx                      # Main router
│   │   └── main.tsx                     # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml                   # Development configuration
├── docker-compose.prod.yml              # Production configuration
├── nginx.conf                           # Nginx reverse proxy config
├── .env                                 # Environment variables
├── .env.example                         # Environment template
└── README.md
```

## ⚙️ Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql+psycopg://user:password@db:5432/personal_note_manager

# JWT
JWT_SECRET=your-super-secret-key-change-this

# Email (Brevo SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_USER=your-brevo-email@example.com
SMTP_PASSWORD=your-brevo-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:5174,http://localhost:3000

# PostgreSQL
POSTGRES_DB=personal_note_manager
POSTGRES_USER=personal_note_user
POSTGRES_PASSWORD=your-secure-password
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🔐 Security Features

- **JWT Authentication** - 24-hour expiring tokens
- **Password Hashing** - Argon2 with passlib (no 72-byte limit)
- **Email Verification** - Token-based account activation
- **CORS Protection** - Configurable allowed origins
- **File Validation** - MIME type and size restrictions
- **SQL Injection Protection** - SQLAlchemy parameterized queries
- **XSS Protection** - Content Security Headers via Nginx

## 📧 Email Configuration

### Using Brevo (Recommended)

1. Sign up at [brevo.com](https://www.brevo.com)
2. Get SMTP credentials from Settings → SMTP & API
3. Update `.env` with:
   ```env
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-brevo-api-key
   ```

### Using Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "Add new column"

# Stop services
docker-compose down

# Remove volumes (warning: deletes data)
docker-compose down -v
```

## 🧪 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/verify?token=...` - Verify email and activate account

### Notes
- `GET /api/v1/notes` - Get all user's notes
- `POST /api/v1/notes` - Create new note with optional image
- `DELETE /api/v1/notes/{note_id}` - Delete a note

### Health
- `GET /api/v1/health` - Service health check

### Documentation
- `GET /docs` - Interactive Swagger UI (development only)

## 📝 Example API Usage

### Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePass123"
```

### Create Note with Image
```bash
curl -X POST http://localhost:8000/api/v1/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=My Note" \
  -F "content=Note content" \
  -F "file=@image.jpg"
```

## 🚢 Production Deployment

### Using docker-compose.prod.yml

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### SSL/HTTPS Setup

1. Uncomment SSL section in `nginx.conf`
2. Use Let's Encrypt for free SSL certificates:
   ```bash
   docker run -it --rm -v /etc/letsencrypt:/etc/letsencrypt \
     certbot/certbot certonly --standalone \
     -d yourdomain.com -d www.yourdomain.com
   ```
3. Update `.env` with your domain in `ALLOWED_ORIGINS`

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs db
```

### Backend won't start
```bash
# Check for port conflicts (8000 should be free)
lsof -i :8000

# Check backend logs
docker-compose logs backend
```

### Frontend shows blank page
```bash
# Clear browser cache
# Check browser console for errors (F12)
# Verify VITE_API_URL is correct in .env.local
```

### Email not sending
1. Verify SMTP credentials in `.env`
2. Check email in spam folder
3. Review backend logs: `docker-compose logs backend`
4. Ensure firewall allows port 587 (SMTP)

## 📚 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

## 👨‍💻 Author

Built with ❤️ for managing your notes efficiently.

---

<a name="українська"></a>

# Менеджер Особистих Нотаток 📝

Повнофункціональний веб-додаток для управління особистими нотатками з аутентифікацією користувачів, перевіркою електронної пошти та завантаженням зображень. Розроблено на FastAPI, React та PostgreSQL.

## 🎯 Можливості

- **Аутентифікація користувачів** - Безпечна реєстрація та вхід з JWT токенами
- **Перевірка електронної пошти** - Верифікаційні посилання через SMTP (Brevo)
- **Управління нотатками** - Створення, перегляд та видалення нотаток
- **Завантаження зображень** - Додавання зображень до нотаток з автоматичною валідацією
- **Адаптивний дизайн** - Мобільно-дружелюбний інтерфейс з Tailwind CSS
- **Темна тема** - Сучасний темний режим з анімаціями та градієнтами
- **Готово до продакшену** - Docker Compose конфіг для легкого розгортання

## 🏗️ Технологічний стек

### Бекенд
- **Framework**: FastAPI (Python 3.11+)
- **База даних**: PostgreSQL 16
- **ORM**: SQLAlchemy 2.0+
- **Аутентифікація**: JWT токени (24-годинний термін дії)
- **Хешування паролів**: Argon2 (через passlib)
- **Email**: SMTP через Brevo
- **Обробка файлів**: aiofiles для асинхронного завантаження
- **Міграції БД**: Alembic

### Фронтенд
- **Framework**: React 18 з TypeScript
- **Build Tool**: Vite
- **Стилізація**: Tailwind CSS
- **Маршрутизація**: React Router v6
- **HTTP клієнт**: Axios з JWT перехоплювачами
- **Іконки**: Lucide React
- **Управління станом**: React Context API + Custom Hooks

### DevOps
- **Контейнеризація**: Docker & Docker Compose
- **Веб-сервер**: Nginx (продакшен)
- **Health Checks**: Моніторинг PostgreSQL та бекенду

## 📋 Вимоги

- Docker & Docker Compose (v1.29+)
- Node.js 18+ (для локальної розробки)
- Python 3.11+ (для локальної розробки бекенду)
- Git

## 🚀 Швидкий старт

### Варіант 1: Розгортання на продакшені (Рекомендується)

```bash
# Клонувати репозиторій
git clone https://github.com/yourusername/personal-note-manager.git
cd personal-note-manager

# Створити файл оточення для продакшену
cp .env.example .env

# Відредагувати .env з вашою конфігурацією
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
# JWT_SECRET=your-secure-random-secret
# SMTP credentials від вашого email провайдера

# Запустити всі сервіси
docker-compose -f docker-compose.prod.yml up -d --build

# Запустити міграції БД
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

Додаток буде доступний за адресою `http://localhost` (порт 80)

### Варіант 2: Локальна розробка

```bash
# Клонувати репозиторій
git clone https://github.com/yourusername/personal-note-manager.git
cd personal-note-manager

# Запустити сервіси бекенду
docker-compose up -d

# Запустити міграції БД
docker-compose exec backend alembic upgrade head

# Встановити та запустити фронтенд (в іншому терміналі)
cd frontend
npm install
npm run dev
```

- Бекенд: http://localhost:8000
- Фронтенд: http://localhost:5174
- Admin БД: http://localhost:8080 (Adminer)
- API Документація: http://localhost:8000/docs (Swagger)

## 📁 Структура проєкту

```
personal-note-manager/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py              # Endpoints аутентифікації
│   │   │   │   └── notes.py             # CRUD endpoints нотаток
│   │   │   └── router.py
│   │   ├── models/
│   │   │   ├── user.py                  # ORM модель користувача
│   │   │   └── note.py                  # ORM модель нотатки
│   │   ├── schemas/
│   │   │   ├── user.py                  # Pydantic схеми користувача
│   │   │   └── note.py                  # Pydantic схеми нотатки
│   │   ├── services/
│   │   │   ├── mail_service.py          # Відправка email через Brevo SMTP
│   │   │   ├── file_service.py          # Валідація завантажень
│   │   │   └── note_service.py          # Бізнес-логіка нотаток
│   │   ├── core/
│   │   │   ├── config.py                # Конфігурація оточення
│   │   │   └── security.py              # JWT & хешування паролів
│   │   ├── main.py                      # Ініціалізація FastAPI
│   │   └── database.py                  # Управління сесіями БД
│   ├── migrations/                      # Міграції Alembic
│   ├── static/
│   │   └── uploads/                     # Завантажені користувачами зображення
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.ts                # Axios HTTP клієнт
│   │   ├── services/authService.ts      # API методи
│   │   ├── context/AuthContext.tsx      # Управління станом авторизації
│   │   ├── hooks/useNotes.ts            # Hook для CRUD нотаток
│   │   ├── components/
│   │   │   ├── NoteCard.tsx             # Компонент відображення нотатки
│   │   │   ├── NoteForm.tsx             # Модальне вікно створення нотатки
│   │   │   └── ProtectedRoute.tsx       # Захист маршрутів
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── VerifyPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── App.tsx                      # Головний маршрутизатор
│   │   └── main.tsx                     # Точка входу
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml                   # Конфіг для розробки
├── docker-compose.prod.yml              # Конфіг для продакшену
├── nginx.conf                           # Конфіг Nginx reverse proxy
├── .env                                 # Змінні оточення
└── README.md
```

## ⚙️ Змінні оточення

### Бекенд (.env)

```env
# База даних
DATABASE_URL=postgresql+psycopg://user:password@db:5432/personal_note_manager

# JWT
JWT_SECRET=your-super-secret-key-change-this

# Email (Brevo SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_USER=your-brevo-email@example.com
SMTP_PASSWORD=your-brevo-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:5174,http://localhost:3000

# PostgreSQL
POSTGRES_DB=personal_note_manager
POSTGRES_USER=personal_note_user
POSTGRES_PASSWORD=your-secure-password
```

### Фронтенд (.env.local)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🔐 Функції безпеки

- **JWT Аутентифікація** - Токени з терміном дії 24 години
- **Хешування паролів** - Argon2 з passlib (без обмеження на 72 байти)
- **Перевірка email** - Активація акаунту через токени
- **CORS захист** - Конфігуровані дозволені домени
- **Валідація файлів** - Перевірка типу та розміру файлів
- **SQL Injection захист** - Параметризовані запити SQLAlchemy
- **XSS захист** - Content Security Headers через Nginx

## 📧 Конфігурація Email

### Використання Brevo (Рекомендується)

1. Зареєструватися на [brevo.com](https://www.brevo.com)
2. Отримати SMTP credentials з Settings → SMTP & API
3. Оновити `.env`:
   ```env
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-brevo-api-key
   ```

### Використання Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

## 🐳 Docker Команди

```bash
# Запустити сервіси
docker-compose up -d

# Переглянути логи
docker-compose logs -f backend

# Запустити міграції
docker-compose exec backend alembic upgrade head

# Створити нову міграцію
docker-compose exec backend alembic revision --autogenerate -m "Add new column"

# Зупинити сервіси
docker-compose down

# Видалити volumes (попередження: видаляє дані)
docker-compose down -v
```

## 🧪 API Endpoints

### Аутентифікація
- `POST /api/v1/auth/register` - Створити новий акаунт
- `POST /api/v1/auth/login` - Вхід та отримання JWT токену
- `GET /api/v1/auth/verify?token=...` - Перевірити email та активувати акаунт

### Нотатки
- `GET /api/v1/notes` - Отримати всі нотатки користувача
- `POST /api/v1/notes` - Створити нову нотатку з опціональним зображенням
- `DELETE /api/v1/notes/{note_id}` - Видалити нотатку

### Здоров'я
- `GET /api/v1/health` - Перевірка стану сервісу

### Документація
- `GET /docs` - Interactive Swagger UI (тільки для розробки)

## 🚢 Розгортання на продакшені

### Використання docker-compose.prod.yml

```bash
# Побудувати та запустити всі сервіси
docker-compose -f docker-compose.prod.yml up -d --build

# Запустити міграції БД
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Переглянути логи
docker-compose -f docker-compose.prod.yml logs -f
```

### Налаштування SSL/HTTPS

1. Розкомментувати SSL секцію в `nginx.conf`
2. Використати Let's Encrypt для безкоштовних SSL сертифікатів:
   ```bash
   docker run -it --rm -v /etc/letsencrypt:/etc/letsencrypt \
     certbot/certbot certonly --standalone \
     -d yourdomain.com -d www.yourdomain.com
   ```
3. Оновити `.env` з вашим доменом в `ALLOWED_ORIGINS`

## 🐛 Розв'язання проблем

### Помилка підключення до БД
```bash
# Перевірити, чи запущена PostgreSQL
docker-compose ps

# Переглянути логи БД
docker-compose logs db
```

### Бекенд не запускається
```bash
# Перевірити конфлікти портів (8000 повинен бути вільним)
lsof -i :8000

# Переглянути логи бекенду
docker-compose logs backend
```

### Фронтенд показує пусту сторінку
```bash
# Очистити кеш браузера
# Перевірити консоль браузера на помилки (F12)
# Переконатися, що VITE_API_URL правильний в .env.local
```

### Email не надсилається
1. Перевірити SMTP credentials в `.env`
2. Перевірити папку Spam
3. Переглянути логи бекенду: `docker-compose logs backend`
4. Переконатися, що firewall дозволяє порт 587 (SMTP)

## 📚 Ресурси для навчання

- [FastAPI Документація](https://fastapi.tiangolo.com/)
- [React Документація](https://react.dev/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 📄 Ліцензія

MIT License - вільно використовуйте цей проєкт для особистих та комерційних цілей.

## 👨‍💻 Автор

Розроблено з ❤️ для ефективного управління вашими нотатками.
