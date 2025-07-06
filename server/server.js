const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config();

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
const OUTLINE_API_URL = process.env.OUTLINE_API_URL || 'https://your-outline-server.com/api';
const OUTLINE_API_KEY = process.env.OUTLINE_API_KEY || 'your-api-key';

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
    const response = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}`, {
      headers: {
        'Api-Key': OUTLINE_API_KEY
      }
    });
    
    res.json({
      id: OUTLINE_SERVER_ID,
      name: 'США (Нью-Йорк)',
      location: 'Нью-Йорк',
      flag: '🇺🇸',
      status: 'online',
      ...response.data
    });
  } catch (error) {
    console.error('Ошибка получения информации о сервере:', error.message);
    res.status(500).json({ error: 'Ошибка подключения к Outline серверу' });
  }
});

// Получение всех ключей сервера
app.get('/api/outline/server/:serverId/keys', async (req, res) => {
  try {
    const response = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/access-keys`, {
      headers: {
        'Api-Key': OUTLINE_API_KEY
      }
    });
    
    // Получаем метрики для каждого ключа
    const keysWithStats = await Promise.all(
      response.data.accessKeys.map(async (key) => {
        try {
          const metricsResponse = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/metrics/transfer`, {
            headers: {
              'Api-Key': OUTLINE_API_KEY
            }
          });
          
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
    res.status(500).json({ error: 'Ошибка получения ключей' });
  }
});

// Создание нового ключа
app.post('/api/outline/server/:serverId/keys', async (req, res) => {
  try {
    const { name, method = 'aes-256-gcm', password } = req.body;
    
    const response = await axios.post(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/access-keys`, {
      method,
      password
    }, {
      headers: {
        'Api-Key': OUTLINE_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    // Переименовываем ключ если указано имя
    if (name && response.data.id) {
      await axios.put(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/access-keys/${response.data.id}/name`, {
        name
      }, {
        headers: {
          'Api-Key': OUTLINE_API_KEY,
          'Content-Type': 'application/json'
        }
      });
    }
    
    res.json({
      ...response.data,
      name: name || 'Новый ключ',
      trafficUsed: '0 Б',
      trafficLimit: '50 ГБ',
      status: 'active',
      createdAt: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error('Ошибка создания ключа:', error.message);
    res.status(500).json({ error: 'Ошибка создания ключа' });
  }
});

// Удаление ключа
app.delete('/api/outline/server/:serverId/keys/:keyId', async (req, res) => {
  try {
    const { keyId } = req.params;
    
    await axios.delete(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/access-keys/${keyId}`, {
      headers: {
        'Api-Key': OUTLINE_API_KEY
      }
    });
    
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
    }, {
      headers: {
        'Api-Key': OUTLINE_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка переименования ключа:', error.message);
    res.status(500).json({ error: 'Ошибка переименования ключа' });
  }
});

// Получение метрик сервера
app.get('/api/outline/server/:serverId/metrics', async (req, res) => {
  try {
    const response = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}/metrics/transfer`, {
      headers: {
        'Api-Key': OUTLINE_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка получения метрик:', error.message);
    res.status(500).json({ error: 'Ошибка получения метрик' });
  }
});

// Проверка статуса сервера
app.get('/api/outline/server/:serverId/status', async (req, res) => {
  try {
    const response = await axios.get(`${OUTLINE_API_URL}/server/${OUTLINE_SERVER_ID}`, {
      headers: {
        'Api-Key': OUTLINE_API_KEY
      }
    });
    
    res.json({
      status: 'online',
      uptime: Date.now(),
      version: '1.0.0',
      ...response.data
    });
  } catch (error) {
    console.error('Ошибка проверки статуса:', error.message);
    res.json({
      status: 'offline',
      uptime: 0,
      version: 'unknown'
    });
  }
});

// Функция форматирования байтов
function formatBytes(bytes) {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на порту ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Outline API: ${OUTLINE_API_URL}`);
}); 