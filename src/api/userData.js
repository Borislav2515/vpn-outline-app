// API для работы с пользовательскими данными
class UserDataAPI {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  // Получение данных пользователя из URL параметров
  getTelegramUserData() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      id: urlParams.get('user_id'),
      first_name: urlParams.get('first_name'),
      last_name: urlParams.get('last_name'),
      username: urlParams.get('username'),
      language_code: urlParams.get('language_code'),
      is_bot: urlParams.get('is_bot') === 'true'
    };
  }

  // Получение статистики пользователя
  async getUserStats(userId) {
    try {
      // Здесь будет реальный API запрос
      // Пока возвращаем заглушку
      return {
        totalConnections: 0,
        totalData: '0 ГБ',
        favoriteServer: 'Нет данных',
        lastConnection: 'Нет подключений'
      };
    } catch (error) {
      console.error('Ошибка получения статистики:', error);
      return {
        totalConnections: 0,
        totalData: '0 ГБ',
        favoriteServer: 'Нет данных',
        lastConnection: 'Нет подключений'
      };
    }
  }

  // Получение трафика пользователя
  async getTrafficStats(userId) {
    try {
      // Здесь будет реальный API запрос
      return {
        totalUsed: '0 ГБ',
        totalLimit: '0 ГБ',
        remaining: '0 ГБ',
        period: '30 дней',
        dailyAverage: '0 ГБ',
        lastReset: 'Нет данных'
      };
    } catch (error) {
      console.error('Ошибка получения трафика:', error);
      return {
        totalUsed: '0 ГБ',
        totalLimit: '0 ГБ',
        remaining: '0 ГБ',
        period: '30 дней',
        dailyAverage: '0 ГБ',
        lastReset: 'Нет данных'
      };
    }
  }

  // Получение активных ключей
  async getActiveKeys(userId) {
    try {
      // Здесь будет реальный API запрос
      return [];
    } catch (error) {
      console.error('Ошибка получения ключей:', error);
      return [];
    }
  }

  // Получение баланса
  async getBalance(userId) {
    try {
      // Здесь будет реальный API запрос
      return {
        amount: '0.00',
        currency: '₽',
        status: 'Активен'
      };
    } catch (error) {
      console.error('Ошибка получения баланса:', error);
      return {
        amount: '0.00',
        currency: '₽',
        status: 'Активен'
      };
    }
  }

  // Получение транзакций
  async getTransactions(userId) {
    try {
      // Здесь будет реальный API запрос
      return [];
    } catch (error) {
      console.error('Ошибка получения транзакций:', error);
      return [];
    }
  }

  // Получение ключей Outline
  async getOutlineKeys(userId) {
    try {
      // Здесь будет реальный API запрос
      return [];
    } catch (error) {
      console.error('Ошибка получения ключей Outline:', error);
      return [];
    }
  }
}

export default new UserDataAPI(); 