# Настройка Outline VPN сервера

## Шаг 1: Установка Outline Manager
1. Скачайте Outline Manager с официального сайта: https://getoutline.org/
2. Установите и запустите Outline Manager
3. Создайте новый сервер или подключитесь к существующему

## Шаг 2: Получение API данных
1. В Outline Manager выберите ваш сервер
2. Перейдите в раздел "API" или "Settings"
3. Скопируйте:
   - API URL (обычно https://your-server.com/api)
   - API Key (длинная строка символов)

## Шаг 3: Настройка приложения
1. Откройте файл `server/config.env`
2. Замените placeholder значения:
   ```
   OUTLINE_API_URL=https://your-server.com/api
   OUTLINE_API_KEY=your-actual-api-key
   ```
3. Сохраните файл

## Шаг 4: Запуск сервера
1. Перейдите в папку `server`
2. Запустите сервер: `npm start`
3. Проверьте, что сервер запустился без ошибок

## Шаг 5: Тестирование
1. Откройте веб-приложение
2. Попробуйте создать ключ
3. Проверьте, что ключ появился в Outline Manager

## Устранение неполадок

### Ошибка "Unauthorized (401)"
- Проверьте правильность API ключа
- Убедитесь, что API URL корректный
- Проверьте, что сервер Outline доступен

### Ошибка "Network Error"
- Проверьте подключение к интернету
- Убедитесь, что Outline сервер работает
- Проверьте настройки файрвола

### Кнопка "Создать ключ" не появляется
- Проверьте консоль браузера на ошибки
- Убедитесь, что сервер API запущен
- Проверьте логи сервера

## Проверка работоспособности

1. **Проверка API сервера:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Проверка создания ключа:**
   ```bash
   curl -X POST http://localhost:3001/api/outline/keys \
     -H "Content-Type: application/json" \
     -d '{"name": "test-key"}'
   ```

3. **Проверка логов:**
   - В консоли браузера (F12)
   - В терминале, где запущен сервер

## Структура API ключа

API ключ обычно выглядит так:
```
outline_api_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Примеры URL серверов

- `https://outline.yourdomain.com`
- `https://vpn.yourdomain.com`
- `https://yourdomain.com:8080` 