# Настройка Outline сервера

## Шаг 1: Получение URL и API ключа

1. **Войдите в панель управления Outline Manager**
2. **Найдите ваш сервер** с ID: `e5d439f5-a184-4ef6-8fc8-d4e8dea63d0c`
3. **Скопируйте URL сервера** (например: `https://outline.yourdomain.com`)
4. **Скопируйте API ключ** из настроек сервера

## Шаг 2: Настройка конфигурации

Отредактируйте файл `server/config.env`:

```env
# Outline API Configuration
OUTLINE_API_URL=https://ваш-реальный-url.com/api
OUTLINE_API_KEY=ваш-реальный-api-ключ

# Server Configuration
PORT=3001
```

## Шаг 3: Перезапуск сервера

```bash
cd server
npm start
```

## Проверка подключения

После настройки проверьте:

1. **Health check**: http://localhost:3001/api/health
2. **Информация о сервере**: http://localhost:3001/api/outline/server/e5d439f5-a184-4ef6-8fc8-d4e8dea63d0c
3. **Список ключей**: http://localhost:3001/api/outline/server/e5d439f5-a184-4ef6-8fc8-d4e8dea63d0c/keys

## Временное решение

Если Outline сервер недоступен, приложение будет показывать тестовые данные для демонстрации функциональности.

## Структура API ключа

API ключ обычно выглядит так:
```
outline_api_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Примеры URL серверов

- `https://outline.yourdomain.com`
- `https://vpn.yourdomain.com`
- `https://yourdomain.com:8080` 