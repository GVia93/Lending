# ================================
# STAGE 1: Build Frontend
# ================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Копируем package.json и yarn.lock
COPY frontend/package.json frontend/yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем исходники
COPY frontend/ ./

# Собираем production build
RUN yarn build

# ================================
# STAGE 2: Backend
# ================================
FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копируем backend requirements
COPY backend/requirements.txt ./backend/

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir -r backend/requirements.txt

# Копируем backend код
COPY backend/ ./backend/

# Копируем собранный frontend из первого stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Создаём непривилегированного пользователя
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

# Открываем порт
EXPOSE 8001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8001/api/ || exit 1

# Запуск приложения
CMD ["uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8001"]
