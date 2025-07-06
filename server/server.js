const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на порту ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 