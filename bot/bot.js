const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

// Токен вашего бота
const token = config.BOT_TOKEN;

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.first_name;
  
  const welcomeMessage = `Привет, ${username}! 👋

Добро пожаловать в R14-VPN! 

Здесь вы можете:
🔐 Купить ключи Outline VPN
💳 Управлять балансом
📊 Просматривать статистику
❓ Получить поддержку

Нажмите кнопку ниже, чтобы открыть приложение:`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Открыть приложение',
          web_app: {
            url: `${config.WEBAPP_URL}?user_id=${msg.from.id}&first_name=${encodeURIComponent(msg.from.first_name)}&last_name=${encodeURIComponent(msg.from.last_name || '')}&username=${encodeURIComponent(msg.from.username || '')}&is_bot=${msg.from.is_bot}&language_code=${encodeURIComponent(msg.from.language_code || '')}`
          }
        }
      ],
      [
        {
          text: '💳 Мой кошелек',
          callback_data: 'wallet'
        },
        {
          text: '🔑 Мои ключи',
          callback_data: 'keys'
        }
      ],
      [
        {
          text: '📊 Статистика',
          callback_data: 'stats'
        },
        {
          text: '❓ Поддержка',
          callback_data: 'support'
        }
      ]
    ]
  };

  await bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: keyboard,
    parse_mode: 'Markdown'
  });
});

// Обработчик callback запросов
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  switch (data) {
    case 'wallet':
      await bot.sendMessage(chatId, '💳 *Ваш кошелек*\n\nБаланс: 0 ₽\n\nДля пополнения перейдите в приложение.', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '💳 Пополнить баланс',
                                 web_app: {
                   url: `${config.WEBAPP_URL}/wallet`
                 }
              }
            ]
          ]
        }
      });
      break;

    case 'keys':
      await bot.sendMessage(chatId, '🔑 *Ваши ключи*\n\nУ вас пока нет активных ключей.\n\nКупите ключ в приложении!', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🛒 Купить ключ',
                                 web_app: {
                   url: config.WEBAPP_URL
                 }
               }
             ]
           ]
         }
       });
       break;

     case 'stats':
       await bot.sendMessage(chatId, '📊 *Статистика*\n\nИспользовано трафика: 0 ГБ\nАктивных ключей: 0\n\nПодробную статистику смотрите в приложении.', {
         parse_mode: 'Markdown',
         reply_markup: {
           inline_keyboard: [
             [
               {
                 text: '📊 Подробная статистика',
                 web_app: {
                   url: config.WEBAPP_URL
                 }
              }
            ]
          ]
        }
      });
      break;

    case 'support':
      await bot.sendMessage(chatId, '❓ *Поддержка*\n\nЕсли у вас есть вопросы:\n\n📧 Email: support@r14-vpn.com\n💬 Telegram: @r14_support\n\nИли используйте раздел FAQ в приложении.', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '❓ FAQ',
                                 web_app: {
                   url: `${config.WEBAPP_URL}/faq`
                 }
              }
            ]
          ]
        }
      });
      break;
  }

  // Отвечаем на callback query
  await bot.answerCallbackQuery(query.id);
});

// Обработчик ошибок
bot.on('error', (error) => {
  console.error('Ошибка бота:', error);
});

// Обработчик polling ошибок
bot.on('polling_error', (error) => {
  console.error('Ошибка polling:', error);
});

console.log('🤖 Telegram бот запущен!');
console.log('Токен:', token);

module.exports = bot; 