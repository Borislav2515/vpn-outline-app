# R14-VPN Telegram Bot

Telegram бот для сервиса продажи ключей Outline VPN.

## Функции

- 🚀 Открытие мини-приложения
- 💳 Управление кошельком
- 🔑 Просмотр ключей
- 📊 Статистика
- ❓ Поддержка

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте конфигурацию в `config.js`:
```javascript
module.exports = {
  BOT_TOKEN: 'ваш_токен_бота',
  WEBAPP_URL: 'https://ваш-домен.onrender.com',
  SUPPORT_EMAIL: 'support@r14-vpn.com',
  SUPPORT_TELEGRAM: '@r14_support'
};
```

3. Запустите бота:
```bash
npm start
```

## Разработка

Для разработки с автоматической перезагрузкой:
```bash
npm run dev
```

## Деплой на Render

1. Создайте новый Web Service в Render
2. Подключите репозиторий
3. Настройте:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

## Структура проекта

```
bot/
├── bot.js          # Основной файл бота
├── config.js       # Конфигурация
├── package.json    # Зависимости
└── README.md       # Документация
```

## Команды бота

- `/start` - Главное меню с кнопками
- Все остальные действия через inline кнопки 