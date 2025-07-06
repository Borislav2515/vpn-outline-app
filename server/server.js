const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const path = require('path');

// Загружаем переменные окружения из config.env
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (в реальном проекте здесь была бы база данных)
const users = new Map();
const keys = new Map();
const transactions = new Map();

// Outline API конфигурация
const OUTLINE_SERVER_ID = 'e5d439f5-a184-4ef6-8fc8-d4e8dea63d0c';
const OUTLINE_API_URL = process.env.OUTLINE_API_URL;
const OUTLINE_API_KEY = process.env.OUTLINE_API_KEY;

// Проверяем наличие обязательных переменных окружения
if (!OUTLINE_API_URL || !OUTLINE_API_KEY) {
  console.error('❌ ОШИБКА: Не настроены переменные окружения!');
  console.error('OUTLINE_API_URL:', OUTLINE_API_URL);
  console.error('OUTLINE_API_KEY:', OUTLINE_API_KEY ? '***' : 'НЕ УКАЗАН');
  console.error('Проверьте файл server/config.env');
  process.exit(1);
}

console.log('✅ Outline API настроен:');
console.log('URL:', OUTLINE_API_URL);
console.log('Key:', OUTLINE_API_KEY.substring(0, 10) + '...');

// Функция для создания axios конфигурации с игнорированием SSL
const createAxiosConfig = (headers = {}) => ({
  headers: {
    'Api-Key': OUTLINE_API_KEY,
    ...headers
  },
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: false
  })
});

// Инициализация тестовых данных
const initializeTestData = () => {
  // Тестовый пользователь
  const testUserId = '123456789';
  users.set(testUserId, {
    id: testUserId,
    first_name: 'Тест',
    last_name: 'Пользователь',
    username: 'testuser',
    balance: 1000.00,
    joinDate: new Date().toISOString(),
    plan: 'Premium'
  });

  // Тестовые ключи
  const key1 = {
    id: uuidv4(),
    userId: testUserId,
    name: 'Ключ США (Нью-Йорк)',
    server: 'us-east.outline.com',
    key: 'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@us-east.outline.com:12345',
    status: 'active',
    trafficUsed: '15.2 ГБ',
    trafficLimit: '50 ГБ',
    expires: '2024-04-15',
    createdAt: '2024-03-01'
  };

  const key2 = {
    id: uuidv4(),
    userId: testUserId,
    name: 'Ключ Германия (Франкфурт)',
    server: 'de.outline.com',
    key: 'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@de.outline.com:12345',
    status: 'active',
    trafficUsed: '8.7 ГБ',
    trafficLimit: '50 ГБ',
    expires: '2024-04-20',
    createdAt: '2024-03-05'
  };

  keys.set(key1.id, key1);
  keys.set(key2.id, key2);

  // Тестовые транзакции
  const transaction1 = {
    id: uuidv4(),
    userId: testUserId,
    type: 'income',
    amount: 500.00,
    description: 'Пополнение счета',
    date: new Date().toISOString()
  };

  const transaction2 = {
    id: uuidv4(),
    userId: testUserId,
    type: 'expense',
    amount: -299.00,
    description: 'Покупка ключа США',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  };

  transactions.set(transaction1.id, transaction1);
  transactions.set(transaction2.id, transaction2);
};

// Инициализируем тестовые данные
initializeTestData();

// Routes

// Получение статистики пользователя
app.get('/api/user/:userId/stats', (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Получаем ключи пользователя
    const userKeys = Array.from(keys.values()).filter(key => key.userId === userId);
    
    const stats = {
      totalConnections: userKeys.length * 25, // Примерная статистика
      totalData: userKeys.reduce((sum, key) => {
        const used = parseFloat(key.trafficUsed);
        return sum + (isNaN(used) ? 0 : used);
      }, 0) + ' ГБ',
      favoriteServer: userKeys.length > 0 ? userKeys[0].name.split(' ')[1] : 'Нет данных',
      lastConnection: userKeys.length > 0 ? '2 часа назад' : 'Нет подключений'
    };

    res.json(stats);
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение трафика пользователя
app.get('/api/user/:userId/traffic', (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const userKeys = Array.from(keys.values()).filter(key => key.userId === userId);
    const totalUsed = userKeys.reduce((sum, key) => {
      const used = parseFloat(key.trafficUsed);
      return sum + (isNaN(used) ? 0 : used);
    }, 0);
    
    const totalLimit = userKeys.reduce((sum, key) => {
      const limit = parseFloat(key.trafficLimit);
      return sum + (isNaN(limit) ? 0 : limit);
    }, 0);

    const trafficStats = {
      totalUsed: totalUsed + ' ГБ',
      totalLimit: totalLimit + ' ГБ',
      remaining: Math.max(0, totalLimit - totalUsed) + ' ГБ',
      period: '30 дней',
      dailyAverage: (totalUsed / 30).toFixed(1) + ' ГБ',
      lastReset: '15 дней назад'
    };

    res.json(trafficStats);
  } catch (error) {
    console.error('Ошибка получения трафика:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение активных ключей
app.get('/api/user/:userId/keys', (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const userKeys = Array.from(keys.values()).filter(key => key.userId === userId);
    res.json(userKeys);
  } catch (error) {
    console.error('Ошибка получения ключей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение баланса
app.get('/api/user/:userId/balance', (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const balance = {
      amount: user.balance.toFixed(2),
      currency: '₽',
      status: 'Активен'
    };

    res.json(balance);
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение транзакций
app.get('/api/user/:userId/transactions', (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const userTransactions = Array.from(transactions.values()).filter(t => t.userId === userId);
    res.json(userTransactions);
  } catch (error) {
    console.error('Ошибка получения транзакций:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение ключей Outline
app.get('/api/user/:userId/outline-keys', (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const userKeys = Array.from(keys.values()).filter(key => key.userId === userId);
    res.json(userKeys);
  } catch (error) {
    console.error('Ошибка получения ключей Outline:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Outline API Routes

// Получение информации о сервере
app.get('/api/outline/server/:serverId', async (req, res) => {
  try {
    const response = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}`, createAxiosConfig());
    
    res.json({
      id: OUTLINE_SERVER_ID,
      name: 'США (Восточное побережье)',
      location: 'Нью-Йорк',
      flag: '🇺🇸',
      status: 'online',
      ...response.data
    });
  } catch (error) {
    console.error('Ошибка получения информации о сервере:', error.message);
    
    // Возвращаем тестовые данные если Outline сервер недоступен
    res.json({
      id: OUTLINE_SERVER_ID,
      name: 'США (Нью-Йорк)',
      location: 'Нью-Йорк',
      flag: '🇺🇸',
      status: 'offline',
      message: 'Outline сервер недоступен. Проверьте конфигурацию.',
      error: error.message
    });
  }
});

// Получение всех ключей сервера
app.get('/api/outline/server/:serverId/keys', async (req, res) => {
  try {
    const response = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/access-keys`, createAxiosConfig());
    
    // Получаем метрики для каждого ключа
    const keysWithStats = await Promise.all(
      response.data.accessKeys.map(async (key) => {
        try {
          const metricsResponse = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/metrics/transfer`, createAxiosConfig());
          
          const bytesTransferred = metricsResponse.data.bytesTransferredByUserId[key.id] || 0;
          
          return {
            ...key,
            trafficUsed: formatBytes(bytesTransferred),
            trafficLimit: '50 ГБ',
            status: 'active',
            createdAt: new Date().toISOString(),
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 дней
          };
        } catch (metricsError) {
          console.error('Ошибка получения метрик для ключа:', key.id, metricsError.message);
          return {
            ...key,
            trafficUsed: '0 Б',
            trafficLimit: '50 ГБ',
            status: 'active',
            createdAt: new Date().toISOString(),
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
        }
      })
    );
    
    res.json(keysWithStats);
  } catch (error) {
    console.error('Ошибка получения ключей:', error.message);
    
    // Возвращаем тестовые ключи если Outline сервер недоступен
    res.json([
      {
        id: 'test-key-1',
        name: 'Тестовый ключ 1',
        accessUrl: 'ss://test-key-1@outline.yourdomain.com:12345',
        trafficUsed: '0 Б',
        trafficLimit: '50 ГБ',
        status: 'active',
        createdAt: new Date().toISOString(),
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'test-key-2',
        name: 'Тестовый ключ 2',
        accessUrl: 'ss://test-key-2@outline.yourdomain.com:12345',
        trafficUsed: '15.2 ГБ',
        trafficLimit: '50 ГБ',
        status: 'active',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        expires: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }
});

// Создание нового ключа и привязка к пользователю
app.post('/api/outline/server/:serverId/keys', async (req, res) => {
  try {
    const { name, method = 'aes-256-gcm', password, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId обязателен' });
    }

    console.log('🚀 Создание ключа для пользователя:', userId);
    console.log('📝 Имя ключа:', name);

    // 1. Создаём ключ через кастомный API
    const createKeyUrl = `${OUTLINE_API_URL}/create-key`;
    console.log('🔗 URL создания ключа:', createKeyUrl);
    
    const response = await axios.post(createKeyUrl, {
      serverId: OUTLINE_SERVER_ID,
      name: name || 'Новый ключ',
      userId: userId
    }, createAxiosConfig({ 'Content-Type': 'application/json' }));

    console.log('✅ Ответ от сервера:', response.data);

    // 2. Сохраняем ключ в Map keys с привязкой к userId
    const newKey = {
      id: response.data.id || uuidv4(),
      userId,
      name: name || 'Новый ключ',
      accessUrl: response.data.accessUrl || response.data.key || `ss://${response.data.id}@80.209.242.200:10467`,
      status: 'active',
      trafficUsed: '0 Б',
      trafficLimit: '50 ГБ',
      createdAt: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    keys.set(newKey.id, newKey);

    console.log('💾 Ключ сохранён:', newKey);

    res.json(newKey);
  } catch (error) {
    console.error('❌ Ошибка создания ключа:', error.message);
    console.error('📋 Детали ошибки:', error.response?.data || error.message);
    
    // Возвращаем тестовый ключ для демонстрации
    const testKey = {
      id: uuidv4(),
      userId: req.body.userId,
      name: req.body.name || 'Тестовый ключ',
      accessUrl: 'ss://test-key@80.209.242.200:10467',
      status: 'active',
      trafficUsed: '0 Б',
      trafficLimit: '50 ГБ',
      createdAt: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    keys.set(testKey.id, testKey);
    
    res.json(testKey);
  }
});

// Удаление ключа
app.delete('/api/outline/server/:serverId/keys/:keyId', async (req, res) => {
  try {
    const { keyId } = req.params;
    
    await axios.delete(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/access-keys/${keyId}`, createAxiosConfig());
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления ключа:', error.message);
    res.status(500).json({ error: 'Ошибка удаления ключа' });
  }
});

// Переименование ключа
app.put('/api/outline/server/:serverId/keys/:keyId/name', async (req, res) => {
  try {
    const { keyId } = req.params;
    const { name } = req.body;
    
    const response = await axios.put(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/access-keys/${keyId}/name`, {
      name
    }, createAxiosConfig({ 'Content-Type': 'application/json' }));
    
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка переименования ключа:', error.message);
    res.status(500).json({ error: 'Ошибка переименования ключа' });
  }
});

// Получение метрик сервера
app.get('/api/outline/server/:serverId/metrics', async (req, res) => {
  try {
    const response = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/metrics/transfer`, createAxiosConfig());
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка получения метрик:', error.message);
    res.status(500).json({ error: 'Ошибка получения метрик' });
  }
});

// Получение информации о сервере (альтернативный маршрут)
app.get('/api/outline/server-info', async (req, res) => {
  try {
    const response = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}`, createAxiosConfig());
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка получения информации о сервере:', error.message);
    res.status(500).json({ error: 'Ошибка получения информации о сервере' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на порту ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Outline API: ${OUTLINE_API_URL}`);
});

// Вспомогательная функция для форматирования байтов
function formatBytes(bytes) {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 