
# М-СТРОЙ — Лендинг строительной компании

Промышленный лендинг для компании **М-СТРОЙ**, предоставляющей услуги по строительству ангаров, зернохранилищ, промышленных гаражей и демонтажу сооружений. Включает интерактивный многошаговый калькулятор стоимости с мгновенным пересчётом цены.

---

## Стек технологий

| Слой       | Технологии                                                       |
|------------|------------------------------------------------------------------|
| Frontend   | React 19, Tailwind CSS, Shadcn/UI, Framer Motion, Axios         |
| Backend    | Python, FastAPI, Pydantic, Motor (async MongoDB)                 |
| БД         | MongoDB                                                          |
| Шрифты     | Barlow Condensed (заголовки), Inter (текст), JetBrains Mono (цифры) |

---

## Структура проекта

```
/app
├── backend/
│   ├── server.py              # FastAPI-приложение (модели, эндпоинты, данные)
│   ├── requirements.txt       # Python-зависимости
│   └── .env                   # MONGO_URL, DB_NAME, CORS_ORIGINS
│
├── frontend/
│   ├── public/
│   │   └── index.html         # Точка входа HTML (подключение шрифтов)
│   ├── src/
│   │   ├── App.js             # Корневой компонент + Toaster
│   │   ├── App.css            # Кастомные анимации и стили
│   │   ├── index.css          # CSS-переменные темы, Tailwind, скроллбар
│   │   ├── pages/
│   │   │   └── LandingPage.jsx      # Главная страница (загрузка данных, компоновка секций)
│   │   └── components/
│   │       ├── Header.jsx            # Шапка с навигацией и CTA
│   │       ├── HeroSection.jsx       # Главный экран с фото, статистикой, кнопками
│   │       ├── ServicesSection.jsx    # Bento-сетка услуг (4 карточки)
│   │       ├── CalculatorSection.jsx  # Многошаговый калькулятор (4 шага)
│   │       ├── AdvantagesSection.jsx  # Преимущества компании (6 карточек)
│   │       ├── PortfolioSection.jsx   # Галерея проектов с фильтрами и Dialog
│   │       ├── TestimonialsSection.jsx# Карусель отзывов клиентов
│   │       ├── ContactSection.jsx     # Форма обратной связи + контакты
│   │       └── Footer.jsx            # Подвал сайта
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env                   # REACT_APP_BACKEND_URL
│
└── memory/
    └── PRD.md                 # Документация проекта
```

---

## Секции лендинга

### 1. Hero (Главный экран)
Полноэкранный блок с фоновым изображением стройплощадки, тёмным оверлеем, заголовком, двумя CTA-кнопками («Рассчитать стоимость», «Наши проекты») и статистикой компании (250+ объектов, 15 лет, 98% довольных клиентов).

### 2. Услуги (Bento Grid)
Асимметричная сетка из 4 карточек:
- **Строительство ангаров** (большая карточка, 2 колонки)
- **Зернохранилища**
- **Промышленные гаражи**
- **Демонтаж сооружений**

Каждая карточка содержит фотографию, иконку, название, описание и цену за м².

### 3. Калькулятор стоимости (4 шага)
Интерактивный визард с прогресс-баром:

| Шаг | Описание                               | Элементы управления                    |
|-----|----------------------------------------|----------------------------------------|
| 1   | Выбор типа сооружения                  | Карточки с иконками и ценами           |
| 2   | Площадь и высота                       | Slider + Input (50–10 000 м²), кнопки высоты |
| 3   | Дополнительные опции                   | Checkbox (утепление, ворота, вентиляция и др.) |
| 4   | Итоговый расчёт + форма заявки         | Разбивка стоимости + поля Имя/Телефон  |

Цена пересчитывается **в реальном времени** при изменении любого параметра.

### 4. Преимущества
6 карточек: Гарантия 5 лет, Точно в срок, Собственное проектирование, Поддержка 24/7, Сертифицированные материалы, Работаем по всей России.

### 5. Портфолио
Галерея из 6 выполненных проектов с фильтрами по категориям (Все / Ангары / Зернохранилища / Гаражи / Демонтаж). Клик на проект открывает Dialog с увеличенным изображением и подробностями.

### 6. Отзывы
Карусель (Embla Carousel) с карточками отзывов клиентов. Рейтинг звёздами, цитата, имя, должность и компания.

### 7. Контакты
Разделённая секция: слева — контактная информация (телефон, email, адрес), справа — форма заявки с полями «Имя», «Телефон» и Select-выпадающим списком «Тип услуги».

### 8. Footer
Логотип, описание компании, навигация, список услуг, контактные данные.

---

## API-эндпоинты

Все маршруты имеют префикс `/api`.

| Метод | Эндпоинт              | Описание                            | Тело запроса                                              |
|-------|------------------------|-------------------------------------|-----------------------------------------------------------|
| GET   | `/api/services`        | Список всех услуг (4 шт.)          | —                                                         |
| GET   | `/api/prices`          | Конфигурация цен для калькулятора   | —                                                         |
| GET   | `/api/prices/{slug}`   | Цены для конкретной услуги          | —                                                         |
| POST  | `/api/calculate`       | Расчёт стоимости                    | `{ service_slug, area, height, options[] }`               |
| POST  | `/api/contact`         | Отправка заявки (сохраняется в MongoDB) | `{ name, phone, service_type, message? }`             |
| GET   | `/api/portfolio`       | Список проектов портфолио (6 шт.)  | —                                                         |
| GET   | `/api/testimonials`    | Список отзывов клиентов (4 шт.)    | —                                                         |

### Пример расчёта

```bash
curl -X POST /api/calculate \
  -H \"Content-Type: application/json\" \
  -d '{
    \"service_slug\": \"hangars\",
    \"area\": 500,
    \"height\": 8,
    \"options\": [\"insulation\", \"gates\"]
  }'
```

Ответ:
```json
{
  \"base_cost\": 500000,
  \"area_cost\": 4250000,
  \"height_cost\": 637500,
  \"options_cost\": 835000,
  \"total\": 6222500,
  \"breakdown\": [
    { \"name\": \"Базовая стоимость\", \"value\": 500000 },
    { \"name\": \"Площадь (500 м²)\", \"value\": 4250000 },
    { \"name\": \"Высота (8 м, x1.15)\", \"value\": 637500 },
    { \"name\": \"Утепление\", \"value\": 750000 },
    { \"name\": \"Ворота (секционные)\", \"value\": 85000 }
  ]
}
```

---

## Формула расчёта

```
Итого = Базовая + (Площадь × Цена/м²) + Надбавка за высоту + Опции

Надбавка за высоту = (Площадь × Цена/м²) × (Множитель высоты − 1)
Опции «за м²» = Цена опции × Площадь
Опции «комплект/шт.» = Фиксированная цена
```

Множители высоты (пример для ангаров): 6м → ×1.0, 8м → ×1.15, 10м → ×1.3, 12м → ×1.5

---

## Переменные окружения

### Backend (`/app/backend/.env`)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
```

### Frontend (`/app/frontend/.env`)
```
REACT_APP_BACKEND_URL=https://your-domain.com
```

---

## Дизайн-система

### Цветовая палитра
| Название         | HEX       | Применение                         |
|------------------|-----------|------------------------------------|
| Industrial Blue  | `#0F172A` | Фоны секций, footer                |
| Safety Orange    | `#F97316` | CTA-кнопки, прогресс-бар, акценты |
| Background       | `#0A0A0A` | Основной фон                       |
| Surface          | `#171717` | Карточки, панели                   |
| Border           | `#262626` | Границы элементов                  |
| Text Primary     | `#FFFFFF` | Заголовки                          |
| Text Secondary   | `#A3A3A3` | Описания                           |

### Типографика
- **Заголовки**: Barlow Condensed, 600–800, uppercase, tracking-tight
- **Текст**: Inter, 300–500
- **Цифры/цены**: JetBrains Mono, 400–500

---

## Запуск

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

---

## 🚀 CI/CD и деплой

Проект настроен для автоматического деплоя через **GitHub Actions** с поддержкой **staging** и **production** окружений.

### 🌍 Окружения:

#### **Production (main)**
- **Триггер:** Push в `main` ветку
- **URL:** https://m-stroy.ru
- **Workflow:** `.github/workflows/deploy.yml`

#### **Staging (develop)**
- **Триггер:** Pull Request в `develop` ветку
- **URL:** https://staging.m-stroy.ru
- **Workflow:** `.github/workflows/deploy-staging.yml`
- **Автокомментарий:** Ссылка на staging в PR

---

### Quick Start для деплоя:

#### **1. Настройка Production**

**GitHub Secrets:**
- `SSH_HOST`, `SSH_USERNAME`, `SSH_PRIVATE_KEY`
- `DEPLOY_PATH`, `REACT_APP_BACKEND_URL`
- `GA4_MEASUREMENT_ID`, `YANDEX_METRIKA_ID`

**Автоматический деплой:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

#### **2. Настройка Staging**

**GitHub Secrets:**
- `STAGING_SSH_HOST`, `STAGING_SSH_USERNAME`, `STAGING_SSH_PRIVATE_KEY`
- `STAGING_DEPLOY_PATH`, `STAGING_BACKEND_URL`
- `STAGING_URL`

**Workflow с PR:**
```bash
# 1. Создать feature ветку
git checkout -b feature/my-feature

# 2. Сделать изменения и закоммитить
git add .
git commit -m "feat: add feature"
git push origin feature/my-feature

# 3. Создать PR в develop через GitHub
# → Автоматический деплой на staging
# → Комментарий в PR со ссылкой на staging

# 4. Протестировать на staging.m-stroy.ru

# 5. Мердж в develop → затем PR в main → production
```

---

### 📚 Документация:
- **[CICD_DOCUMENTATION.md](CICD_DOCUMENTATION.md)** - Production CI/CD
- **[STAGING_DOCUMENTATION.md](STAGING_DOCUMENTATION.md)** - Staging окружение
- **[SEO_DOCUMENTATION.md](SEO_DOCUMENTATION.md)** - SEO оптимизация
- **[ANALYTICS_DOCUMENTATION.md](ANALYTICS_DOCUMENTATION.md)** - Аналитика

### Workflows:
- `.github/workflows/deploy.yml` - Production (push в main)
- `.github/workflows/deploy-staging.yml` - Staging (PR в develop)
- `.github/workflows/test.yml` - Тесты для Pull Requests

---

## 📊 Аналитика

Проект интегрирован с:
- ✅ **Google Analytics 4** - отслеживание поведения пользователей
- ✅ **Яндекс.Метрика** - вебвизор, карты кликов

Отслеживаемые события: 15+ типов (калькулятор, формы, клики на телефон, просмотры страниц и т.д.)

---

## 🐳 Docker

Для запуска через Docker:

```bash
# Сборка и запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

---

## Лицензия

Проект является собственностью компании М-СТРОЙ.
