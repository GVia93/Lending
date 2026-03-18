# 📊 Интеграция Google Analytics 4 и Яндекс.Метрики

Полная инструкция по настройке и использованию аналитики в проекте М-СТРОЙ.

---

## ✅ Что установлено

### 1. **Google Analytics 4 (GA4)**
- Библиотека: `react-ga4` v2.1.0
- Отслеживание: просмотры страниц, события, конверсии
- Автоматическая инициализация при загрузке приложения

### 2. **Яндекс.Метрика**
- Прямая интеграция через скрипт в `index.html`
- Отслеживание: просмотры страниц, цели, вебвизор, карты кликов
- Автоматическая инициализация при загрузке страницы

---

## 🔧 Настройка (для разработчика)

### Шаг 1: Получение ID счетчиков

#### Google Analytics 4:
1. Перейдите на https://analytics.google.com/
2. Создайте аккаунт и ресурс (если нет)
3. Admin → Data Streams → Web
4. Скопируйте **Measurement ID** (формат: `G-XXXXXXXXXX`)

#### Яндекс.Метрика:
1. Перейдите на https://metrika.yandex.ru/
2. Нажмите "Добавить счётчик"
3. Укажите URL сайта: `https://m-stroy.ru`
4. Скопируйте **Номер счётчика** (формат: `12345678`)

---

### Шаг 2: Настройка .env файла

Откройте `/app/frontend/.env` и замените значения:

```env
# Backend URL (не изменяйте)
REACT_APP_BACKEND_URL=http://localhost:8001

# Google Analytics 4 Measurement ID
REACT_APP_GA4_MEASUREMENT_ID=G-YOUR_ACTUAL_ID

# Яндекс.Метрика Counter ID
REACT_APP_YANDEX_METRIKA_ID=YOUR_ACTUAL_ID
```

**Важно:** Не добавляйте `.env` в Git! Используйте `.env.example` для шаблона.

---

### Шаг 3: Перезапуск приложения

```bash
# Остановить frontend
sudo supervisorctl stop frontend

# Перезапустить
sudo supervisorctl start frontend

# Проверить статус
sudo supervisorctl status frontend
```

---

## 📈 Отслеживаемые события

### 1. **Автоматические события**

#### Page Views (просмотры страниц)
- Отслеживаются автоматически при переходе между страницами
- GA4: `page_view`
- YM: `hit`

**Страницы:**
- `/` - Главная
- `/services/hangars` - Строительство ангаров
- `/services/grain-storage` - Зернохранилища
- `/services/garages` - Промышленные гаражи
- `/services/demolition` - Демонтаж сооружений

---

### 2. **События калькулятора**

#### `calculator_start`
**Когда:** Пользователь выбрал тип услуги (шаг 1)

**Параметры:**
```javascript
{
  event_category: 'engagement',
  service: 'hangars' // hangars, grain-storage, garages, demolition
}
```

---

#### `calculator_step`
**Когда:** Переход между шагами калькулятора

**Параметры:**
```javascript
{
  event_category: 'engagement',
  step_number: 2, // 0, 1, 2, 3
  service: 'hangars',
  area: 500, // опционально
  height: 8  // опционально
}
```

---

#### `calculator_complete`
**Когда:** Пользователь перешёл к результату (шаг 4)

**Параметры:**
```javascript
{
  event_category: 'engagement',
  service: 'hangars',
  area: 500,
  height: 8,
  total_price: 6222500,
  currency: 'RUB'
}
```

---

#### `calculator_lead_submit`
**Когда:** Отправка формы из калькулятора (шаг 4)

**Параметры:**
```javascript
{
  event_category: 'conversion',
  service: 'hangars',
  total_price: 6222500,
  currency: 'RUB',
  value: 6222500 // для отслеживания ценности лида
}
```

---

### 3. **События форм**

#### `contact_form_submit`
**Когда:** Отправка контактной формы

**Параметры:**
```javascript
{
  event_category: 'conversion',
  service_type: 'Строительство ангаров'
}
```

---

### 4. **События взаимодействия**

#### `phone_click`
**Когда:** Клик на номер телефона

**Параметры:**
```javascript
{
  event_category: 'lead',
  click_location: 'header' // header, contact_section, hero, service_page
}
```

---

#### `cta_click`
**Когда:** Клик на CTA кнопку

**Параметры:**
```javascript
{
  event_category: 'engagement',
  cta_name: 'calculator_header',
  click_location: 'header'
}
```

---

#### `service_card_click`
**Когда:** Клик на карточку услуги

**Параметры:**
```javascript
{
  event_category: 'engagement',
  service_slug: 'hangars',
  service_name: 'Строительство ангаров'
}
```

---

#### `portfolio_view`
**Когда:** Открытие детального просмотра проекта

**Параметры:**
```javascript
{
  event_category: 'engagement',
  project_id: 'p-1',
  project_title: 'Ангар для хранения техники'
}
```

---

#### `portfolio_filter`
**Когда:** Использование фильтра портфолио

**Параметры:**
```javascript
{
  event_category: 'engagement',
  category: 'hangars' // all, hangars, grain-storage, garages, demolition
}
```

---

#### `faq_open`
**Когда:** Открытие вопроса в FAQ

**Параметры:**
```javascript
{
  event_category: 'engagement',
  question: 'Сколько времени занимает строительство ангара?'
}
```

---

## 🎯 Настройка целей

### Google Analytics 4

1. Перейдите в **Admin** → **Events**
2. Отметьте важные события как **Conversions**:
   - ✅ `calculator_lead_submit`
   - ✅ `contact_form_submit`
   - ✅ `phone_click`

### Яндекс.Метрика

1. Перейдите в **Настройки** → **Цели**
2. Создайте цели для событий:

**Цель 1: Заявка из калькулятора**
- Тип: JavaScript-событие
- Идентификатор: `calculator_lead_submit`

**Цель 2: Контактная форма**
- Тип: JavaScript-событие
- Идентификатор: `contact_form_submit`

**Цель 3: Клик на телефон**
- Тип: JavaScript-событие
- Идентификатор: `phone_click`

---

## 📊 Как проверить работу аналитики

### Метод 1: Консоль браузера (Dev Mode)

1. Откройте DevTools (F12)
2. Перейдите на вкладку **Console**
3. Выполните действие (клик, отправка формы)
4. Увидите логи:
   ```
   ✅ Google Analytics 4 initialized: G-XXXXXXXXXX
   📊 GA4 Event: calculator_start {event_category: 'engagement', service: 'hangars'}
   📊 YM Event: calculator_start {event_category: 'engagement', service: 'hangars'}
   ```

---

### Метод 2: GA4 DebugView

1. Установите расширение [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/)
2. Включите расширение
3. Откройте сайт
4. В GA4: **Admin** → **DebugView**
5. Видите события в реальном времени

---

### Метод 3: Яндекс.Метрика Realtime

1. Откройте [metrika.yandex.ru](https://metrika.yandex.ru/)
2. Выберите счётчик
3. **Отчёты** → **Стандартные отчёты** → **В реальном времени**
4. Выполните действия на сайте
5. События появятся в течение 10-30 секунд

---

## 🛠️ Разработка: Добавление новых событий

### Пример 1: Отслеживание скачивания PDF

```javascript
import useAnalytics from '../hooks/useAnalytics';

function MyComponent() {
  const { trackFileDownload } = useAnalytics();

  const handleDownload = () => {
    trackFileDownload('Brochure_M-Stroy.pdf', 'pdf');
    // ... код скачивания
  };

  return <button onClick={handleDownload}>Скачать брошюру</button>;
}
```

---

### Пример 2: Кастомное событие

```javascript
import { trackAnalyticsEvent } from '../components/Analytics';

// Где-то в компоненте
trackAnalyticsEvent('custom_event_name', {
  event_category: 'category',
  custom_param1: 'value1',
  custom_param2: 123
});
```

---

## 📈 Рекомендуемые отчёты

### Google Analytics 4

1. **Conversions** - конверсии по целям
2. **Engagement → Events** - все события
3. **Acquisition → Traffic acquisition** - источники трафика
4. **User attributes** - демография

### Яндекс.Метрика

1. **Отчёты → Стандартные отчёты → Конверсии**
2. **Отчёты → Вебвизор** - записи сессий
3. **Отчёты → Карта кликов** - тепловые карты
4. **Отчёты → Карта скроллинга** - как скроллят страницу

---

## 🚨 Troubleshooting

### События не отправляются

1. **Проверьте .env файл:**
   ```bash
   cat /app/frontend/.env
   ```
   Убедитесь, что ID не содержат `%` или `XXXXXXXXXX`

2. **Проверьте консоль:**
   Должны быть логи инициализации:
   ```
   ✅ Google Analytics 4 initialized: G-XXXXXXXXXX
   ✅ Яндекс.Метрика initialized: 12345678
   ```

3. **Проверьте Network:**
   - GA4: запросы на `https://www.google-analytics.com/g/collect`
   - YM: запросы на `https://mc.yandex.ru/watch/`

4. **Перезапустите frontend:**
   ```bash
   sudo supervisorctl restart frontend
   ```

---

### Блокировка AdBlock

- AdBlock может блокировать скрипты аналитики
- Для разработки отключите AdBlock на localhost
- На продакшене ~10-20% пользователей имеют AdBlock

---

### Нет данных в отчётах

- **GA4**: данные появляются через 24-48 часов
- **YM**: данные в реальном времени (~10 минут задержка)
- Используйте DebugView (GA4) и Realtime (YM) для тестирования

---

## 📚 Дополнительные ресурсы

### Документация:
- [Google Analytics 4 Developer Guide](https://developers.google.com/analytics/devguides/collection/ga4)
- [Яндекс.Метрика API](https://yandex.ru/dev/metrika/)
- [react-ga4 Documentation](https://github.com/codler/react-ga4)

### Полезные инструменты:
- [GA4 Event Builder](https://ga-dev-tools.web.app/ga4/event-builder/)
- [Tag Assistant](https://tagassistant.google.com/)

---

**Автор:** E1 Agent  
**Дата:** 18 марта 2025  
**Версия:** 1.0
